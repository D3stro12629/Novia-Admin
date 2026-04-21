<!-- @/components/ui/base/BaseSkeleton.vue -->
<template>
  <div 
    class="base-skeleton" 
    :class="[shape, animation]"
    :style="{ 
      width: width, 
      height: height, 
      borderRadius: radius 
    }"
  >
    <div class="shimmer"></div>
  </div>
</template>

<script setup>
defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '20px' },
  radius: { type: String, default: '8px' },
  shape: { type: String, default: 'rectangle' }, // 'rectangle' | 'circle'
  animation: { type: String, default: 'pulse' } // 'pulse' | 'none'
})
</script>

<style scoped>
.base-skeleton {
  position: relative;
  overflow: hidden;
  background: #1e1e22; /* Matches your premium dark surface */
  display: inline-block;
}

.base-skeleton.circle {
  border-radius: 50% !important;
}

/* The High-Performance Shimmer */
.shimmer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.03) 20%,
    rgba(255, 255, 255, 0.07) 50%,
    rgba(255, 255, 255, 0.03) 80%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer-move 2.5s infinite;
}

@keyframes shimmer-move {
  100% { transform: translateX(100%); }
}

/* Optional: Pulse effect for a softer look */
.pulse {
  animation: pulse-bg 2s infinite ease-in-out;
}

@keyframes pulse-bg {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}
</style>