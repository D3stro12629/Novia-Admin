<template>
  <div
    class="base-skeleton"
    :class="[{ 'animate-shimmer': animated }, type]"
    :style="skeletonStyle"
  ></div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'rect', // 'rect' | 'circle'
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '20px',
  },
  borderRadius: {
    type: String,
    default: '8px',
  },
  animated: {
    type: Boolean,
    default: true,
  },
})

const skeletonStyle = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: props.type === 'circle' ? '50%' : props.borderRadius,
}))
</script>

<style scoped>
.base-skeleton {
  /* Using a color slightly lighter than your --surface (#121215) */
  background: #1f1f23;
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.animate-shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.05) 20%,
    rgba(255, 255, 255, 0.1) 60%,
    rgba(255, 255, 255, 0)
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

/* Helper for circles */
.circle {
  flex-shrink: 0;
}
</style>