<script setup lang="ts">
    defineProps<{
        title?: string,
        body?: string,
        username?: string,
    }>()
</script>

<template>
    <div class="flex items-start p-2 mx-4 bg-blue-200 rounded-md">
        <div class="flex flex-col p-2 border-r h-full border-black mr-2 mt-1">
            <div class="w-8 h-8 rounded-full bg-blue-400" />
        </div>
        <div class="flex flex-col justify-center flex-grow mr-1">
            <div class="flex flex-col w-full">
                <p class="text-gray-500 mb-2 break-all">Written by {{ username }}</p>
                <h1 class="text-2xl pb-4 break-words mb-2">{{ title }}</h1>
                <p class="break-words p-2 max-h-40 overflow-auto rounded-md bg-blue-300 whitespace-pre-wrap">{{ body }}</p>
            </div>

        </div>

    </div>
</template>