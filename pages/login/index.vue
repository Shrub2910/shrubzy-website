<script setup lang="ts">
    import BaseButton from '~/components/BaseButton.vue'

    const {fetch: refreshSession} = useUserSession()

    const credentials = reactive({
        email: '',
        password: '',
    })

    const showErrorMessage = ref(false)

    async function login() {
        $fetch('/api/login', {
            method: 'POST',
            body: credentials
        })
        .then(async () => {
            await refreshSession()
            await navigateTo('/')
        })
        .catch((err) => {
            console.log('There was an error: ', err)
            showErrorMessage.value = true
        })
    }

    async function signup() {
        await navigateTo('/signup')
    }
</script>

<template>
    <div class="h-screen flex justify-center items-center">
        <form class="flex flex-col p-2 shadow-2xl rounde-md bg-orange-100" @submit.prevent="login">
            <h1 class="text-center text-2xl mb-4">Log In</h1>
            <p>Email Address</p>
            <input v-model="credentials.email" class="border px-2 py-2 mb-2 w-72 rounded-full" type="email">
            <p>Password</p>
            <input v-model="credentials.password" class="border px-2 py-2 mb-4 w-72 rounded-full" type="password">
            <p v-if="showErrorMessage" class="text-red-500">Either username or password is incorrect</p>
            <div class="flex justify-between">
                <BaseButton type="button" variant="primary" @click="signup">Sign up</BaseButton>
                <BaseButton type="submit" variant="secondary">Submit</BaseButton>
            </div>

        </form>
    </div>
</template>

