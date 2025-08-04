import {z} from 'zod'
import { postsTable} from '~/server/database/schema'
import {desc, eq, lt} from 'drizzle-orm'
import { getPosts } from '~/server/database/queries/getPosts'

const querySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    afterId: z.coerce.number().int().positive().optional(),
    parentId: z.coerce.number().int().positive().optional(),
    userId: z.coerce.number().int().positive().optional(),
})

export default defineEventHandler(async (event) => {
    const {user} = await getUserSession(event)
    const {limit, afterId, parentId, userId} = await getValidatedQuery(event, querySchema.parse)

    const query = getPosts(user)
    .orderBy(desc(postsTable.id))
    .limit(limit)
    
    if (afterId) {
        query.where(lt(postsTable.id, afterId))
    }

    if (parentId) {
        query.where(eq(postsTable.parentId, parentId))
    }

    if (userId){
        query.where(eq(postsTable.authorId, userId))
    }
    
    const posts = await query

   
    return posts

}) 