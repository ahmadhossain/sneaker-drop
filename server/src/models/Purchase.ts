import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Purchase extends Model {
  declare id: string;
  declare reservationId: string;
  declare dropId: string;
  declare userId: string;
  declare purchasedAt: Date;
}

Purchase.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reservationId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'reservations',
        key: 'id',
      },
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
    purchasedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'purchases',
    underscored: true,
    timestamps: false,
    indexes: [
      {
        fields: ['drop_id', 'purchased_at'],
        name: 'idx_purchases_drop_id_purchased_at',
      },
    ],
  }
);

export default Purchase;
