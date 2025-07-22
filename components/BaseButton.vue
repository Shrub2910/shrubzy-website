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
        'px-3 py-1 border rounded-xl font-semibold transition',
        variant === 'primary' && 'bg-blue-400 border-blue-400 text-white hover:bg-blue-400/90',
        variant === 'secondary' && 'border-green-400 bg-transparent text-white hover:bg-green-400/90',
        variant === 'danger' && 'border-red-400 bg-red-400 text-white hover:bg-red-400/90',
        variant === 'warning' && 'border-amber-400 bg-amber-400 text-white hover:bg-amber-400/90'
    ]"
    :type="type"
    >
        <slot/>
    </button>
</template>