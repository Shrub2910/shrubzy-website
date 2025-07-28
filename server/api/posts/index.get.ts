import {z} from 'zod'
import { useDrizzle } from "~/server/utils/drizzle"
import { likesTable, postsTable, usersTable } from '~/server/database/schema'
import { count, desc, eq, lt, sql } from 'drizzle-orm'

const querySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    afterId: z.coerce.number().int().positive().optional()
})

export default defineEventHandler(async (event) => {
    const {user} = await requireUserSession(event)
    const {limit, afterId} = await getValidatedQuery(event, querySchema.parse)
    const db = useDrizzle()

    let posts

    if (afterId) {
        posts = await db.select({
            id: postsTable.id,
            title: postsTable.title,
            body: postsTable.body,
            authorId: postsTable.authorId,
            authorUsername: usersTable.username,
            likeCount: count(likesTable.postId),
            isLiked: sql<boolean>`bool_or(${likesTable.userId} = ${user.id})`.as('isLiked')
        }).from(postsTable)
        .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
        .leftJoin(likesTable, eq(postsTable.id, likesTable.postId))
        .where(lt(postsTable.id, afterId))
        .groupBy(postsTable.id, postsTable.title, postsTable.body, postsTable.authorId, usersTable.username)
        .orderBy(desc(postsTable.id))
        .limit(limit)
    } else {
        posts = await db.select({
            id: postsTable.id,
            title: postsTable.title,
            body: postsTable.body,
            authorId: postsTable.authorId,
            authorUsername: usersTable.username,
            likeCount: count(likesTable.postId),
            isLiked: sql<boolean>`bool_or(${likesTable.userId} = ${user.id})`.as('isLiked')
        }).from(postsTable)
        .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
        .leftJoin(likesTable, eq(postsTable.id, likesTable.postId))
        .groupBy(postsTable.id, postsTable.title, postsTable.body, postsTable.authorId, usersTable.username)
        .orderBy(desc(postsTable.id))
        .limit(limit)
    }

   
    return posts

}) 