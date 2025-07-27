import 'dotenv/config'
import {drizzle} from 'drizzle-orm/node-postgres'
import {Pool} from "pg"

const pool = new Pool({
  host: process.env.POSTGRES_HOST!,
  port: 5432,
  user: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  database: process.env.POSTGRES_DATABASE!,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.SUPABASE_CA_CERT
  },

});

const db = drizzle({client: pool})

export function useDrizzle() {
    return db
}