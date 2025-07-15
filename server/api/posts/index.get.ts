import {z} from 'zod'
import { useDrizzle } from '#imports'
import { postsTable, usersTable } from '~/server/database/schema'
import { eq, gt } from 'drizzle-orm'

const querySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    afterId: z.coerce.number().int().positive().optional()
})

export default defineEventHandler(async (event) => {
    await requireUserSession(event)
    const {limit, afterId} = await getValidatedQuery(event, querySchema.parse)
    const db = useDrizzle()

    let posts

    if (afterId) {
        posts = await db.select({
            title: postsTable.title,
            body: postsTable.body,
            authorUsername: usersTable.username
        }).from(postsTable)
        .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
        .where(gt(postsTable.id, afterId)).limit(limit)
    } else {
        posts =  await db.select({
            title: postsTable.title,
            body: postsTable.body,
            authorUsername: usersTable.username
        }).from(postsTable)
        .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
        .limit(limit)
    }


    return posts

}) 