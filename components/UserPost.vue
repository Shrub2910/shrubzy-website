<script setup lang="ts">
    import contenteditable from 'vue-contenteditable';

    const props = defineProps<{
        userOwnsPost: boolean,
        postId: string,
        title: string,
        body: string | null,
        username: string | null,
        likeCount?: number
        deleteRedirect?: string,

        createTemplate: boolean,
        hidePost?: () => void,
    }>()

    const postsStore = usePostsStore()
    
    const editingMode = ref(false)

    const editedTitle = ref('')
    const editedBody = ref('')

    async function createPost() {
        try {
            await postsStore.createPost({title: editedTitle.value, body: editedBody.value})
            editedTitle.value = 'Title'
            editedBody.value = 'Body'
            if (props.hidePost){
                props.hidePost()
            }
        } catch {
            alert('Bad post')
        } 
    }

    function editPost() {
        editingMode.value = true
        editedTitle.value = props.title
        if (props.body) {
            editedBody.value = props.body
        } else {
            editedBody.value = ''
        }
    }

    async function submitEdit() {
        await postsStore.editPost(props.postId, {
            title: editedTitle.value,
            body: editedBody.value
        })
        editingMode.value = false
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
                <p v-if="!createTemplate" class="text-gray-400 break-all">Written by {{ username }}</p>
                
                <NuxtLink v-if="!editingMode && !createTemplate" :to="`/posts/${postId}`" class="text-4xl text-gray-100 font-bold pb-4 mt-2 break-words">{{ title }}</NuxtLink>
                <p v-if="!editingMode && !createTemplate" class="text-gray-100 p-2 max-h-40 overflow-auto rounded-md break-words whitespace-pre-wrap">{{ body }}</p>
                

                <contenteditable v-if="editingMode || createTemplate" v-model="editedTitle" tag="div" data-placeholder="Title..." class="text-4xl text-blue-400 bg-transparent font-bold pb-4 mt-2 break-words relative empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:absolute empty:before:pointer-events-none" />
                <contenteditable v-if="editingMode || createTemplate" v-model="editedBody" tag="div" data-placeholder="Body..." class="text-blue-400 bg-transparent p-2 max-h-40 overflow-auto rounded-md break-words whitespace-pre-wrap empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:absolute empty:before:pointer-events-none" />
            </div>

            <div class="flex justify-between">
                <BaseButton v-if="!editingMode && !createTemplate" @click="postsStore.likePost(postId)">Like: {{ likeCount }}</BaseButton>
                <div v-if="userOwnsPost" class="flex justify-end gap-2">
                    <BaseButton v-if="!editingMode && !createTemplate" variant="warning" @click="editPost">Edit</BaseButton>
                    <BaseButton v-if="!editingMode && !createTemplate" variant="danger" @click="deletePost">Delete</BaseButton>

                    <BaseButton v-if="editingMode && !createTemplate" variant="secondary" @click="editingMode=false">Back</BaseButton>
                    <BaseButton v-if="editingMode && !createTemplate" variant="primary" @click="submitEdit">Save</BaseButton>

                    <BaseButton v-if="createTemplate" variant="secondary" @click="hidePost">Back</BaseButton>
                    <BaseButton v-if="createTemplate" @click="createPost">Create Post</BaseButton>
                </div>
            </div>

        </div>

    </div>
</template>