import {z} from 'zod'
import { useDrizzle } from "~/server/utils/drizzle"
import { likesTable, postsTable, usersTable } from '~/server/database/schema'
import { count, desc, eq, lt, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

const querySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    afterId: z.coerce.number().int().positive().optional(),
    parentId: z.coerce.number().int().positive().optional(),
})

export default defineEventHandler(async (event) => {
    const {user} = await requireUserSession(event)
    const {limit, afterId, parentId} = await getValidatedQuery(event, querySchema.parse)
    const db = useDrizzle()

    const parent = alias(postsTable, 'parent')
    const replies = alias(postsTable, 'replies')
    const query = db.select({
        id: postsTable.id,
        title: postsTable.title,
        body: postsTable.body,
        authorId: postsTable.authorId,
        authorUsername: usersTable.username,
        parentId: parent.id,
        parentTitle: parent.title,
        replyCount: count(replies.id).as('replyCount'),
        likeCount: count(likesTable.postId).as('likeCount'),
        isLiked: sql<boolean>`bool_or(${likesTable.userId} = ${user.id})`.as('isLiked')
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
    .leftJoin(likesTable, eq(postsTable.id, likesTable.postId))
    .leftJoin(parent, eq(postsTable.parentId, parent.id))
    .leftJoin(replies, eq(postsTable.id, replies.parentId))
    .groupBy(
        postsTable.id,
        postsTable.title,
        postsTable.body,
        postsTable.authorId,
        usersTable.username,
        parent.id,
        parent.title
    )
    .orderBy(desc(postsTable.id))
    .limit(limit)
    
    if (afterId) {
        query.where(lt(postsTable.id, afterId))
    }

    if (parentId) {
        query.where(eq(postsTable.parentId, parentId))
    }
    
    const posts = await query

   
    return posts

}) 