<script setup lang="ts">
    const props = defineProps<{
        title?: string,
        body?: string,
        email?: string,
    }>()
</script>

<template>
    <div class="flex p-2 mx-4 bg-blue-200 rounded-md">
        <div class="flex flex-col p-2 border-r border-black mr-2 mt-1">
            <div class="w-8 h-8 rounded-full bg-blue-400" />
        </div>
        <div class="flex flex-col justify-center flex-grow mr-1">
            <div class="w-full">
                <p class="text-gray-500 mt-1 mb-2">Written by {{ props.email }}</p>
                <h1 class="text-2xl pb-4 break-all mb-2">{{ props.title }}</h1>
                <p class="break-all p-2 rounded-md bg-blue-300">{{ props.body }}</p>
            </div>

        </div>

    </div>
</template>