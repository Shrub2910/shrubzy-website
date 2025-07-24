<script setup lang="ts">
    const props = defineProps<{
        userOwnsPost: boolean,
        postId: string,
        title: string,
        body: string | null,
        username: string | null,
    }>()

    const postsStore = usePostsStore()

    async function deletePost() {
        await postsStore.deletePost(props.postId)
    }
</script>

<template>
    <div class="flex items-start p-2 mx-4 bg-gray-700 rounded-md">
        <div class="flex flex-col p-2 border-r h-full border-black mr-2 mt-1">
            <div class="w-8 h-8 rounded-full bg-blue-400" />
        </div>
        <div class="flex flex-col justify-center flex-grow mr-1 gap-2">
            <div class="flex flex-col w-full gap-2">
                <p class="text-gray-400 break-all">Written by {{ username }}</p>
                <NuxtLink :to="`/posts/${postId}`" class="text-2xl text-gray-100 pb-4 break-words">{{ title }}</NuxtLink>
                <p class="break-words text-gray-100 p-2 h-40 overflow-auto rounded-md bg-gray-900 whitespace-pre-wrap">{{ body }}</p>
            </div>

            <div v-if="userOwnsPost" class="flex justify-end gap-2">
                <BaseButton variant="warning">Edit</BaseButton>
                <BaseButton variant="danger" @click="deletePost">Delete</BaseButton>
            </div>

        </div>

    </div>
</template>