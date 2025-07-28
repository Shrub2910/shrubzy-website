import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    out: '.drizzle',
    schema: './server/database/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        host: process.env.DATABASE_HOST!,
        port: parseInt(process.env.DATABASE_PORT!),
        user: process.env.DATABASE_USER!,
        password: process.env.DATABASE_PASSWORD!,
        database: process.env.DATABASE_DATABASE!,
        ssl: process.env.USE_SSL === 'true' ? {ca: process.env.SUPABASE_CA_CERT?.replace(/\\n/g, '\n')} : false,
        
    },
})