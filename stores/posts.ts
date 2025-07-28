import { defineStore } from "pinia"
import type { Post } from "~/types/post"
import { useRequestFetch } from "#app"

export const usePostsStore = defineStore('posts', {
    state: (): {posts: Post[], currentPost: Post | undefined} => ({posts: [], currentPost: undefined}),

    actions: {
        async createPost(postBody: {title: string, body: string}) {
            const requestFetch = useRequestFetch()

            const newPost: Post = await requestFetch<Post>('/api/posts', {
                method: 'POST',
                body: postBody
            })

            this.posts = [newPost, ...this.posts]
        },

        async fetchPosts(){
            const requestFetch = useRequestFetch()

            this.posts = await requestFetch<Post[]>('/api/posts', {
                    query: {limit: 20},
                }
            )
        },

        async fetchPost(id: string){
            const requestFetch = useRequestFetch()

            this.currentPost = await requestFetch<Post>(`/api/posts/${id}`)
        },

        async fetchMorePosts() {
            const requestFetch = useRequestFetch()

            if (this.posts.length === 0) {
                return
            }

            const newPosts: Post[] = await requestFetch<Post[]>('/api/posts', {
                query: {
                    limit: 20,
                    afterId: this.posts[this.posts.length - 1].id
                }
            })

            this.posts = [...this.posts, ...newPosts]
        },

        async editPost(id: string, postBody: {title: string, body: string}) {
            const requestFetch = useRequestFetch()

            const editedPost: Post = await requestFetch<Post>(`/api/posts/${id}`, {
                method: 'PATCH',
                body: postBody
            })

            const allPosts = [...this.posts, this.currentPost]

            allPosts.forEach(post => {
                if (post && post.id === parseInt(id)){
                    post.title = editedPost.title
                    post.body = editedPost.body
                }
            })
        },

        async deletePost(id: string) {
            const requestFetch = useRequestFetch()

            await requestFetch<Post>(`/api/posts/${id}`, {
                method: 'DELETE',
            })

            this.posts = this.posts.filter(post => post.id !== parseInt(id))
        },

        async likePost(id: string) {
            const idNumber = parseInt(id)
            const post = this.posts.find(post => post.id === idNumber)
            
            if (!post) {
                return
            }

            await $fetch('/api/likes', {
                method: 'PUT',
                body: {postId: idNumber}
            }).then(() => {
                post.isLiked = !post.isLiked
                post.likeCount += post.isLiked ? 1 : -1
            })


        }
    }
})