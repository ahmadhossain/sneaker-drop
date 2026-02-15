import { Transaction, QueryTypes } from 'sequelize';
import { sequelize, Reservation, Drop } from '../models';
import { getIO } from '../socket';

const RESERVATION_TTL_MS = 60_000;

export async function createReservation(
  userId: string,
  dropId: string
): Promise<Reservation> {
  const result = await sequelize.transaction(async (t: Transaction) => {
    // Check for existing active reservation for this user + drop
    const existing = await Reservation.findOne({
      where: { userId, dropId, status: 'active' },
      transaction: t,
    });

    if (existing) {
      throw new Error('You already have an active reservation for this drop');
    }

    // Atomically decrement stock — single SQL statement with row-level lock
    const [updated] = await sequelize.query<{ id: string; stock: number }>(
      `UPDATE drops SET stock = stock - 1, updated_at = NOW()
       WHERE id = :dropId AND stock > 0
       RETURNING id, stock`,
      { replacements: { dropId }, type: QueryTypes.SELECT, transaction: t }
    );

    if (!updated) {
      throw new Error('Drop is out of stock');
    }

    const expiresAt = new Date(Date.now() + RESERVATION_TTL_MS);

    const reservation = await Reservation.create(
      { userId, dropId, status: 'active', expiresAt },
      { transaction: t }
    );

    return { reservation, newStock: updated.stock };
  });

  // Emit AFTER transaction commits
  const io = getIO();
  io.emit('stock:updated', { dropId, stock: result.newStock });

  // Schedule expiration
  setTimeout(() => {
    expireReservation(result.reservation.id).catch((err) =>
      console.error(`Failed to expire reservation ${result.reservation.id}:`, err)
    );
  }, RESERVATION_TTL_MS);

  return result.reservation;
}

export async function expireReservation(reservationId: string): Promise<void> {
  let emitData: { userId: string; dropId: string; stock: number } | null = null;

  await sequelize.transaction(async (t: Transaction) => {
    // Lock reservation row
    const [reservation] = await sequelize.query<any>(
      `SELECT * FROM reservations WHERE id = :id FOR UPDATE`,
      { replacements: { id: reservationId }, type: QueryTypes.SELECT, transaction: t }
    );

    if (!reservation || reservation.status !== 'active') {
      return; // Already expired or purchased - idempotent
    }

    // Mark as expired
    await Reservation.update(
      { status: 'expired' },
      { where: { id: reservationId }, transaction: t }
    );

    // Return stock atomically
    const [updatedDrop] = await sequelize.query<{ id: string; stock: number }>(
      `UPDATE drops SET stock = stock + 1, updated_at = NOW()
       WHERE id = :dropId
       RETURNING id, stock`,
      { replacements: { dropId: reservation.drop_id }, type: QueryTypes.SELECT, transaction: t }
    );

    if (updatedDrop) {
      emitData = {
        userId: reservation.user_id,
        dropId: reservation.drop_id,
        stock: updatedDrop.stock,
      };
    }
  });

  // Emit AFTER transaction commits
  if (emitData) {
    const { userId, dropId, stock } = emitData;
    const io = getIO();
    io.to(`user:${userId}`).emit('reservation:expired', {
      reservationId,
      dropId,
    });
    io.emit('stock:updated', { dropId, stock });
  }
}
