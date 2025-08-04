import { useDrizzle } from "~/server/utils/drizzle"
import { likesTable, postsTable, usersTable } from '~/server/database/schema'
import {count, eq, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import type { User } from "#auth-utils"

export const getPosts = (user?: User) => {
    const db = useDrizzle()

    const parent = alias(postsTable, 'parent')
    const replies = alias(postsTable, 'replies')

    const postLikes = db.select({
        postId: postsTable.id,
        likeCount: count(likesTable.postId).as('likeCount')
    })
    .from(postsTable)
    .leftJoin(likesTable, eq(postsTable.id, likesTable.postId))
    .groupBy(postsTable.id)
    .as('postLikes')

    const postReplies = db.select({
        postId: postsTable.id,
        replyCount: count(replies.id).as('replyCount')
    })
    .from(postsTable)
    .leftJoin(replies, eq(postsTable.id, replies.parentId))
    .groupBy(postsTable.id)
    .as('postReplies')

    const postIsLiked = db.select({
        postId: postsTable.id,
        isLiked: sql<boolean>`bool_or(${likesTable.userId} = ${user ? user.id : 0})`.as('isLiked')
    })
    .from(postsTable)
    .leftJoin(likesTable, eq(postsTable.id, likesTable.postId))
    .groupBy(postsTable.id)
    .as('postIsLiked')


    const query = db.select({
        id: postsTable.id,
        title: postsTable.title,
        body: postsTable.body,
        authorId: postsTable.authorId,
        authorUsername: usersTable.username,
        parentId: parent.id,
        parentTitle: parent.title,
        replyCount: postReplies.replyCount,
        likeCount: postLikes.likeCount,
        isLiked: postIsLiked.isLiked
    })
    .from(postsTable)
    .leftJoin(usersTable, eq(postsTable.authorId, usersTable.id))
    .leftJoin(parent, eq(postsTable.parentId, parent.id))
    .leftJoin(postReplies, eq(postsTable.id, postReplies.postId))
    .leftJoin(postLikes, eq(postsTable.id, postLikes.postId))
    .leftJoin(postIsLiked, eq(postsTable.id, postIsLiked.postId))

    return query
}