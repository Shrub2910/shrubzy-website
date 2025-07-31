<script setup lang="ts">
    import { useUsersStore } from '~/stores/users';

    definePageMeta({
        middleware: ['auth']
    })

    const {user} = useUserSession()

    const route = useRoute()
    const id = route.params.id as string

    const usersStore = useUsersStore()
    const postsStore = usePostsStore()

    await callOnce(() => usersStore.fetchUser(id), {mode: 'navigation'})
    await callOnce(() => postsStore.fetchPosts(undefined, id), {mode: 'navigation'})

    const userInfo = computed(() => usersStore.user)
    const posts = computed(() => postsStore.posts)


</script>

<template>
    <div v-if="userInfo">
        <NuxtLink to="/" class="m-2"><BaseButton variant="secondary">Back</BaseButton></NuxtLink>
        <h1 class="text-gray-100 text-4xl text-center my-4 font-semibold">{{ userInfo.username }}</h1>
        <div class="flex justify-center gap-2">
            <p class="text-gray-100 p-2 bg-blue-400 rounded-xl text-xl">Posts: {{ userInfo.postsCount }}</p>
            <p class="text-gray-100 p-2 bg-blue-400 rounded-xl text-xl">Likes: {{ userInfo.likeCount }}</p>
        </div>
        <div class="flex justify-center mt-4">
        <div class="flex flex-col gap-4 w-full max-w-7xl">
            <UserPost 
                v-for="(post) in posts"
                :key="post.id"
                :post="post"
                :user="user"
                :create-template="false"
            />
        </div>
        </div>
    </div>

</template>