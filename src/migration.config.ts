import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config({});

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [path.join('dist', '**', '*.entity.js')],
  migrations: [path.join('dist', 'migrations', '*.js')],
  migrationsTableName: 'RS_migrations',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
