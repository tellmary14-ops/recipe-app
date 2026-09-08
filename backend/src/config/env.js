import "dotenv/config";

export const ENV = {
  PORT: process.env.PORT || 5001,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  DB_HOST: process.env.DB_HOST || "127.0.0.1",
  DB_USER: process.env.DB_USER || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_NAME: process.env.DB_NAME || "recipe_app",
  DB_PORT: process.env.DB_PORT || "3306",
};
