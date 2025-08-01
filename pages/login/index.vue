<script setup lang="ts">
    import BaseButton from '~/components/BaseButton.vue'

    const {fetch: refreshSession} = useUserSession()

    const credentials = reactive({
        email: '',
        password: '',
    })

    const showErrorMessage = ref(false)
    const isLoading = ref(false)

    async function login() {
        isLoading.value = true
        $fetch('/api/login', {
            method: 'POST',
            body: credentials,
        })
        .then(async () => {
            await refreshSession()
            await navigateTo('/')
        })
        .catch((err) => {
            console.log('There was an error: ', err)
            showErrorMessage.value = true
        })
        .finally(() => {
            isLoading.value = false
        })
    }

    async function signup() {
        await navigateTo('/signup')
    }
</script>

<template>
    <div class="h-screen flex justify-center items-center">
        <form class="flex flex-col w-96 p-4 shadow-2xl rounded-xl bg-gray-700" @submit.prevent="login">
            <h1 class="text-center text-gray-100 text-2xl mb-4">Log In</h1>
            <p class="text-gray-100">Email Address</p>
            <input v-model="credentials.email" class="border px-2 py-2 mb-2 w-full rounded-full" type="email">
            <p class="text-gray-100">Password</p>
            <input v-model="credentials.password" class="border px-2 py-2 mb-4 w-full rounded-full" type="password">
            <p v-if="showErrorMessage" class="text-red-500">Either username or password is incorrect</p>
            <div class="flex justify-between">
                <BaseButton type="button" variant="secondary" @click="signup">Sign up</BaseButton>
                <BaseButton type="submit" variant="primary">Submit</BaseButton>
            </div>
            <h1 v-if="isLoading" class="text-center text-gray-100">LOADING ...</h1>

        </form>
    </div>
</template>

