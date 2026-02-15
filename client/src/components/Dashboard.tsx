import { useDrops } from '../hooks/useDrops'
import { useReservation } from '../hooks/useReservation'
import DropCard from './DropCard'

interface DashboardProps {
  userId: string
}

export default function Dashboard({ userId }: DashboardProps) {
  const { drops, loading } = useDrops()
  const {
    getReservation,
    getTimeLeft,
    isReserving,
    isPurchasing,
    reserve,
    purchase,
  } = useReservation(userId)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-300 border rounded-2xl h-80 animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (drops.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">No Drops Yet</h2>
        <p className="text-gray-400">
          Check back soon for upcoming sneaker drops.
        </p>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {drops.map((drop) => {
          const reservation = getReservation(drop.id)
          return (
            <DropCard
              key={drop.id}
              drop={drop}
              reservation={reservation}
              timeLeft={getTimeLeft(drop.id)}
              isReserving={isReserving(drop.id)}
              isPurchasing={reservation ? isPurchasing(reservation.id) : false}
              onReserve={() => reserve(drop.id)}
              onPurchase={() =>
                reservation && purchase(reservation.id, drop.id)
              }
            />
          )
        })}
      </div>
    </main>
  )
}
