import pg from "pg";

let db;

export const connect = () => {
  if (!db) {
    db = new pg.Pool({
      connectionString: process.env.NEXT_PUBLIC_DB_URL,
    });
  }
  return db;
};