<template>
  <div class="prog-wrapper">
    <div class="item-head">
      <h3>{{ title }}</h3>
      <i :class="['bi', icon]"></i>
    </div>
    
    <div class="prog-chart-container">
      <Bar v-if="!isLoading && data" :data="chartData" :options="options" />
    </div>

    <div class="summary-stats">
      <div v-for="s in summary" :key="s.label" class="sum-box">
        <span class="sum-val">{{ s.value }}</span>
        <span class="sum-lab">{{ s.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  title: String,
  icon: String,
  data: {
    type: Object,
    default: () => ({ labels: [], values: [] })
  },
  summary: Array,
  isLoading: Boolean
})

const chartData = computed(() => ({
  labels: props.data?.labels || [],
  datasets: [{
    data: props.data?.values || [],
    backgroundColor: '#10b981',
    borderRadius: 20,
    barThickness: 10
  }]
}))

const options = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { display: false, max: 100 },
    y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 12 } } }
  }
}
</script>

<style scoped>
.prog-chart-container { height: 140px; margin-bottom: 20px; }
.summary-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; border-top: 1px solid var(--color-border); padding-top: 20px; }
.sum-box { display: flex; flex-direction: column; }
.sum-val { font-size: 20px; font-weight: 800; color: var(--color-text); }
.sum-lab { font-size: 11px; text-transform: uppercase; color: var(--color-muted); font-weight: 600; }
</style>