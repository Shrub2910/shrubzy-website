import { defineStore } from "pinia"
import type { Post } from "~/types/post"
import { useRequestHeaders } from "#app"

export const usePostsStore = defineStore('posts', {
    state: (): {posts: Post[], currentPost: Post | undefined} => ({posts: [], currentPost: undefined}),

    actions: {
        async fetchPosts(){
            const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

            this.posts = await $fetch<Post[]>('/api/posts', {
                    headers,
                    query: {limit: 20},
                }
            )
        },

        async fetchPost(id: string){
            const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

            this.currentPost = await $fetch<Post>(`/api/posts/${id}`, {
                headers
            })
        },

        async deletePost(id: string) {
            const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

            await $fetch<Post>(`/api/posts/${id}`, {
                method: 'DELETE',
                headers
            })

            this.posts = this.posts.filter(post => post.id !== parseInt(id))
        }
    }
})