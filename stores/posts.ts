import { defineStore } from "pinia"
import type { Post } from "~/types/post"
import { useRequestFetch } from "#app"

export const usePostsStore = defineStore('posts', {
    state: (): {posts: Post[], currentPost: Post | undefined} => ({posts: [], currentPost: undefined}),

    actions: {
        async createPost(postBody: {title: string, body: string, parentId?: number}) {
            const requestFetch = useRequestFetch()

            const newPost: Post = await requestFetch<Post>('/api/posts', {
                method: 'POST',
                body: postBody
            })

            newPost.isLiked = false
            newPost.likeCount = 0
            newPost.replyCount = 0

            let replyPosts = [...this.posts, this.currentPost]

            replyPosts = replyPosts.filter(post => post?.id === postBody.parentId)

            replyPosts.forEach(post => {
                if (post){
                    post.replyCount += 1
                }
            })

            this.posts = [newPost, ...this.posts]
        },

        async fetchPosts(parentId?: string){
            const requestFetch = useRequestFetch()

            this.posts = await requestFetch<Post[]>('/api/posts', {
                    query: {limit: 20, parentId},
                }
            )
        },

        async fetchPost(id: string){
            const requestFetch = useRequestFetch()

            this.currentPost = await requestFetch<Post>(`/api/posts/${id}`)
        },

        async fetchMorePosts(parentId?: string) {
            const requestFetch = useRequestFetch()

            if (this.posts.length === 0) {
                return
            }

            const newPosts: Post[] = await requestFetch<Post[]>('/api/posts', {
                query: {
                    limit: 20,
                    parentId,
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

            
            const post = this.posts.find(post => post?.id === parseInt(id))

            const parentId = post?.parentId;

            [...this.posts, this.currentPost].filter(post => post?.id === parentId).forEach(post => {
                if (post) {
                    post.replyCount -= 1
                }
            })

            this.posts = this.posts.filter(post => post.id !== parseInt(id))
            this.posts = this.posts.filter(post => post.parentId !== parseInt(id))
        },

        async likePost(id: string) {
            const idNumber = parseInt(id)
            const allPosts = [...this.posts, this.currentPost]

            const posts = allPosts.filter(post => post?.id === idNumber)
            
            if (!posts) {
                return
            }

            posts.forEach((post) => {
                if (post) {
                    post.isLiked = !post.isLiked
                    post.likeCount += post.isLiked ? 1 : -1
                }
            })

            await $fetch('/api/likes', {
                method: 'PUT',
                body: {postId: idNumber}
            })


        }
    }
})