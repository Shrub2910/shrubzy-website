<script setup lang="ts">
    definePageMeta({
        middleware: ['auth']
    })

    const postStore = usePostsStore()

    const postBody = reactive({
        title: '',
        body: '',
    })

    async function submitPost() {
        try {
            await postStore.createPost(postBody)
            console.log('made it this far')
            navigateTo('/')
        } catch {
            alert('Bad post')
        } 
    }
</script>

<template>
    <div class="flex justify-center items-center h-screen">
        <form class="flex flex-col bg-gray-700 px-8 py-4 rounded-md" @submit.prevent="submitPost">
            <h1 class="text-2xl text-gray-100 mb-4">Create a New Post</h1>
            <p class="text-gray-100">Post Title</p>
            <input v-model="postBody.title" type="text" class="border bg-gray-100 w-96 h-8 mb-2 text-2xl">
            <p class="text-gray-100">Post Body</p>
            <textarea v-model="postBody.body" class="border bg-gray-100 resize-none w-96 h-72 mb-4"/>
            <div class="flex justify-between">
                <NuxtLink to="/"><BaseButton variant="secondary">Back</BaseButton></NuxtLink>
                <BaseButton type="submit">Create Post</BaseButton>
            </div>
        </form>
    </div>
</template>