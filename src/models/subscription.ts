import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { SubscriptionAttributes } from '../types/subscription.js';

type SubscriptionCreationAttributes = Optional<SubscriptionAttributes, 'id' | 'confirmed' | 'token' | 'created_at'>;

export class Subscription extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes {
  public id!: number;
  public email!: string;
  public city!: string;
  public frequency!: 'hourly' | 'daily';
  public confirmed!: boolean;
  public token!: string;
  public created_at!: Date;
}

export function initSubscriptionModel(sequelize: Sequelize) {
  Subscription.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    frequency: {
      type: DataTypes.ENUM('hourly', 'daily'),
      allowNull: false
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'subscriptions',
    sequelize,
    timestamps: false
  });
}