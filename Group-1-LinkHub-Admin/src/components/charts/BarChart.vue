<template>
  <div class="chart-box">
    <!-- Only render the chart if data exists and is not loading -->
    <Bar v-if="!isLoading && data" :data="chartData" :options="options" />
    <div v-else-if="isLoading" class="loader">Loading Chart...</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  data: {
    type: Object,
    default: () => ({ labels: [], values: [] })
  },
  isLoading: Boolean
})

const chartData = computed(() => ({
  // Use optional chaining (?.) to prevent "undefined" errors
  labels: props.data?.labels || [],
  datasets: [{
    data: props.data?.values || [],
    backgroundColor: '#6366f1',
    borderRadius: 8,
    barThickness: 30
  }]
}))

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
  }
}
</script>

<style scoped>
.chart-box { height: 250px; width: 100%; display: flex; align-items: center; justify-content: center; }
.loader { color: var(--color-muted); font-size: 14px; }
</style>