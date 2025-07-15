<script setup lang="ts">
    definePageMeta({
        middleware: ["auth"]
    })

    interface Post {
        title: string,
        body: string,
        authorUsername: string,
    }

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
            <h1 class="text-center ml-4 text-sm">Welcome to my shitty website</h1>
            <div class="flex">
            <NuxtLink to="/posts/create" class="px-4 py-2 mx-2 rounded-full hover:text-white bg-green-400">Create Post</NuxtLink>
            <button class="px-4 py-2 mx-2 rounded-full hover:text-white bg-blue-400" @click="logout">Log Out</button>
            </div>
        </div>

        <p v-if="user" class="mb-4 text-center text-2xl">Welcome {{ user.username }}</p>
        <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <UserPost v-for="(post, index) in posts" :key="index" :title="post.title" :body="post.body" :username="post.authorUsername"/>
        </div>
    </div>
</template>