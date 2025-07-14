import { pgTable, integer, varchar, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users",
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        email: varchar({length: 320}).notNull().unique(),
        password: varchar({length: 255}).notNull()
    }
)

export const userRelations = relations(usersTable, ({many}) => ({
    posts: many(postsTable),
}))

export const postsTable = pgTable("posts",
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        title: varchar({length: 120}).notNull(),
        body: text(),
        authorId: integer()
    }
)

export const postRelations = relations(postsTable, ({one}) => ({
    author: one(usersTable, {
        fields: [postsTable.authorId],
        references: [usersTable.id],
    })
}))