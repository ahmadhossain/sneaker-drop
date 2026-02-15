import { Transaction, QueryTypes } from 'sequelize'
import { sequelize, Reservation, Purchase, User } from '../models'

export async function completePurchase(
  userId: string,
  reservationId: string,
): Promise<Purchase> {
  const purchase = await sequelize.transaction(async (t: Transaction) => {
    // Lock reservation row
    const [reservation] = await sequelize.query<any>(
      `SELECT * FROM reservations WHERE id = :id FOR UPDATE`,
      {
        replacements: { id: reservationId },
        type: QueryTypes.SELECT,
        transaction: t,
      },
    )

    if (!reservation) {
      throw new Error('Reservation not found')
    }

    if (reservation.status !== 'active') {
      throw new Error(`Reservation is ${reservation.status}, cannot purchase`)
    }

    if (reservation.user_id !== userId) {
      throw new Error('Reservation does not belong to this user')
    }

    // Mark reservation as purchased
    await Reservation.update(
      { status: 'purchased' },
      { where: { id: reservationId }, transaction: t },
    )

    // Create purchase record
    const p = await Purchase.create(
      {
        reservationId,
        dropId: reservation.drop_id,
        userId,
      },
      { transaction: t },
    )

    return p
  })

  return purchase
}
