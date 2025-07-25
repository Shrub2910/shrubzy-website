<script setup lang="ts">
    const props = defineProps<{
        userOwnsPost: boolean,
        postId: string,
        title: string,
        body: string | null,
        username: string | null,
        deleteRedirect?: string,
    }>()

    const postsStore = usePostsStore()

    async function editPost() {
        await postsStore.editPost(props.postId, {
            title: 'Test title',
            body: 'Test Body'
        })
    }

    async function deletePost() {
        await postsStore.deletePost(props.postId)
        if (props.deleteRedirect) {
            await navigateTo(props.deleteRedirect)
        }
    }
</script>

<template>
    <div class="flex p-2 mx-2 bg-gray-700 rounded-md">
        <div class="flex flex-col justify-center mr-1 gap-2 w-full min-w-0 m-4">
            <div class="flex flex-col justify-between">
                <p class="text-gray-400 break-all">Written by {{ username }}</p>
                <NuxtLink :to="`/posts/${postId}`" class="text-4xl text-gray-100 font-bold pb-4 mt-2 break-words">{{ title }}</NuxtLink>
                <p class="text-gray-100 p-2 max-h-40 overflow-auto rounded-md break-words whitespace-pre-wrap">{{ body }}</p>
            </div>

            <div v-if="userOwnsPost" class="flex justify-end gap-2">
                <BaseButton variant="warning" @click="editPost">Edit</BaseButton>
                <BaseButton variant="danger" @click="deletePost">Delete</BaseButton>
            </div>

        </div>

    </div>
</template>