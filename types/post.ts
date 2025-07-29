export interface Post {
    id: number,
    title: string,
    body: string | null,
    authorId: number | null,
    authorUsername: string | null,
    parentId: number | null,
    parentTitle: string | null,
    likeCount: number,
    replyCount: number,
    isLiked: boolean
}