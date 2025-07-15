import {z} from 'zod'
import { useDrizzle } from '#imports'
import { usersTable } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

const bodySchema = z.object({
    username: z.string().min(4).max(20)
})

export default defineEventHandler(async (event) => {
    const {user} = await requireUserSession(event)
    const {username} = await readValidatedBody(event, bodySchema.parse)

    const db = useDrizzle()

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