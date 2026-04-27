<template>
    <DashboardLayout>
        <div class="dash-wrapper">
            <!-- 1. Header Section -->
            <header class="dash-header">
                <div class="header-left">
                    <span class="date-badge">{{ formattedDate }}</span>
                    <h1 class="serif-title">Insights Dashboard</h1>
                    <p class="subtitle">Monitor your platform's core metrics and user activity.</p>
                </div>
                <div class="header-right">
                    <button class="btn-secondary" @click="generateReport">
                        <i class="bi bi-download"></i> Export CSV
                    </button>
                    <RouterLink to="/analytics" class="btn-primary">
                        View Detailed Analytics <i class="bi bi-arrow-right-short"></i>
                    </RouterLink>
                </div>
            </header>

            <!-- 2. Stat Cards Row -->
            <section class="stats-grid">
                <div v-for="card in dashboardStore.statCardsData" :key="card.label" class="stat-box">
                    <div class="stat-top">
                        <div class="stat-icon-wrapper" :style="{ color: card.iconColor || '#fff' }">
                            <i :class="card.icon"></i>
                        </div>
                        <!-- Logic for positive/negative trends -->
                        <span v-if="card.trend" :class="['trend-badge', card.trend > 0 ? 'up' : 'down']">
                            <i :class="card.trend > 0 ? 'bi bi-graph-up' : 'bi bi-graph-down'"></i>
                            {{ card.trend > 0 ? '+' : '' }}{{ card.trend }}%
                        </span>
                    </div>
                    <div class="stat-content">
                        <h2 class="stat-value serif-title">{{ card.value }}</h2>
                        <p class="stat-label">{{ card.label }}</p>
                    </div>
                </div>
            </section>

            <!-- 3. Bento Grid Content -->
            <main class="bento-container">
                <!-- Main Chart -->
                <div class="bento-item main-chart">
                    <div class="item-head">
                        <h3>Category Distribution</h3>
                        <div class="head-actions">
                            <span class="dot-indicator"></span>
                            <small>Live Data</small>
                        </div>
                    </div>
                    <div class="chart-wrapper">
                        <BarChart :data="dashboardStore.barChartData" :is-loading="dashboardStore.isLoading" />
                    </div>
                </div>

                <!-- Quick Controls - NEWLY STYLED -->
                <div class="bento-item quick-controls">
                    <div class="item-head">
                        <h3>Quick Controls</h3>
                    </div>
                    <div class="actions-stack">
                        <button v-for="action in dashboardStore.quickActionsData" 
                            :key="action.label"
                            class="action-tile" 
                            @click="handleQuickAction(action.label)">
                            <div class="tile-icon">
                                <i :class="action.icon"></i>
                            </div>
                            <div class="tile-text">
                                <span class="label">{{ action.label }}</span>
                                <span class="sub">{{ action.sub }}</span>
                            </div>
                            <i class="bi bi-chevron-right arrow"></i>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'
import BarChart from '@/components/charts/BarChart.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const dashboardStore = useDashboardStore()
const router = useRouter()

onMounted(() => {
    if (dashboardStore.fetchDashboardData) {
        dashboardStore.fetchDashboardData()
    }
})

const formattedDate = computed(() => {
    return new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    }).toUpperCase();
})

const handleQuickAction = (label) => {
    const routes = { 
        'Add Skill': '/skills', 
        'Add School': '/schools', 
        'Add Degree': '/degrees', 
        'Add Subject': '/subjects', 
        'Add Category': '/category' 
    }
    if (routes[label]) router.push({ path: routes[label], query: { action: 'create' } })
}

const generateReport = () => {
    const csv = "Category,Value\n" + dashboardStore.statCardsData.map(c => `${c.label},${c.value}`).join("\n")
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `report-${new Date().getTime()}.csv`
    link.click()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600;700;800&display=swap');

/* Base Theme */
.dash-wrapper {
    padding: 40px;
    background: #010409;
    min-height: 100vh;
    color: #e6edf3;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
}

.serif-title {
    font-family: 'Source Serif 4', serif;
    letter-spacing: -0.02em;
}

/* Header Styling */
.dash-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 48px;
}

.date-badge {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #7d8590;
    margin-bottom: 8px;
    display: block;
}

.dash-header h1 {
    font-size: 48px;
    margin: 0;
    line-height: 1.1;
}

.subtitle {
    color: #7d8590;
    font-size: 16px;
    margin-top: 8px;
}

/* Header Buttons */
.header-right {
    display: flex;
    gap: 16px;
    align-items: center;
}

.btn-primary {
    background: #f0f6fc;
    color: #010409;
    padding: 12px 20px;
    border-radius: 10px;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.2s;
}

.btn-primary:hover { transform: translateY(-2px); }

.btn-secondary {
    background: transparent;
    border: 1px solid #30363d;
    color: #e6edf3;
    padding: 12px 20px;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-secondary:hover { background: #161b22; }

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin-bottom: 40px;
}

.stat-box {
    background: #0d1117;
    border: 1px solid #30363d;
    padding: 24px;
    border-radius: 20px;
}

.stat-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
}

.stat-icon-wrapper {
    font-size: 24px;
    background: #161b22;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
}

.trend-badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 4px;
}

.trend-badge.up { background: rgba(35, 134, 54, 0.15); color: #3fb950; }
.trend-badge.down { background: rgba(248, 81, 73, 0.15); color: #f85149; }

.stat-value {
    font-size: 56px;
    margin: 0;
    line-height: 1;
}

.stat-label {
    color: #7d8590;
    font-weight: 500;
    margin-top: 8px;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Bento Layout */
.bento-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 24px;
}

.bento-item {
    background: #0d1117;
    border: 1px solid #30363d;
    border-radius: 24px;
    padding: 24px;
}

.item-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.item-head h3 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.main-chart { grid-column: span 8; }
.quick-controls { grid-column: span 4; }

/* Quick Actions Styling (The Missing Piece) */
.actions-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.action-tile {
    display: flex;
    align-items: center;
    background: #161b22;
    border: 1px solid #30363d;
    border-radius: 16px;
    padding: 16px;
    width: 100%;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    color: inherit;
}

.action-tile:hover {
    border-color: #8b949e;
    background: #21262d;
    transform: translateX(4px);
}

.tile-icon {
    width: 40px;
    height: 40px;
    background: #0d1117;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    font-size: 18px;
    color: #79c0ff;
}

.tile-text {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.tile-text .label {
    font-weight: 600;
    font-size: 14px;
}

.tile-text .sub {
    font-size: 12px;
    color: #7d8590;
}

.arrow {
    color: #30363d;
    transition: color 0.2s;
}

.action-tile:hover .arrow {
    color: #f0f6fc;
}

/* Responsiveness */
@media (max-width: 1200px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .main-chart, .quick-controls { grid-column: span 12; }
}

@media (max-width: 768px) {
    .dash-header { flex-direction: column; align-items: flex-start; gap: 20px; }
    .stats-grid { grid-template-columns: 1fr; }
    .stat-value { font-size: 48px; }
}
</style>