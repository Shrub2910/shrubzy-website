import { pgTable, integer, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users",
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        email: varchar({length: 320}).notNull().unique(),
        password: varchar({length: 64}).notNull()
    }
)