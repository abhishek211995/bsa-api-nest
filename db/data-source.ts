import { DataSource, DataSourceOptions } from "typeorm";
// dotenv
import * as dotenv from "dotenv";
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: (process.env.DB_PORT as unknown as number) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: ["dist/db/migrations/*{.ts,.js}"],
  // migrationsRun: false,
  // synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
