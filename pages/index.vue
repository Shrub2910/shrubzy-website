<script setup lang="ts">
    import { usePostsStore } from '~/stores/posts'

    definePageMeta({
        middleware: ["auth"]
    })

    const showTemplate = ref(false)
    const {user, clear: clearSession} = useUserSession()

    async function logout() {
        await clearSession()
        await navigateTo('/login')
    }

    function toggleTemplate() {
        showTemplate.value = !showTemplate.value
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
                <BaseButton @click="toggleTemplate">Create Post</BaseButton>
                <BaseButton variant="secondary" @click="logout" >Log Out</BaseButton>
            </div>
        </div>

        <p v-if="user" class="mb-4 text-center font-semibold text-white text-2xl">Welcome {{ user.username }}</p>
        <div class="flex justify-center">
            <div class="flex flex-col gap-4 w-full max-w-7xl">
                <UserPost 
                    v-if="showTemplate"
                    :user-owns-post="true"
                    post-id="0"
                    title="Title"
                    body="Body"
                    username=""
                    :create-template="true"
                    :hide-post="toggleTemplate"
                />
                <UserPost 
                    v-for="(post) in posts" 
                    :key="post.id" 
                    :user-owns-post="user.id === post.authorId" 
                    :post-id="post.id.toString()" 
                    :title="post.title" 
                    :body="post.body" 
                    :username="post.authorUsername"
                    :create-template="false"
                />
                <BaseButton class="mx-2 mb-2 text-2xl" @click="postsStore.fetchMorePosts">Show More</BaseButton>
            </div>
        </div>
    </div>
</template>