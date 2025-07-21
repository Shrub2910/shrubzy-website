<script setup lang="ts">
    interface Props {
        type?: 'button' | 'submit' | 'reset',
        variant?: string
    }

    const {type = 'button', variant = 'primary'} = defineProps<Props>()
</script>

<template>
    <button 
    :class="[
        'px-4 py-2 rounded-xl font-semibold transition',
        variant === 'primary' && 'bg-blue-400 text-white hover:bg-blue-400/90',
        variant === 'secondary' && 'bg-green-400 text-white hover:bg-green-400/90',
    ]"
    :type="type"
    >
        <slot/>
    </button>
</template>