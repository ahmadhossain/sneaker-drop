import { QueryTypes } from 'sequelize';
import { sequelize, Reservation, Drop } from '../models';
import { expireReservation } from './reservationService';

export async function cleanupExpiredReservations(): Promise<void> {
  // 1. Expire reservations that are past their TTL
  await sequelize.transaction(async (t) => {
    const expired = await Reservation.findAll({
      where: sequelize.literal("status = 'active' AND expires_at < NOW()"),
      transaction: t,
    });

    if (expired.length === 0) {
      console.log('No orphaned reservations to clean up');
    } else {
      const stockReturns = new Map<string, number>();
      const reservationIds: string[] = [];

      for (const r of expired) {
        reservationIds.push(r.id);
        stockReturns.set(r.dropId, (stockReturns.get(r.dropId) || 0) + 1);
      }

      await Reservation.update(
        { status: 'expired' },
        { where: { id: reservationIds }, transaction: t }
      );

      for (const [dropId, count] of stockReturns) {
        await sequelize.query(
          `UPDATE drops SET stock = stock + :count, updated_at = NOW() WHERE id = :dropId`,
          { replacements: { count, dropId }, transaction: t }
        );
      }

      console.log(`Cleaned up ${expired.length} expired reservations across ${stockReturns.size} drops`);
    }
  });

  // 2. Re-schedule timers for reservations that are still active and not yet expired
  const stillActive = await Reservation.findAll({
    where: sequelize.literal("status = 'active' AND expires_at >= NOW()"),
  });

  for (const r of stillActive) {
    const ttl = Math.max(0, new Date(r.expiresAt).getTime() - Date.now());
    setTimeout(() => {
      expireReservation(r.id).catch((err) =>
        console.error(`Failed to expire reservation ${r.id}:`, err)
      );
    }, ttl);
  }

  if (stillActive.length > 0) {
    console.log(`Re-scheduled ${stillActive.length} active reservation timers`);
  }
}
