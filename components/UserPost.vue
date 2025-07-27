<script setup lang="ts">
    import contenteditable from 'vue-contenteditable';

    const props = defineProps<{
        userOwnsPost: boolean,
        postId: string,
        title: string,
        body: string | null,
        username: string | null,
        deleteRedirect?: string,
    }>()

    const postsStore = usePostsStore()
    
    const editingMode = ref(false)

    const editedTitle = ref('')
    const editedBody = ref('')

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
                <p class="text-gray-400 break-all">Written by {{ username }}</p>
                
                <NuxtLink v-if="!editingMode" :to="`/posts/${postId}`" class="text-4xl text-gray-100 font-bold pb-4 mt-2 break-words">{{ title }}</NuxtLink>
                <p v-if="!editingMode" class="text-gray-100 p-2 max-h-40 overflow-auto rounded-md break-words whitespace-pre-wrap">{{ body }}</p>
                

                <contenteditable v-if="editingMode" v-model="editedTitle" tag="div"  class="text-4xl text-gray-100 bg-transparent font-bold pb-4 mt-2 break-words" />
                <contenteditable v-if="editingMode" v-model="editedBody" tag="div" class="text-gray-100 bg-transparent p-2 max-h-40 overflow-auto rounded-md break-words whitespace-pre-wrap" />
            </div>

            <div v-if="userOwnsPost" class="flex justify-end gap-2">
                <BaseButton v-if="!editingMode" variant="warning" @click="editPost">Edit</BaseButton>
                <BaseButton v-if="!editingMode" variant="danger" @click="deletePost">Delete</BaseButton>

                <BaseButton v-if="editingMode" variant="secondary" @click="editingMode=false">Back</BaseButton>
                <BaseButton v-if="editingMode" variant="primary" @click="submitEdit">Save</BaseButton>
            </div>

        </div>

    </div>
</template>