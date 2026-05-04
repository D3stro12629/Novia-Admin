<template>
  <div class="s-card">
    <div class="s-header">
      <div class="s-icon" :style="{ backgroundColor: (iconBg || '#6366f1') + '20', color: iconBg || '#6366f1' }">
        <i :class="['bi', icon || 'bi-activity']"></i>
      </div>
      <div v-if="change !== undefined" class="s-trend" :class="change >= 0 ? 'up' : 'down'">
        {{ change >= 0 ? '+' : '' }}{{ change }}%
      </div>
    </div>
    <div class="s-value">{{ value || 0 }}</div>
    <div class="s-label">{{ label || 'Loading...' }}</div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: [Number, String],
  change: [Number, String],
  icon: String,
  iconBg: String,
  isLoading: Boolean
})
</script>

<style scoped>
.s-card {
  background: var(--nav-surface);
  border: 1px solid var(--color-border);
  padding: 24px;
  border-radius: 20px;
  transition: 0.3s;
}
.s-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.s-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.s-value { font-size: 32px; font-weight: 800; color: var(--color-text); line-height: 1; }
.s-label { font-size: 14px; color: var(--color-muted); font-weight: 500; margin-top: 8px; }
.s-trend { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; }
.s-trend.up { color: #10b981; background: rgba(16, 185, 129, 0.1); }
.s-trend.down { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
</style>