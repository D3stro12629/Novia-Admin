<template>
  <BaseCard class="bar-chart-card">
    <template #header>
      <div class="chart-header">
        <div class="header-left">
          <div class="icon-box">
            <i :class="['bi', icon]" aria-hidden="true"></i>
          </div>
          <div class="title-group">
            <h3>{{ title }}</h3>
            <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
          </div>
        </div>
      </div>
    </template>

    <div class="chart-content">
      <div v-if="isLoading" class="chart-loading skeleton-grid">
        <div v-for="i in 6" :key="i" class="skeleton-bar-container">
          <div class="skeleton-bar" :style="{ height: Math.random() * 60 + 30 + '%' }"></div>
          <div class="skeleton-label"></div>
        </div>
      </div>

      <div v-else-if="!data || data.length === 0" class="chart-empty">
        <i class="bi bi-bar-chart-steps"></i>
        <p>Awaiting data insights...</p>
      </div>

      <div v-else class="canvas-wrapper">
        <Bar :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import BaseCard from '@/components/ui/base/BaseCard.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: 'bi-graph-up' },
  data: {
    type: Array,
    required: true,
    validator: (arr) => arr.every((item) => item.label && typeof item.height === 'number'),
  },
  isLoading: { type: Boolean, default: false },
})

const chartData = computed(() => {
  const colors = [
    { fill: 'rgba(168, 85, 247, 0.2)', stroke: '#a855f7' },
    { fill: 'rgba(16, 185, 129, 0.2)', stroke: '#10b981' }, 
    { fill: 'rgba(245, 158, 11, 0.2)', stroke: '#f59e0b' }, 
    { fill: 'rgba(6, 182, 212, 0.2)', stroke: '#06b6d4' }, 
    { fill: 'rgba(249, 115, 22, 0.2)', stroke: '#f97316' },
    { fill: 'rgba(59, 130, 246, 0.2)', stroke: '#3b82f6' }, 
  ]

  return {
    labels: props.data.map(item => item.label),
    datasets: [{
      label: props.title,
      data: props.data.map(item => item.height),
      backgroundColor: colors.map(c => c.fill),
      borderColor: colors.map(c => c.stroke),
      borderWidth: 2,
      borderRadius: { topLeft: 10, topRight: 10, bottomLeft: 0, bottomRight: 0 },
      borderSkipped: 'bottom', 
      hoverBackgroundColor: colors.map(c => c.stroke),
      barThickness: 32,
      maxBarThickness: 40,
    }]
  }
})

const chartOptions = computed(() => {
  const isDark = themeStore.isDarkMode
  const textMuted = isDark ? '#71717a' : '#a1a1aa'

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: isDark ? '#18181b' : '#ffffff',
        titleFont: { size: 13, weight: '700', family: 'Plus Jakarta Sans' },
        bodyFont: { size: 12, family: 'Plus Jakarta Sans' },
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        borderWidth: 1,
        bodyColor: isDark ? '#fafafa' : '#18181b',
        titleColor: isDark ? '#fafafa' : '#18181b',
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: textMuted,
          font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }
        }
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
          drawTicks: false
        },
        ticks: {
          color: textMuted,
          padding: 10,
          font: { family: 'Plus Jakarta Sans', size: 11 },
          callback: (value) => value.toLocaleString()
        }
      }
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuart'
    }
  }
})
</script>

<style scoped>
.bar-chart-card {
  background: transparent !important;
  border: none !important;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-header {
  padding-bottom: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-box {
  width: 42px;
  height: 42px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  font-size: 1.2rem;
}

.title-group h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
}

.subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: #71717a;
}

.chart-content {
  flex: 1;
  min-height: 300px;
  position: relative;
}

.canvas-wrapper {
  height: 100%;
  width: 100%;
}

/* Empty State */
.chart-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #3f3f46;
  gap: 1rem;
}

.chart-empty i {
  font-size: 3rem;
}

/* Redesigned Skeleton */
.skeleton-grid {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  padding: 0 10px;
}

.skeleton-bar-container {
  width: 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 12px;
}

.skeleton-bar {
  width: 100%;
  background: linear-gradient(180deg, #1f1f23 0%, #141417 100%);
  border-radius: 8px 8px 0 0;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-label {
  height: 12px;
  width: 100%;
  background: #1f1f23;
  border-radius: 4px;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    opacity: 0.5;
  }
}
</style>