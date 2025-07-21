<script setup lang="ts">
    import type { Post } from '~/types/post'

    definePageMeta({
        middleware: ["auth"]
    })

    const {user, clear: clearSession} = useUserSession()

    async function logout() {
        await clearSession()
        await navigateTo('/login')
    }

    const event = useRequestEvent()

    const {data: posts} = await useAsyncData<Post[]>(
        'posts',
        () => $fetch<Post[]>('/api/posts', {
            method: 'GET',
            query: {
                limit: 20
            },
            headers: {
                cookie: event?.node.req.headers.cookie || ''
            }
        }) 
    )

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
        <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <UserPost v-for="(post) in posts" :key="post.id" :post-id="post.id.toString()" :title="post.title" :body="post.body" :username="post.authorUsername"/>
        </div>
    </div>
</template>