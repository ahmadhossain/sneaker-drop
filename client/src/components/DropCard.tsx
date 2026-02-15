import type { Drop, Reservation } from '../types'
import ReserveButton from './ReserveButton'
import PurchaseButton from './PurchaseButton'

interface DropCardProps {
  drop: Drop
  reservation: Reservation | null
  timeLeft: number
  isReserving: boolean
  isPurchasing: boolean
  onReserve: () => void
  onPurchase: () => void
}

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

export default function DropCard({
  drop,
  reservation,
  timeLeft,
  isReserving,
  isPurchasing,
  onReserve,
  onPurchase,
}: DropCardProps) {
  return (
    <div className="shadow-xl rounded-lg overflow-hidden transition-colors duration-200">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg leading-tight">{drop.name}</h3>
            <p className="font-bold text-xl mt-1">
              {formatPrice(drop.priceCents)}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold">
            {drop.stock === 0 ? (
              <span className="text-red-500">Sold Out</span>
            ) : (
              <span>
                <span className="text-2xl text-green-500">{drop.stock}</span> of{' '}
                {drop.totalUnits} remaining
              </span>
            )}
          </span>
        </div>

        {reservation ? (
          <div className="mt-4 space-y-3">
            <div className="text-center text-sm font-semibold">
              <span className="tabular-nums">{timeLeft}s</span> remaining to
              purchase
            </div>
            <PurchaseButton onPurchase={onPurchase} loading={isPurchasing} />
          </div>
        ) : (
          <div className="mt-4">
            <ReserveButton
              onReserve={onReserve}
              loading={isReserving}
              disabled={drop.stock === 0}
            />
          </div>
        )}

        <div className="mt-4 pt-4">
          <h4 className="text-xs font-semibold uppercase mb-2">
            Recent Purchases
          </h4>
          <ul className="space-y-1.5">
            {drop.recentPurchasers.slice(0, 3).map((p, i) => (
              <li
                key={`${p.username}-${i}`}
                className="flex items-center justify-between text-sm"
              >
                <span className="">{p.username}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
