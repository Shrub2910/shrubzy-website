import 'dotenv/config'
import {drizzle} from 'drizzle-orm/node-postgres'
import {Pool} from "pg"

const pool = new Pool({
  host: process.env.DATABASE_HOST!,
  port: parseInt(process.env.DATBASE_PORT!),
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_DATABASE!,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.SUPABASE_CA_CERT?.replace(/\\n/g, '\n')
  },

});

const db = drizzle({client: pool})

export function useDrizzle() {
    return db
}