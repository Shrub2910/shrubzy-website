<script setup lang="ts">
    import UserPost from '~/components/UserPost.vue';
    import type { Post } from '~/types/post';

    definePageMeta({
        middleware: ['auth']
    })

    const event = useRequestEvent()
    const route = useRoute()
    const id = route.params.id as string

    const {data: post} = await useAsyncData<Post>(
        'post',
        () => $fetch<Post>(`/api/posts/${id}`, {
                method: 'GET',
                headers: {
                    cookie: event?.node.req.headers.cookie || ''
                }
            })
            .catch(() => {
                throw createError({
                    statusCode: 404,
                    statusMessage: 'Post not found'
                })
            })
        
    )

    if (!post.value) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Post not found'
        })
    }

    console.log(post.value)
    const {user} = useUserSession()


</script>

<template>
    <main>
        <UserPost :user-owns-post="user.id === post?.authorId" :post-id="id" :title="post?.title" :body="post?.body" :username="post?.authorUsername" />
    </main>
</template>