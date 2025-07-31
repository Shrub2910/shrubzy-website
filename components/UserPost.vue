<script setup lang="ts">
    import type { User } from '#auth-utils';
    import contenteditable from 'vue-contenteditable';
    import type { Post } from '~/types/post';

    const props = defineProps<{
        post: Post,
        user: User,
        deleteRedirect?: string,
        createTemplate: boolean,
        hidePost?: () => void,
        replyPost?: (id: number, title: string) => void,
    }>()

    const postsStore = usePostsStore()
    
    const editingMode = ref(false)

    const editedTitle = ref('')
    const editedBody = ref('')

    const userOwnsPost = computed(() => props.post.authorId === props.user.id || props.createTemplate)

    async function createPost() {
        try {
            await postsStore.createPost({title: editedTitle.value, body: editedBody.value, parentId: props.post.parentId})
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
        editedTitle.value = props.post.title
        if (props.post.body) {
            editedBody.value = props.post.body
        } else {
            editedBody.value = ''
        }
    }

    async function submitEdit() {
        await postsStore.editPost(props.post.id, {
            title: editedTitle.value,
            body: editedBody.value
        })
        editingMode.value = false
    }

    async function deletePost() {
        await postsStore.deletePost(props.post.id)
        if (props.deleteRedirect) {
            await navigateTo(props.deleteRedirect)
        }
    }
</script>

<template>
    <div class="flex p-2 mx-2 bg-gray-700 rounded-md">
        <div class="flex flex-col justify-center mr-1 gap-2 w-full min-w-0 m-4">
            <div class="flex flex-col justify-between gap-2">
                <p v-if="post.parentId" class="text-green-400 break-normal"><NuxtLink :to="`/posts/${post.parentId}`">Replying to {{post.parentTitle}}</NuxtLink></p>
                <p v-if="!createTemplate" class="text-gray-400 break-all"><NuxtLink :to="`/users/${post.authorId}`">Written by {{ post.authorUsername }}</NuxtLink></p>
                <h2 v-if="!editingMode && !createTemplate" class="text-4xl text-gray-100 font-bold pb-4 break-words"><NuxtLink :to="`/posts/${post.id}`">{{ post.title }}</NuxtLink></h2>
                <p v-if="!editingMode && !createTemplate" class="text-gray-100 p-2 max-h-40 overflow-auto rounded-md break-words whitespace-pre-wrap">{{ post.body }}</p>
                

                <contenteditable v-if="editingMode || createTemplate" v-model="editedTitle" tag="div" data-placeholder="Title..." class="text-4xl text-blue-400 bg-transparent font-bold pb-4 break-words relative empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:absolute empty:before:pointer-events-none" />
                <contenteditable v-if="editingMode || createTemplate" v-model="editedBody" tag="div" data-placeholder="Body..." class="text-blue-400 bg-transparent p-2 max-h-40 overflow-auto rounded-md break-words whitespace-pre-wrap empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:absolute empty:before:pointer-events-none" />
            </div>

            <div class="flex justify-between">
                <div v-if="!editingMode && !createTemplate" class="flex justify-start gap-2">
                    <BaseButton v-if="replyPost" variant="secondary" @click="replyPost(post.id, post.title)">Reply: {{ post.replyCount }}</BaseButton>
                    <BaseButton :class="!post.isLiked && 'bg-transparent'" @click="postsStore.likePost(post.id)">Like: {{ post.likeCount }}</BaseButton>
                </div>
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