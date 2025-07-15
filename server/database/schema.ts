import { pgTable, integer, varchar, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users",
    {
        id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
        email: varchar('email', {length: 320}).notNull().unique(),
        password: varchar('password', {length: 255}).notNull(),
        username: varchar('username', {length: 320}).unique(),
    }
)

export const userRelations = relations(usersTable, ({many}) => ({
    posts: many(postsTable),
}))

export const postsTable = pgTable("posts",
    {
        id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
        title: varchar('title', {length: 120}).notNull(),
        body: text('body'),
        authorId: integer('author_id')
    }
)

export const postRelations = relations(postsTable, ({one}) => ({
    author: one(usersTable, {
        fields: [postsTable.authorId],
        references: [usersTable.id],
    })
}))