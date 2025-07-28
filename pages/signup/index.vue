<script setup lang="ts">
    import BaseButton from '~/components/BaseButton.vue'
    import type {FetchError} from 'ofetch'

    const credentials = reactive({
        email: '',
        password: '',
    })

    const bodyError = ref(false)

    async function signup() {
        $fetch('/api/signup', {
            method: 'POST',
            body: credentials
        })
        .then(async () => {
            await navigateTo('/login')
        })
        .catch((err: FetchError) => {
            if (err.statusCode === 400) {
                bodyError.value=true
            } else {
                alert('Internal server error')
            }
        })
    }

    async function login() {
        await navigateTo('/login')
    }
</script>

<template>
    <div class="h-screen flex justify-center items-center">
        <form class="flex flex-col w-96 p-4 shadow-2xl rounded-xl bg-gray-700" @submit.prevent="signup">
            <h1 class="text-center text-white text-2xl mb-4">Sign Up</h1>
            <p class="text-white">Email Address</p>
            <input v-model="credentials.email" class="border px-2 py-2 mb-2 w-full rounded-full" type="email">
            <p class="text-white">Password</p>
            <input v-model="credentials.password" class="border px-2 py-2 mb-4 w-full rounded-full" type="password">
            <p v-if="bodyError" class="text-red-400">Invalid email or password wasn't 8 characters or more long</p>
            <div class="flex justify-between">
                <BaseButton type="button" variant="secondary" @click="login">Log In</BaseButton>
                <BaseButton type="submit" variant="primary">Submit</BaseButton>
            </div>
        </form>
    </div>
</template>

