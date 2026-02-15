import http from 'http';
import app from './app';
import { sequelize, User } from './models';
import { initSocket } from './socket';
import { seedUsers } from './seed/seedUsers';
import { cleanupExpiredReservations } from './services/startupCleanup';

const PORT = parseInt(process.env.PORT || '3001', 10);

const server = http.createServer(app);

initSocket(server);

async function start(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    await sequelize.sync();
    console.log('Database synced');

    await seedUsers();

    await cleanupExpiredReservations();

    const users = await User.findAll();
    console.log('Users in database:');
    users.forEach((u) => console.log(`  - ${u.username} (${u.id})`));

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
