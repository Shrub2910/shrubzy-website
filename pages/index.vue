<script setup lang="ts">
    definePageMeta({
        middleware: ["auth"]
    })

    const {user, clear: clearSession} = useUserSession()

    async function logout() {
        await clearSession()
        await navigateTo('/login')
    }
</script>

<template>
    <div>
        <h1>Welcome to my shitty website</h1>
        <p v-if="user">Welcome {{ user.email }}</p>
        <button @click="logout">Log Out</button>
    </div>
</template>