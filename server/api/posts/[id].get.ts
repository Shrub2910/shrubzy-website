import { likesTable, postsTable, usersTable } from "~/server/database/schema"
import { useDrizzle } from "~/server/utils/drizzle"
import { countDistinct, eq, sql } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

export default defineEventHandler( async (event) => {
    const {user} = await requireUserSession(event)

    const db = useDrizzle()

    const idParam = getRouterParam(event, 'id')

    if (!idParam || typeof(idParam) !== 'string') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing id parameter'
        })
    }

    const id = parseInt(idParam)
    
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
        replyCount: countDistinct(replies.id).as('replyCount'),
        likeCount: countDistinct(likesTable.postId).as('likeCount'),
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
    .where(eq(postsTable.id, id))
    .limit(1)

    const [post] = await query

    if (!post) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Post not found'
        })
    }

    return post


})