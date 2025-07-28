import { pgTable, integer, varchar, text, primaryKey } from "drizzle-orm/pg-core";
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
    likes: many(likesTable)
}))

export const postsTable = pgTable("posts",
    {
        id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
        title: varchar('title', {length: 120}).notNull(),
        body: text('body'),
        authorId: integer('author_id')
    }
)

export const postRelations = relations(postsTable, ({one, many}) => ({
    author: one(usersTable, {
        fields: [postsTable.authorId],
        references: [usersTable.id],
    }),

    likes: many(likesTable)
}))

export const likesTable = pgTable("likes",
    {
        userId: integer('user_id')
        .notNull()
        .references(() => usersTable.id, {onDelete: "cascade"}),
        postId: integer('post_id')
        .notNull()
        .references(() => postsTable.id, {onDelete: "cascade"})
    },
    (t) => [
        primaryKey({columns: [t.userId, t.postId]})
    ],
)

export const likesRelations = relations(likesTable, ({one}) => ({
    user: one(usersTable, {
        fields: [likesTable.userId],
        references: [usersTable.id]
    }),

    post: one(postsTable, {
        fields: [likesTable.postId],
        references: [postsTable.id]
    })
}))