import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: `${process.cwd()}/config/environments/${process.env.NODE_ENV}.env` });

export const connectionSource = new DataSource({
  type: 'postgres',
  migrationsTableName: 'migrations',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  entities: ['dist/**/**.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*'],
  logging: false,
  synchronize: false,
  name: 'default',
});
