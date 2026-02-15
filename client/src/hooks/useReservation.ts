import { useCallback, useEffect, useRef, useState } from 'react';
import type { Reservation } from '../types';
import { reserveDrop, completePurchase } from '../services/api';
import { useSocket } from './useSocket';
import { useToast } from './useToast';

export function useReservation(userId: string) {
  const socket = useSocket();
  const { addToast } = useToast();
  const [reservations, setReservations] = useState<
    Record<string, Reservation>
  >({});
  const [timeLeftMap, setTimeLeftMap] = useState<Record<string, number>>({});
  const [reservingDropId, setReservingDropId] = useState<string | null>(null);
  const [purchasingReservationId, setPurchasingReservationId] = useState<
    string | null
  >(null);
  const intervalsRef = useRef<Record<string, ReturnType<typeof setInterval>>>(
    {},
  );

  const clearCountdown = useCallback((dropId: string) => {
    if (intervalsRef.current[dropId]) {
      clearInterval(intervalsRef.current[dropId]);
      delete intervalsRef.current[dropId];
    }
  }, []);

  const startCountdown = useCallback(
    (dropId: string, expiresAt: string) => {
      clearCountdown(dropId);

      const updateTimeLeft = () => {
        const remaining = Math.max(
          0,
          Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
        );
        setTimeLeftMap((prev) => ({ ...prev, [dropId]: remaining }));
        if (remaining <= 0) {
          clearCountdown(dropId);
          setReservations((prev) => {
            const next = { ...prev };
            delete next[dropId];
            return next;
          });
          setTimeLeftMap((prev) => {
            const next = { ...prev };
            delete next[dropId];
            return next;
          });
        }
      };

      updateTimeLeft();
      intervalsRef.current[dropId] = setInterval(updateTimeLeft, 1000);
    },
    [clearCountdown],
  );

  const reserve = useCallback(
    async (dropId: string) => {
      setReservingDropId(dropId);
      try {
        const reservation = await reserveDrop(dropId, userId);
        setReservations((prev) => ({ ...prev, [dropId]: reservation }));
        startCountdown(dropId, reservation.expiresAt);
        addToast('Reservation created! Complete your purchase.', 'success');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to reserve';
        addToast(message, 'error');
      } finally {
        setReservingDropId(null);
      }
    },
    [userId, startCountdown, addToast],
  );

  const purchase = useCallback(
    async (reservationId: string, dropId: string) => {
      setPurchasingReservationId(reservationId);
      try {
        await completePurchase(reservationId, userId);
        clearCountdown(dropId);
        setReservations((prev) => {
          const next = { ...prev };
          delete next[dropId];
          return next;
        });
        setTimeLeftMap((prev) => {
          const next = { ...prev };
          delete next[dropId];
          return next;
        });
        addToast('Purchase completed!', 'success');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Purchase failed';
        addToast(message, 'error');
      } finally {
        setPurchasingReservationId(null);
      }
    },
    [userId, clearCountdown, addToast],
  );

  useEffect(() => {
    function handleExpired(payload: { reservationId: string; dropId: string }) {
      clearCountdown(payload.dropId);
      setReservations((prev) => {
        const next = { ...prev };
        delete next[payload.dropId];
        return next;
      });
      setTimeLeftMap((prev) => {
        const next = { ...prev };
        delete next[payload.dropId];
        return next;
      });
      addToast('Reservation expired', 'error');
    }

    socket.on('reservation:expired', handleExpired);
    return () => {
      socket.off('reservation:expired', handleExpired);
    };
  }, [socket, clearCountdown, addToast]);

  useEffect(() => {
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, []);

  return {
    getReservation: (dropId: string) => reservations[dropId] ?? null,
    getTimeLeft: (dropId: string) => timeLeftMap[dropId] ?? 0,
    isReserving: (dropId: string) => reservingDropId === dropId,
    isPurchasing: (reservationId: string) =>
      purchasingReservationId === reservationId,
    reserve,
    purchase,
  };
}
