import "reflect-metadata";
import { DataSource } from "typeorm";
import { Link } from "./entity/Link";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: process.env.NODE_ENV === 'production'
    ? '/app/data/database.sqlite'
    : 'database.sqlite',
  synchronize: true,
  entities: [Link],
});
