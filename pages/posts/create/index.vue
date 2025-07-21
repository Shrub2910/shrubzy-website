<script setup lang="ts">
    definePageMeta({
        middleware: ['auth']
    })

    const postBody = reactive({
        title: '',
        body: '',
    })

    async function submitPost() {
        $fetch('/api/posts', {
            method: 'POST',
            body: postBody
        })
        .then(async () => {
            await navigateTo('/')
        })
        .catch(() => alert('Bad Post'))
    }
</script>

<template>
    <div class="flex justify-center items-center h-screen">
        <form class="flex flex-col bg-white px-8 py-4 rounded-md" @submit.prevent="submitPost">
            <h1 class="text-2xl mb-4">Create a New Post</h1>
            <p>Post Title</p>
            <input v-model="postBody.title" type="text" class="border w-96 h-8 mb-2 text-2xl">
            <p>Post Body</p>
            <textarea v-model="postBody.body" class="border resize-none w-96 h-72 mb-4"/>
            <div class="flex justify-between">
                <NuxtLink to="/"><BaseButton variant="secondary">Back</BaseButton></NuxtLink>
                <BaseButton type="submit">Create Post</BaseButton>
            </div>
        </form>
    </div>
</template>