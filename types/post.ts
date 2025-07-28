export interface Post {
    id: number,
    title: string,
    body: string | null,
    authorId: number | null,
    authorUsername: string | null,
    likeCount: number,
    isLiked: boolean
}