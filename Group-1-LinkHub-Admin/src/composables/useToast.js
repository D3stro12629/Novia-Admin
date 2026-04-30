import { reactive, readonly } from 'vue'

// Global state - defined outside the function so it's shared across the whole app
const state = reactive([])
let toastId = 0

export function useToast() {
    
    /**
     * Internal helper to add a toast
     */
    const add = ({ message = '', type = 'info', duration = 3000 }) => {
        const id = ++toastId
        const toast = { id, message, type, duration }

        state.push(toast)

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => remove(id), duration)
        }

        return id
    }

    /**
     * Remove a toast by ID
     */
    const remove = (id) => {
        const index = state.findIndex((t) => t.id === id)
        if (index > -1) {
            state.splice(index, 1)
        }
    }

    /**
     * Clear all active toasts
     */
    const clear = () => {
        state.length = 0
    }

    // --- Public API methods ---

    const success = (message, duration = 3000) => {
        return add({ message, type: 'success', duration })
    }

    const error = (message, duration = 5000) => {
        return add({ message, type: 'error', duration })
    }

    const warning = (message, duration = 4000) => {
        return add({ message, type: 'warning', duration })
    }

    const info = (message, duration = 3000) => {
        return add({ message, type: 'info', duration })
    }

    return {
        // We return state as readonly to the outside world to 
        // ensure only this composable can modify the array
        toasts: readonly(state), 
        add,
        remove,
        clear,
        success,
        error,
        warning,
        info,
    }
}