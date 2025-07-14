import {z} from 'zod'
import { useDrizzle } from '#imports'
import { usersTable } from '../database/schema'
import { sql } from 'drizzle-orm'

const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
    const {email, password} = await readValidatedBody(event, bodySchema.parse)
    const db = useDrizzle()

    const [user] = await db.select().from(usersTable).where(sql`${usersTable.email} = ${email}`).limit(1)

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: "Bad credentials",
        })
    }

    const passwordIsValid = await verifyPassword(user.password, password)

    if (!passwordIsValid) {
        throw createError({
            statusCode: 401,
            statusMessage: "Bad credentials",
        })
    }

    await setUserSession(event, 
        {
            user: {
                id: user.id,
                email: user.email,
            }
        }
    )

    return {}

})