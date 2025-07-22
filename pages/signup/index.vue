<script setup lang="ts">
    import BaseButton from '~/components/BaseButton.vue'

    const credentials = reactive({
        email: '',
        password: '',
    })

    async function signup() {
        $fetch('/api/signup', {
            method: 'POST',
            body: credentials
        })
        .then(async () => {
            await navigateTo('/login')
        })
        .catch(() => alert('Bad Credentials'))
    }

    async function login() {
        await navigateTo('/login')
    }
</script>

<template>
    <div class="h-screen flex justify-center items-center">
        <form class="flex flex-col p-2 shadow-2xl rounde-md bg-gray-700" @submit.prevent="signup">
                        <h1 class="text-center text-white text-2xl mb-4">Sign Up</h1>
            <p class="text-white">Email Address</p>
            <input v-model="credentials.email" class="border px-2 py-2 mb-2 rounded-full" type="email">
            <p class="text-white">Password</p>
            <input v-model="credentials.password" class="border px-2 py-2 mb-4 rounded-full" type="password">
            <div class="flex justify-between">
                <BaseButton type="button" variant="secondary" @click="login">Log In</BaseButton>
                <BaseButton type="submit" variant="primary">Submit</BaseButton>
            </div>
        </form>
    </div>
</template>

