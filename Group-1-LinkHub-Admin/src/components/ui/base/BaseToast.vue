<template>
    <div :class="['premium-toast', `toast-${type}`]" role="alert">
        <!-- Visual Accent: Vertical "Energy" Bar -->
        <div class="toast-accent-bar"></div>
        
        <div class="toast-content">
            <div class="toast-header-row">
                <div class="toast-meta">
                    <div class="toast-icon-wrapper">
                        <i :class="['bi', toastIcon]"></i>
                    </div>
                    <span class="toast-label">{{ typeLabel }}</span>
                </div>
                <button type="button" class="toast-close" @click="$emit('close')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            
            <div class="toast-body-text">
                {{ message }}
            </div>
        </div>

        <!-- Subtle CRT Scanline Effect to match your Profile Page -->
        <div class="toast-scanline"></div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    message: { type: String, required: true },
    type: {
        type: String,
        default: 'info',
        validator: (value) => ['success', 'error', 'warning', 'info'].includes(value),
    },
})

defineEmits(['close'])

const typeLabel = computed(() => {
    const labels = { success: 'SYSTEM READY', error: 'SIGNAL LOST', warning: 'CAUTION', info: 'DATA LINK' }
    return labels[props.type]
})

const toastIcon = computed(() => {
    const icons = {
        success: 'bi-check2-all',
        error: 'bi-exclamation-octagon',
        warning: 'bi-shield-exclamation',
        info: 'bi-broadcast-pin',
    }
    return icons[props.type]
})
</script>

<style scoped>
/* MATCHING YOUR DASHBOARD VARIABLES */
.premium-toast {
    --t-surface: #121215;
    --t-border: #27272a;
    --t-success: #22c55e;
    --t-error: #ef4444;
    --t-warning: #f59e0b;
    --t-info: #6366f1; /* Your Indigo Accent */
    
    position: relative;
    min-width: 340px;
    max-width: 400px;
    background: var(--t-surface);
    border: 1px solid var(--t-border);
    border-radius: 14px;
    display: flex;
    overflow: hidden;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    font-family: 'Inter', sans-serif;
}

/* Vertical Energy Bar */
.toast-accent-bar {
    width: 4px;
    flex-shrink: 0;
    background: var(--accent-color, var(--t-info));
}

.toast-content {
    flex-grow: 1;
    padding: 14px 16px;
    z-index: 2;
}

.toast-header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.toast-meta {
    display: flex;
    align-items: center;
    gap: 10px;
}

.toast-icon-wrapper {
    font-size: 1.1rem;
    display: flex;
    align-items: center;
}

.toast-label {
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    opacity: 0.9;
}

.toast-body-text {
    font-size: 0.9rem;
    color: #a1a1aa;
    line-height: 1.4;
    font-weight: 500;
}

.toast-close {
    background: transparent;
    border: none;
    color: #52525b;
    cursor: pointer;
    font-size: 0.9rem;
    padding: 4px;
    transition: 0.2s;
    display: flex;
}

.toast-close:hover {
    color: #fafafa;
    transform: rotate(90deg);
}

/* CRT SCANLINE EFFECT (Matches your Profile Cover) */
.toast-scanline {
    position: absolute;
    inset: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.05) 50%);
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 1;
}

/* TYPE SPECIFIC LOGIC */

/* Success - Green */
.toast-success .toast-accent-bar { background: var(--t-success); box-shadow: 0 0 15px var(--t-success); }
.toast-success .toast-icon-wrapper, .toast-success .toast-label { color: var(--t-success); }

/* Error - Red */
.toast-error .toast-accent-bar { background: var(--t-error); box-shadow: 0 0 15px var(--t-error); }
.toast-error .toast-icon-wrapper, .toast-error .toast-label { color: var(--t-error); }

/* Warning - Yellow */
.toast-warning .toast-accent-bar { background: var(--t-warning); box-shadow: 0 0 15px var(--t-warning); }
.toast-warning .toast-icon-wrapper, .toast-warning .toast-label { color: var(--t-warning); }

/* Info - Indigo */
.toast-info .toast-accent-bar { background: var(--t-info); box-shadow: 0 0 15px var(--t-info); }
.toast-info .toast-icon-wrapper, .toast-info .toast-label { color: var(--t-info); }

/* Animation Hook for the Container */
.premium-toast:hover {
    border-color: #3f3f46;
    transform: translateY(-2px);
    transition: 0.3s ease;
}
</style>