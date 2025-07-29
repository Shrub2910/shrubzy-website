import {z} from 'zod'
import { useDrizzle } from "~/server/utils/drizzle"
import { postsTable, usersTable } from '~/server/database/schema'
import { eq } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

const bodySchema = z.object({
    title: z.string().trim().min(1).max(120),
    body: z.string().trim(),
    parentId: z.number().optional()
})

export default defineEventHandler(async (event) => {
    const {user} = await requireUserSession(event)
    const {title, body, parentId} = await readValidatedBody(event, bodySchema.parse)
    const db = useDrizzle()

    if (parentId) {
        const [parent] = await db.select().from(postsTable).where(eq(postsTable.id, parentId)).limit(1)
        if (!parent) {
            throw createError({
                statusCode: 404,
                statusMessage: "Parent not found: parent id matches no post"
            })
        }
    }

    const post: typeof postsTable.$inferInsert = {
        title: title,
        body: body,
        authorId: user.id,
        parentId: parentId ?? null
    }

    const [{id}] = await db.insert(postsTable).values(post).returning()

    const parent = alias(postsTable, 'parent')
    const [newPost] = await db.select({
            id: postsTable.id,
            title: postsTable.title,
            body: postsTable.body,
            authorId: postsTable.authorId,
            authorUsername: usersTable.username,
            parentId: postsTable.parentId,
            parentTitle: parent.title
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
    .leftJoin(parent, eq(postsTable.parentId, parent.id))
    .where(eq(postsTable.id, id))
    .limit(1)
    
    return newPost
})