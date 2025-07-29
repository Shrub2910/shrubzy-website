<script setup lang="ts">
    import UserPost from '~/components/UserPost.vue';

    definePageMeta({
        middleware: ['auth']
    })

    const route = useRoute()
    const id = route.params.id as string

    const {user} = useUserSession()

    const postsStore = usePostsStore()

    await callOnce(`post/${id}`, () => postsStore.fetchPost(id), {mode: 'navigation'})
    await callOnce(`post/parent/${id}`, () => postsStore.fetchPosts(id), {mode: 'navigation'})

    const post = computed(() => postsStore.currentPost)
    const posts = computed(() => postsStore.posts)

    const showTemplate = ref(false)
    const reply = reactive({
        id: '',
        title: ''
    })

    function toggleTemplate() {
        showTemplate.value = !showTemplate.value
        if (!showTemplate.value) {
            reply.id = ''
            reply.title = ''
        }
    }

    function replyPost(id: string, title: string) {
        reply.id = id
        reply.title = title

        showTemplate.value = true
    }


</script>

<template>
    <main>
    <div class="flex justify-center">
        <div class="flex flex-col gap-4 w-full max-w-7xl">
            <UserPost 
                v-if="post" 
                :user-owns-post="user.id === post?.authorId" 
                :post-id="id" 
                :title="post.title" 
                :body="post.body" 
                :username="post.authorUsername" 
                :like-count="post.likeCount"
                :is-liked="post.isLiked"
                :reply-count="post.replyCount"
                :reply-post="replyPost"
                :parent-id="post.parentId ? post.parentId : undefined"
                :parent-title="post.parentTitle ? post.parentTitle : undefined"
                delete-redirect="/" 
                :create-template="false"
            />
            <UserPost 
                v-if="showTemplate"
                :user-owns-post="true"
                post-id="0"
                title="Title"
                body="Body"
                username=""
                :create-template="true"
                :hide-post="toggleTemplate"
                :parent-id="reply.id !== '' ? parseInt(reply.id): undefined"
                :parent-title="reply.title !== '' ? reply.title: undefined"
            />
            <UserPost 
                v-for="(postReply) in posts" 
                :key="postReply.id" 
                :user-owns-post="user.id === postReply.authorId" 
                :post-id="postReply.id.toString()" 
                :title="postReply.title" 
                :body="postReply.body" 
                :username="postReply.authorUsername"
                :like-count="postReply.likeCount"
                :is-liked="postReply.isLiked"
                :parent-id="postReply.parentId ? postReply.parentId : undefined"
                :parent-title="postReply.parentTitle ? postReply.parentTitle : undefined"
                :create-template="false"
            />
        </div>
    </div>
    </main>
</template>