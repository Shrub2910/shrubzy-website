<script setup lang="ts">
    const username = ref('')

    const {fetch: refreshSession} = useUserSession()


    async function setUsername() {
        $fetch('/api/users', {
            method: 'PATCH',
            body: {
                username: username.value
            }
        })
        .then(async () => {
            await refreshSession()
            await navigateTo('/')
        })
        .catch((err) => {
            alert('Bad Username')
            console.log('Error occured: ', err)
        })
    }

</script>

<template>
    <div class="flex justify-center items-center h-screen">
        <div class="flex flex-col">
            <h1>Create a username</h1>
            <input v-model="username" type="text" class="border">
            <button class="py-4 w-32 bg-blue-400" @click="setUsername">Set Username</button>
        </div>
    </div>
</template>