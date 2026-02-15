import { useCallback, useEffect, useState } from 'react'
import type { Drop } from '../types'
import { getDrops } from '../services/api'
import { useSocket } from './useSocket'

export function useDrops() {
  const socket = useSocket()
  const [drops, setDrops] = useState<Drop[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDrops = useCallback(() => {
    getDrops()
      .then(setDrops)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchDrops()
  }, [fetchDrops])

  useEffect(() => {
    function handleStockUpdated(payload: { dropId: string; stock: number }) {
      setDrops((prev) =>
        prev.map((d) =>
          d.id === payload.dropId ? { ...d, stock: payload.stock } : d,
        ),
      )
    }

    socket.on('stock:updated', handleStockUpdated)

    return () => {
      socket.off('stock:updated', handleStockUpdated)
    }
  }, [socket])

  return { drops, loading }
}
