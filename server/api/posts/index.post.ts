import {z} from 'zod'
import { useDrizzle } from "~/server/utils/drizzle"
import { postsTable, usersTable } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

const bodySchema = z.object({
    title: z.string().min(1).max(120),
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

    const [{id}] = await db.insert(postsTable).values(post).returning()

    console.log(id)

    const [newPost] = await db.select({
            id: postsTable.id,
            title: postsTable.title,
            body: postsTable.body,
            authorId: postsTable.authorId,
            authorUsername: usersTable.username
    }).from(postsTable).leftJoin(usersTable, eq(postsTable.authorId, usersTable.id)).where(eq(postsTable.id, id)).limit(1)
    
    console.log(newPost)

    return newPost
})