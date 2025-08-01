import { defineStore } from "pinia"
import type { Post } from "~/types/post"
import { useRequestFetch } from "#app"

export const usePostsStore = defineStore('posts', {
    state: (): {posts: Post[], currentPost: Post | undefined, loadingCount: number} => ({
        posts: [],
        currentPost: undefined,
        loadingCount: 0
    }),

    actions: {
        clearStore() {
            this.posts = []
            this.currentPost = undefined
        },

        beginLoading() {
            this.loadingCount++
        },

        finishLoading(){
            this.loadingCount--
        },

        async createPost(postBody: {title: string, body: string, parentId: number | null | undefined}) {
            const requestFetch = useRequestFetch()

            if (!postBody.parentId) {
                postBody.parentId = undefined
            }

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

        async fetchPosts(parentId?: string, userId?: string){
            const requestFetch = useRequestFetch()
            this.posts = []
            this.beginLoading()
            this.posts = await requestFetch<Post[]>('/api/posts', {
                    query: {limit: 20, parentId, userId},
                }
            )
            .finally(() => {
                this.finishLoading()
            })
        },

        async fetchPost(id: string){
            const requestFetch = useRequestFetch()
            this.currentPost = undefined
            this.beginLoading()
            this.currentPost = await requestFetch<Post>(`/api/posts/${id}`)
            this.finishLoading()
        },

        async fetchMorePosts(parentId?: string) {
            const requestFetch = useRequestFetch()

            if (this.posts.length === 0) {
                return
            }

            this.beginLoading()
            const newPosts: Post[] = await requestFetch<Post[]>('/api/posts', {
                query: {
                    limit: 20,
                    parentId,
                    afterId: this.posts[this.posts.length - 1].id
                }
            })
            this.finishLoading()

            this.posts = [...this.posts, ...newPosts]
        },

        async editPost(id: number, postBody: {title: string, body: string}) {
            const requestFetch = useRequestFetch()

            const editedPost: Post = await requestFetch<Post>(`/api/posts/${id}`, {
                method: 'PATCH',
                body: postBody
            })

            const allPosts = [...this.posts, this.currentPost]

            allPosts.forEach(post => {
                if (post && post.id === id){
                    post.title = editedPost.title
                    post.body = editedPost.body
                }
            })
        },

        async deletePost(id: number) {
            const requestFetch = useRequestFetch()

            await requestFetch<Post>(`/api/posts/${id}`, {
                method: 'DELETE',
            })

            
            const post = this.posts.find(post => post?.id === id)

            const parentId = post?.parentId;

            [...this.posts, this.currentPost].filter(post => post?.id === parentId).forEach(post => {
                if (post) {
                    post.replyCount -= 1
                }
            })

            this.posts = this.posts.filter(post => post.id !== id)
            this.posts = this.posts.filter(post => post.parentId !== id)
        },

        async likePost(id: number) {
            const allPosts = [...this.posts, this.currentPost]

            const posts = allPosts.filter(post => post?.id === id)
            
            if (!posts) {
                return
            }

            posts.forEach((post) => {
                if (post) {
                    post.isLiked = !post.isLiked
                    post.likeCount += post.isLiked ? 1 : -1

                    const userStore = useUsersStore()
                    const user = userStore.user

                    if (user && user.id === post.authorId) {
                        user.likeCount += post.isLiked ? 1 : -1
                    }
                }
            })

            await $fetch('/api/likes', {
                method: 'PUT',
                body: {postId: id}
            })


        }
    }
})