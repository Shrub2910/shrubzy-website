import {z} from 'zod'
import { useDrizzle } from '#imports'
import { usersTable } from '../database/schema'


const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
    const {email, password} = await readValidatedBody(event, bodySchema.parse)
    const db = useDrizzle()

    const hashedPassword = await hashPassword(password)

    const user: typeof usersTable.$inferInsert = {
        email: email,
        password: hashedPassword,
        username: email,
    }

    await db.insert(usersTable).values(user)

    return {}
})