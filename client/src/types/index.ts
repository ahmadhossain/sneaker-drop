export interface User {
  id: string;
  username: string;
}

export interface Drop {
  id: string;
  name: string;
  priceCents: number;
  totalUnits: number;
  stock: number;
  imageUrl: string | null;
  dropTime: string;
  recentPurchasers: { username: string; purchasedAt: string }[];
}

export interface Reservation {
  id: string;
  dropId: string;
  userId: string;
  status: string;
  expiresAt: string;
}
