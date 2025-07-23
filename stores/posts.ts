import { defineStore } from "pinia"
import type { Post } from "~/types/post"
import { useSSRHeaders } from "~/server/utils/ssrheaders"

export const usePostsStore = defineStore('posts', {
    state: (): {posts: Post[], currentPost: Post | undefined} => ({posts: [], currentPost: undefined}),

    actions: {
        async fetchPosts(){
            const headers = useSSRHeaders()

            this.posts = await $fetch<Post[]>('/api/posts', {
                    headers,
                    query: {limit: 20},
                }
            )
        },

        async fetchPost(id: string){
            const headers = useSSRHeaders()

            this.currentPost = await $fetch<Post>(`/api/posts/${id}`, {
                headers
            })
        }
    }
})