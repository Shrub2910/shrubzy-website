import {z} from 'zod'
import { useDrizzle } from "~/server/utils/drizzle"
import { usersTable } from '../database/schema'


const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
    const {email, password} = await readValidatedBody(event, bodySchema.parse)
    .catch(() => {throw createError({
        statusCode: 400,
        statusMessage: 'Invalid body'
    })})
    const db = useDrizzle()

    const hashedPassword = await hashPassword(password)

    const user: typeof usersTable.$inferInsert = {
        email: email,
        password: hashedPassword,
        username: email.substring(0, 20),
    }

    await db.insert(usersTable).values(user)

    return {}
})