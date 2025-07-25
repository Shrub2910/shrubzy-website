import {z} from 'zod'
import { postsTable } from "~/server/database/schema"
import { useDrizzle } from "~/server/utils/drizzle"
import { eq } from "drizzle-orm"

const bodySchema = z.object({
    title: z.string().min(1).max(120),
    body: z.string()
})

export default defineEventHandler(async (event) => {
    const {user} = await requireUserSession(event)
    const {title, body} = await readValidatedBody(event, bodySchema.parse)


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
        authorId: postsTable.authorId,
    }).from(postsTable).where(eq(postsTable.id, id)).limit(1)

    if (!post) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Post not found'
        })
    }

    if (post.authorId !== user.id) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Unauthorised to edit post'
        })
    }

    const [editedPost] = await db.update(postsTable)
    .set({
        title,
        body
    })
    .where(eq(postsTable.id, id))
    .returning()



    return editedPost
})