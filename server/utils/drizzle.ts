import 'dotenv/config'
import {drizzle} from 'drizzle-orm/node-postgres'
import {Pool} from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.SUPABASE_CA_CERT
  },
});

const db = drizzle({client: pool})

export function useDrizzle() {
    return db
}