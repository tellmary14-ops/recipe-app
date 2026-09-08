import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { ENV } from "./env.js";
import * as schema from "../db/schema.js";

const pool = mysql.createPool({
	host: ENV.DB_HOST,
	user: ENV.DB_USER,
	port: Number(ENV.DB_PORT),
	password: ENV.DB_PASSWORD,
	database: ENV.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

export const db = drizzle(pool, { schema, mode: "default" });
export { pool };
