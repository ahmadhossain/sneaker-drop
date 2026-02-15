import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Drop extends Model {
  declare id: string;
  declare name: string;
  declare priceCents: number;
  declare totalUnits: number;
  declare stock: number;
  declare imageUrl: string | null;
  declare dropTime: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Drop.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    priceCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    totalUnits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    imageUrl: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    dropTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'drops',
    underscored: true,
  }
);

export default Drop;
