<script setup lang="ts">
    import UserPost from '~/components/UserPost.vue';
    import type { Post } from '~/types/post';

    definePageMeta({
        middleware: ['auth']
    })

    const route = useRoute()
    const id = route.params.id as string



    const postsStore = usePostsStore()

    await callOnce(`post/${id}`, () => postsStore.fetchPost(id), {mode: 'navigation'})

    const post: Post | undefined = postsStore.currentPost

    const {user} = useUserSession()


</script>

<template>
    <main>
        <UserPost 
            v-if="post" 
            :user-owns-post="user.id === post?.authorId" 
            :post-id="id" 
            :title="post.title" 
            :body="post.body" 
            :username="post.authorUsername" 
            :like-count="post.likeCount"
            :is-liked="post.isLiked"
            delete-redirect="/" 
            :create-template="false"
        />
    </main>
</template>