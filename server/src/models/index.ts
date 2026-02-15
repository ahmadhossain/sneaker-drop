import sequelize from '../config/database';
import User from './User';
import Drop from './Drop';
import Reservation from './Reservation';
import Purchase from './Purchase';

// User associations
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
User.hasMany(Purchase, { foreignKey: 'userId', as: 'purchases' });

// Drop associations
Drop.hasMany(Reservation, { foreignKey: 'dropId', as: 'reservations' });
Drop.hasMany(Purchase, { foreignKey: 'dropId', as: 'purchases' });

// Reservation associations
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Reservation.belongsTo(Drop, { foreignKey: 'dropId', as: 'drop' });
Reservation.hasOne(Purchase, { foreignKey: 'reservationId', as: 'purchase' });

// Purchase associations
Purchase.belongsTo(Reservation, { foreignKey: 'reservationId', as: 'reservation' });
Purchase.belongsTo(Drop, { foreignKey: 'dropId', as: 'drop' });
Purchase.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Drop, Reservation, Purchase };
