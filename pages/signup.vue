<script setup lang="ts">
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
</script>

<template>
    <div class="h-screen flex justify-center items-center">
        <form class="flex flex-col p-2 shadow-2xl rounde-md bg-orange-100" @submit.prevent="signup">
            <h1 class="text-center text-2xl mb-4">Sign Up</h1>
            <input v-model="credentials.email" class="border py-2 mb-2 rounded-full" type="email">
            <input v-model="credentials.password" class="border py-2 mb-4 rounded-full" type="password">
            <button class="p-4 rounded-full bg-blue-400 hover:text-white" type="submit">Submit</button>
        </form>
    </div>
</template>

