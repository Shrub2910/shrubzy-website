import { likesTable, postsTable, usersTable } from "~/server/database/schema"
import { useDrizzle } from "~/server/utils/drizzle"
import { count, eq, sql } from "drizzle-orm"

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

    const [post] = await db.select({
        id: postsTable.id,
        title: postsTable.title,
        body: postsTable.body,
        authorId: postsTable.authorId,
        authorUsername: usersTable.username,
        likeCount: count(likesTable.postId),
        isLiked: sql<boolean>`bool_or(${likesTable.userId} = ${user.id})`.as('isLiked')
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
    .leftJoin(likesTable, eq(postsTable.id, likesTable.postId))
    .where(eq(postsTable.id, id))
    .groupBy(postsTable.id, postsTable.title, postsTable.body, postsTable.authorId, usersTable.username)
    .limit(1)

    if (!post) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Post not found'
        })
    }

    return post


})