import { User } from '../models';

const SEED_USERNAMES = [
  'Emma Johnson',
  'Liam Williams',
  'Olivia Brown',
  'Noah Jones',
  'Ava Garcia',
  'Elijah Martinez',
  'Sophia Rodriguez',
  'James Davis',
  'Isabella Wilson',
  'Benjamin Anderson',
  'Mia Thomas',
  'Lucas Taylor',
  'Charlotte Moore',
  'Mason Jackson',
  'Amelia Martin',
  'Ethan Lee',
  'Harper White',
  'Alexander Harris',
  'Evelyn Clark',
  'Daniel Lewis',
];

export async function seedUsers(): Promise<void> {
  for (const username of SEED_USERNAMES) {
    await User.findOrCreate({ where: { username } });
  }
  console.log(`Seeded ${SEED_USERNAMES.length} users`);
}
