import {z} from 'zod'
import { useDrizzle } from '#imports'
import { postsTable } from '~/server/database/schema'

const bodySchema = z.object({
    title: z.string().max(120),
    body: z.string()
})

export default defineEventHandler(async (event) => {
    const {user} = await requireUserSession(event)
    const {title, body} = await readValidatedBody(event, bodySchema.parse)
    const db = useDrizzle()

    const post: typeof postsTable.$inferInsert = {
        title: title,
        body: body,
        authorId: user.id
    }

    await db.insert(postsTable).values(post)

    return {}
})