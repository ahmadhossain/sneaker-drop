import axios from 'axios';
import type { User, Drop, Reservation } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export async function getUser(id: string): Promise<User> {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
}

export async function getDrops(): Promise<Drop[]> {
  const { data } = await api.get<Drop[]>('/drops');
  return data;
}

export async function createDrop(drop: {
  name: string;
  priceCents: number;
  totalUnits: number;
  imageUrl?: string;
  dropTime: string;
}): Promise<Drop> {
  const { data } = await api.post<Drop>('/drops', drop);
  return data;
}

export async function reserveDrop(
  dropId: string,
  userId: string,
): Promise<Reservation> {
  const { data } = await api.post<Reservation>(`/drops/${dropId}/reserve`, {
    userId,
  });
  return data;
}

export async function completePurchase(
  reservationId: string,
  userId: string,
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    `/reservations/${reservationId}/purchase`,
    { userId },
  );
  return data;
}

export default api;
