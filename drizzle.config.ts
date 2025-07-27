import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    out: '.drizzle',
    schema: './server/database/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.POSTGRES_HOST!,
        port: 5432,
        user: process.env.POSTGRES_USER!,
        password: process.env.POSTGRES_PASSWORD!,
        database: process.env.POSTGRES_DATABASE!,
        ssl: {ca: process.env.SUPABASE_CA_CERT!},
        
    },
})