<script setup lang="ts">
    import { usePostsStore } from '~/stores/posts'

    definePageMeta({
        middleware: ["auth"]
    })

    const {user, clear: clearSession} = useUserSession()

    async function logout() {
        await clearSession()
        await navigateTo('/login')
    }

    const postsStore = usePostsStore()

    await callOnce('posts', () => postsStore.fetchPosts(), {mode: 'navigation'})

    const posts = computed(() => postsStore.posts)

</script>

<template>
    <div>
        <div class="flex justify-between items-center h-12 mb-4">
            <h1 class="text-center text-white ml-4 text-2xl">Shrubzy</h1>
            <div class="flex gap-x-2">
                <NuxtLink to="/posts/create"><BaseButton>Create Post</BaseButton></NuxtLink>
                <BaseButton variant="secondary" @click="logout" >Log Out</BaseButton>
            </div>
        </div>

        <p v-if="user" class="mb-4 text-center font-semibold text-white text-2xl">Welcome {{ user.username }}</p>
        <div class="flex justify-center">
            <div class="flex flex-col gap-4 w-full max-w-7xl">
                <UserPost v-for="(post) in posts" :key="post.id" :user-owns-post="user.id === post.authorId" :post-id="post.id.toString()" :title="post.title" :body="post.body" :username="post.authorUsername"/>
            </div>
        </div>
    </div>
</template>