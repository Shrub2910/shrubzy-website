<script setup lang="ts">
    import UserPost from '~/components/UserPost.vue';

    definePageMeta({
        middleware: ['auth']
    })

    const route = useRoute()
    const id = route.params.id as string



    const postsStore = usePostsStore()

    await callOnce(`post/${id}`, () => postsStore.fetchPost(id), {mode: 'navigation'})

    const post = postsStore.currentPost

    const {user} = useUserSession()


</script>

<template>
    <main>
        <UserPost :user-owns-post="user.id === post?.authorId" :post-id="id" :title="post?.title" :body="post?.body" :username="post?.authorUsername" />
    </main>
</template>