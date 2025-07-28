import {z} from 'zod'
import { useDrizzle } from "~/server/utils/drizzle"
import { likesTable, postsTable} from '~/server/database/schema'
import { eq, and } from 'drizzle-orm'

const bodySchema = z.object({
    postId: z.number()
})

export default defineEventHandler(async (event) => {
    const {user} = await requireUserSession(event)
    const {postId} = await readValidatedBody(event, bodySchema.parse).catch(() => {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid request body: post id required and must be a number'
        })
    })

    const db = useDrizzle()

    const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId)).limit(1)

    if (!post) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Post not found'
        })
    }

    const [existingLike] = await db.select().from(likesTable).where(and(eq(likesTable.userId, user.id), eq(likesTable.postId, postId))).limit(1)

    if (existingLike) {
        await db.delete(likesTable).where(and(eq(likesTable.userId, user.id), eq(likesTable.postId, postId)))
        return {message: 'Removed like'}
    }

    const like: typeof likesTable.$inferInsert = {
        userId: user.id,
        postId: postId
    }

    await db.insert(likesTable).values(like)
    return {message: 'Added like'}
})