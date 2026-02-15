import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Reservation extends Model {
  declare id: string;
  declare dropId: string;
  declare userId: string;
  declare status: 'active' | 'expired' | 'purchased';
  declare expiresAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Reservation.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    dropId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'drops',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: [['active', 'expired', 'purchased']],
      },
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'reservations',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'drop_id'],
        where: { status: 'active' },
        name: 'unique_active_reservation_per_user_drop',
      },
      {
        fields: ['expires_at'],
        where: { status: 'active' },
        name: 'idx_active_reservations_expires_at',
      },
      {
        fields: ['drop_id'],
        name: 'idx_reservations_drop_id',
      },
    ],
  }
);

export default Reservation;
