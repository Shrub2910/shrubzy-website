<script setup lang="ts">
    definePageMeta({
        middleware: ["auth"]
    })

    interface Post {
        title: string,
        body: string,
        authorEmail: string
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
            <button class="px-4 py-2 rounded-full hover:text-white bg-blue-400" @click="logout">Log Out</button>
        </div>

        <p v-if="user" class="mb-4">Welcome {{ user.email }}</p>
        <div v-for="(post, index) in posts" :key="index" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <UserPost :key="index" :title="post.title" :body="post.body" :email="post.authorEmail"/>
        </div>
    </div>
</template>