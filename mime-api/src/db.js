import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // En Render normalmente necesitas SSL
  ssl: process.env.DATABASE_URL?.includes("postgresql://mime_db_user:oipCeSG7kPcODX424VvmCU1CuxXr1rhg@dpg-d5e45qogjchc739gvk4g-a/mime_db")
    ? false
    : { rejectUnauthorized: false },
});
