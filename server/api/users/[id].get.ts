import { getUsers } from "~/server/database/queries/getUsers"
import { usersTable } from "~/server/database/schema"
import { eq } from "drizzle-orm"

export default defineEventHandler(async (event) => {
    await requireUserSession(event)

    const idParam = getRouterParam(event, 'id')

    if (!idParam || typeof(idParam) !== 'string') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing id parameter'
        })
    }

    const id = parseInt(idParam)

    const query = getUsers()
    .where(eq(usersTable.id, id))
    .limit(1)

    const [user] = await query

    console.log(user.postsCount)

    if (!user) {
        throw createError({
            statusCode: 404,
            statusMessage: 'User not found'
        })
    }

    user.likeCount = Number(user.likeCount)

    return user
})