import { Drop, Purchase, User } from '../models';
import sequelize from '../config/database';
import { QueryTypes } from 'sequelize';

interface CreateDropInput {
  name: string;
  priceCents: number;
  totalUnits: number;
  imageUrl?: string;
  dropTime: string;
}

interface DropWithPurchasers {
  id: string;
  name: string;
  priceCents: number;
  totalUnits: number;
  stock: number;
  imageUrl: string | null;
  dropTime: string;
  createdAt: string;
  updatedAt: string;
  recentPurchasers: { username: string; purchasedAt: string }[];
}

export async function createDrop(data: CreateDropInput): Promise<Drop> {
  // Normalize dropTime to UTC — reject ambiguous timestamps without timezone
  const parsed = new Date(data.dropTime);
  if (isNaN(parsed.getTime())) {
    throw new Error('Invalid dropTime — use ISO 8601 format (e.g. 2026-02-15T12:00:00Z)');
  }

  const drop = await Drop.create({
    name: data.name,
    priceCents: data.priceCents,
    totalUnits: data.totalUnits,
    stock: data.totalUnits,
    imageUrl: data.imageUrl || null,
    dropTime: parsed.toISOString(),
  });
  return drop;
}

export async function getAllDrops(): Promise<DropWithPurchasers[]> {
  const drops = await Drop.findAll({
    where: sequelize.literal('drop_time <= NOW()'),
    order: [['dropTime', 'DESC']],
  });

  const results: DropWithPurchasers[] = [];

  for (const drop of drops) {
    const recentPurchasers = await Purchase.findAll({
      where: { dropId: drop.id },
      order: [['purchasedAt', 'DESC']],
      limit: 3,
      include: [{ model: User, as: 'user', attributes: ['username'] }],
    });

    results.push({
      id: drop.id,
      name: drop.name,
      priceCents: drop.priceCents,
      totalUnits: drop.totalUnits,
      stock: drop.stock,
      imageUrl: drop.imageUrl,
      dropTime: drop.dropTime.toISOString(),
      createdAt: drop.createdAt.toISOString(),
      updatedAt: drop.updatedAt.toISOString(),
      recentPurchasers: recentPurchasers.map((p: any) => ({
        username: p.user.username,
        purchasedAt: p.purchasedAt.toISOString(),
      })),
    });
  }

  return results;
}
