import { postsTable, usersTable } from "~/server/database/schema"
import { useDrizzle } from "#imports"
import { eq } from "drizzle-orm"

export default defineEventHandler( async (event) => {
    await requireUserSession(event)

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
        authorUsername: usersTable.username
    }).from(postsTable).leftJoin(usersTable, eq(postsTable.authorId, usersTable.id)).where(eq(postsTable.id, id)).limit(1)

    if (!post) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Post not found'
        })
    }

    return post


})