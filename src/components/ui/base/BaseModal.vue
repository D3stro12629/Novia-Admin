<template>
  <teleport to="body">
   <div class="modal fade show" tabindex="-1" role="dialog" style="display: block;">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary">Save changes</button>
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
  </teleport>
</template>

<script setup>
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  show: Boolean,
  title: String,
  subtitle: String,
  size: { type: String, default: 'md' }, // sm, md, lg, xl
  variant: { type: String, default: 'standard' }, // standard, pattern
  hasPatternHeader: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])
const close = () => emit('close')

// Body Scroll Lock - Prevent background scrolling when modal is open
watch(() => props.show, (isVisible) => {
  if (isVisible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 9999;
  overflow-y: auto;
  padding: 40px 20px;
}

[data-theme="dark"] .modal-overlay {
  background: rgba(0, 0, 0, 0.7);
}

.modal-container {
  background: var(--nav-bg);
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  margin-top: auto;
  margin-bottom: auto;
}

.modal-container.lg {
  max-width: 800px;
}

.modal-container.xl {
  max-width: 1100px;
}

.modal-container.sm {
  max-width: 400px;
}

/* Pattern Header (Topographic Look) */
.pattern-header {
  height: 180px;
  background-color: var(--nav-surface);
  background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url("/images/modal_header_image/modal_image.jpg");
  background-size: cover;
  background-position: center;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  flex-shrink: 0;
}

.close-btn.circle {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

/* Standard Header */
.standard-header {
  padding: 24px 30px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.title-with-icon {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.header-text-group {
  display: flex;
  flex-direction: column;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
}

.pattern-header .modal-title {
  color: #ffffff;
}

.modal-subtitle {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--color-muted);
}

.pattern-header .modal-subtitle {
  color: rgba(255, 255, 255, 0.8);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

/* Body & Footer */
.modal-body {
  padding: 30px;
}

.modal-footer {
  padding: 0 30px 30px 30px;
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
