<script setup lang="ts">
    import { useUsersStore } from '~/stores/users';
    import contenteditable from 'vue-contenteditable';

    definePageMeta({
        middleware: ['auth']
    })

    const route = useRoute()
    const id = route.params.id as string

    const usersStore = useUsersStore()
    const postsStore = usePostsStore()

    await callOnce(`fetchUser-${id}`, () => usersStore.fetchUser(id), {mode: 'navigation'})
    await callOnce(`fetchPosts-${id}`, () => postsStore.fetchPosts(undefined, id), {mode: 'navigation'})

    const userInfo = computed(() => usersStore.user)
    const posts = computed(() => postsStore.posts)

    const {user} = useUserSession()

    const editingUsername = ref(false)
    const newUsername = ref<string>(user.value.username)

    function editUsername() {
        editingUsername.value = true
        newUsername.value = user.value.username
    }

    function saveUsername() {
        editingUsername.value = false
        usersStore.changeUsername(newUsername.value, user.value.id)
    }


</script>

<template>
    <div v-if="userInfo">
        <NuxtLink to="/" class="m-2"><BaseButton variant="secondary">Back</BaseButton></NuxtLink>
        <contenteditable v-if="editingUsername" v-model="newUsername" tag="h1" class="text-gray-100 text-4xl text-center my-4 font-semibold" />
        <h1 v-if="!editingUsername" class="text-gray-100 text-4xl text-center my-4 font-semibold">{{ userInfo.username }}</h1>
        <div v-if="userInfo.id === user.id" class="flex justify-center gap-2 mb-2">
            <BaseButton v-if="!editingUsername" variant="warning" @click="editUsername">Edit Username</BaseButton>
            <BaseButton v-if="editingUsername" variant="secondary" @click="editingUsername=false">Back</BaseButton>
            <BaseButton v-if="editingUsername" @click="saveUsername">Save</BaseButton>
        </div>
        <div class="flex justify-center gap-2">
            <p class="text-gray-100 p-2 bg-blue-400 rounded-xl text-xl">Posts: {{ userInfo.postsCount }}</p>
            <p class="text-gray-100 p-2 bg-blue-400 rounded-xl text-xl">Likes: {{ userInfo.likeCount }}</p>
        </div>
        <div class="flex justify-center mt-4">
        <div class="flex flex-col gap-4 w-full max-w-7xl">
            <UserPost 
                v-for="(post) in posts"
                :key="post.id"
                :post="post"
                :user="user"
                :create-template="false"
            />
            <h1 v-if="postsStore.loadingCount !== 0" class="text-gray-100 text-center text-2xl">LOADING ...</h1>
        </div>
        </div>
    </div>

</template>