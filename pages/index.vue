<script setup lang="ts">
    import { usePostsStore } from '~/stores/posts'
    import type { Post } from '~/types/post'

    const showTemplate = ref(false)


    const replyId = ref<number | null>(null)
    const replyTitle = ref('')
    
    const {user, clear: clearSession} = useUserSession()

    async function logout() {
        await clearSession()
    }

    function toggleTemplate() {
        showTemplate.value = !showTemplate.value
        if (!showTemplate.value) {
            replyId.value = null
            replyTitle.value = ''
        }
    }

    function replyPost(id: number, title: string) {
        replyId.value = id
        replyTitle.value = title

        showTemplate.value = true
        scrollTo(0,0)
    }

    const templatePost = computed<Post>(() => ({
        id: 0,
        title: 'Title',
        body: 'Body',
        authorId: user.id,
        authorUsername: null,
        parentId: replyId.value,
        parentTitle: replyTitle.value,
        likeCount: 0,
        replyCount: 0,
        isLiked: false,
    }))

    const postsStore = usePostsStore()

    await callOnce('fetchPosts', () => postsStore.fetchPosts(), {mode: 'navigation'})

    const posts = computed(() => postsStore.posts)

</script>

<template>
    <div>
        <div class="flex justify-between items-center h-12 mb-4">
            <h1 class="text-center text-white ml-4 text-2xl"><NuxtLink to="/">Shrubzy</NuxtLink></h1>
            <div class="flex gap-x-2">
                <BaseButton v-if="user" @click="toggleTemplate">Create Post</BaseButton>
                <BaseButton v-if="user" variant="secondary" @click="logout" >Log Out</BaseButton>
                <NuxtLink v-if="!user" to="/login"><BaseButton>Sign in</BaseButton></NuxtLink>
            </div>
        </div>

        <p v-if="user" class="mb-4 text-center font-semibold text-white text-2xl">Welcome {{ user.username }}</p>
        <div v-if="user" class="flex justify-center mb-2">
            <NuxtLink :to="`/users/${user.id}`"><BaseButton>User Profile</BaseButton></NuxtLink>
        </div>
        <div class="flex justify-center">
            <div class="flex flex-col gap-4 w-full max-w-7xl">
                <UserPost 
                    v-if="showTemplate"
                    :post="templatePost"
                    :user="user"
                    :create-template="true"
                    :hide-post="toggleTemplate"
                />
                <UserPost 
                    v-for="(post) in posts" 
                    :key="post.id" 
                    :post="post"
                    :user="user"
                    :create-template="false"
                    :reply-post="replyPost"
                />
                <h1 v-if="postsStore.loadingCount !== 0" class="text-gray-100 text-center text-2xl">LOADING ...</h1>
                <BaseButton v-if="postsStore.loadingCount === 0" class="mx-2 mb-2 text-2xl" @click="postsStore.fetchMorePosts()">Show More</BaseButton>
            </div>
        </div>
    </div>
</template>