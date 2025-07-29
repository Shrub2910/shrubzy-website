import { postsTable} from "~/server/database/schema"
import { eq} from "drizzle-orm"
import { getPosts } from "~/server/database/queries/getPosts"

export default defineEventHandler( async (event) => {
    const {user} = await requireUserSession(event)

    const idParam = getRouterParam(event, 'id')

    if (!idParam || typeof(idParam) !== 'string') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing id parameter'
        })
    }

    const id = parseInt(idParam)

    const query = getPosts(user)
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