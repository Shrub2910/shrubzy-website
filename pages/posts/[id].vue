<script setup lang="ts">
    import UserPost from '~/components/UserPost.vue';
    import type { Post } from '~/types/post';

    definePageMeta({
        middleware: ['auth']
    })

    const route = useRoute()
    const id = route.params.id as string

    const idNumber = parseInt(id)

    const {user, clear: clearSession} = useUserSession()

    const postsStore = usePostsStore()

    await callOnce(`fetchPost-${id}`, () => postsStore.fetchPost(id), {mode: 'navigation'})
    await callOnce(`fetchPosts-${id}`,() => postsStore.fetchPosts(id), {mode: 'navigation'})

    const post = computed(() => postsStore.currentPost)
    const posts = computed(() => postsStore.posts)

    const showTemplate = ref(false)

    const replyId = ref<number | null>(idNumber)
    const replyTitle = ref(post.value?.title)

    async function logout() {
        await clearSession()
        await navigateTo('/')
    }

    function toggleTemplate() {
        showTemplate.value = !showTemplate.value
        if (!showTemplate.value) {
            replyId.value = idNumber
            replyTitle.value = post.value?.title
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
        parentTitle: replyTitle.value ? replyTitle.value : null,
        likeCount: 0,
        replyCount: 0,
        isLiked: false,
    }))


</script>

<template>
    <main>
    <div class="flex justify-between items-center h-12 mb-4">
        <h1 class="text-center text-white ml-4 text-2xl"><NuxtLink to="/">Shrubzy</NuxtLink></h1>
        <div class="flex gap-x-2">
            <BaseButton @click="toggleTemplate">Create Post</BaseButton>
            <BaseButton variant="secondary" @click="logout" >Log Out</BaseButton>
        </div>
    </div>
    <div class="flex justify-center">
        <div class="flex flex-col gap-4 w-full max-w-7xl">
            <UserPost 
                v-if="post" 
                :post="post"
                :user="user"
                :reply-post="replyPost"
                delete-redirect="/" 
                :create-template="false"
            />
            <UserPost 
                v-if="showTemplate"
                :post="templatePost"
                :user="user"
                :create-template="true"
                :hide-post="toggleTemplate"
            />
            <div v-if="postsStore.loadingCount === 0">
                <UserPost 
                    v-for="(postReply) in posts" 
                    :key="postReply.id" 
                    :post="postReply"
                    :user="user"
                    :create-template="false"
                />
            </div>
            <h1 v-if="postsStore.loadingCount !== 0" class="text-gray-100 text-center text-2xl">LOADING ...</h1>
        </div>
    </div>
    </main>
</template>