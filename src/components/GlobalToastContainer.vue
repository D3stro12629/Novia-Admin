<script setup>
import { useToast } from '@/composables/useToast'
import BaseToast from '@/components/ui/base/BaseToast.vue'

// This component "listens" to the readonly toasts array
const { toasts, remove } = useToast()
</script>

<template>
    <Teleport to="body">
        <div class="toast-container">
            <TransitionGroup name="toast-fade">
                <BaseToast v-for="t in toasts" :key="t.id" v-bind="t" @close="remove(t.id)" />
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<style scoped>
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

/* Transitions here... */
</style>