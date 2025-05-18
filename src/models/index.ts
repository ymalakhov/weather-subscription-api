import { Sequelize } from 'sequelize';
import { initSubscriptionModel, Subscription } from './subscription.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASS as string,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: Number(process.env.DB_PORT),
    logging: false
  }
);

initSubscriptionModel(sequelize);

export { sequelize, Subscription };
