import { count, eq, sql } from "drizzle-orm"
import { likesTable, postsTable, usersTable } from "../schema"

export const getUsers = () => {
    const db = useDrizzle()

    const userPosts = db.select({
        id: usersTable.id,
        postsCount: count(postsTable.id).as('postsCount')
    })
    .from(usersTable)
    .leftJoin(postsTable, eq(usersTable.id, postsTable.authorId))
    .groupBy(usersTable.id)
    .as('userPosts')

    const userLikes = db.select({
        userId: postsTable.authorId,
        likeCount: count(likesTable.postId).as('likeCount')
    })
    .from(likesTable)
    .innerJoin(postsTable, eq(likesTable.postId, postsTable.id))
    .groupBy(postsTable.authorId)
    .as('userLikes')

    const query = db.select({
        id: usersTable.id,
        username: usersTable.username,
        postsCount: userPosts.postsCount,
        likeCount: sql<number>`COALESCE(${userLikes.likeCount}, 0)`.as('likeCount')
    })
    .from(usersTable)
    .leftJoin(userPosts, eq(usersTable.id, userPosts.id))
    .leftJoin(userLikes, eq(userLikes.userId, usersTable.id))

    return query
}