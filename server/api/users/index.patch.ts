import {z} from 'zod'
import { useDrizzle } from "~/server/utils/drizzle"
import { usersTable } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

const bodySchema = z.object({
    username: z.string().min(4).max(20)
})

export default defineEventHandler(async (event) => {
    const {user} = await requireUserSession(event)
    const {username} = await readValidatedBody(event, bodySchema.parse).catch(() => {
        throw createError({
            statusCode: 400,
            statusMessage: 'Username not valid: username must be a string and between 4 and 20 characters'
        })
    })

    const db = useDrizzle()

    const [userExists] = await db.select().from(usersTable).where(eq(usersTable.id, user.id)).limit(1)

    if (!userExists) {
        throw createError({
            statusCode: 403,
            statusMessage: "User you are tyring to edit doesn't exist"
        })
    }

    try{

        await db.update(usersTable).set({
            username: username
        })
        .where(eq(usersTable.id, user.id))

        

        await replaceUserSession(event, {
            user: {
                id: user.id,
                email: user.email,
                username: username,
            }
        })

        
    }
    catch (err) {
        console.log('Error occured:', err)
    }

    return {}

})