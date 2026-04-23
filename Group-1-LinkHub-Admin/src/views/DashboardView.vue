<template>
    <DashboardLayout>
        <div class="dash-wrapper">
            <!-- 1. Header Section -->
            <header class="dash-header">
                <div class="header-left">
                    <span class="date-badge">{{ formattedDate }}</span>
                    <h1 class="serif-title">Insights Dashboard</h1>
                    <p>Monitor your platform's core metrics and user activity.</p>
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

            <!-- 2. Stat Cards Row (Updated to match screenshot layout) -->
            <section class="stats-grid">
                <div v-for="card in dashboardStore.statCardsData" :key="card.label" class="stat-box">
                    <div class="stat-top">
                        <div class="stat-icon" :style="{ color: card.iconColor || 'var(--color-text)' }">
                            <i :class="card.icon"></i>
                        </div>
                        <span class="trend-badge" v-if="card.trend">
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
                <div class="bento-item main-chart">
                    <div class="item-head">
                        <h3>Category Distribution</h3>
                        <i class="bi bi-pie-chart"></i>
                    </div>
                    <BarChart :data="dashboardStore.barChartData" :is-loading="dashboardStore.isLoading" />
                </div>

                <div class="bento-item quick-controls">
                    <div class="item-head">
                        <h3>Quick Controls</h3>
                    </div>
                    <div class="actions-stack">
                        <button v-for="action in dashboardStore.quickActionsData" :key="action.label"
                            class="action-tile" @click="handleQuickAction(action.label)">
                            <div class="tile-icon"><i :class="action.icon"></i></div>
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

onMounted(() => dashboardStore.fetchDashboardData())

// Fix date formatting to match screenshot: "APR 22, 2026"
const formattedDate = computed(() => {
    return new Date().toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    }).toUpperCase();
})

const handleQuickAction = (label) => {
    const routes = { 'Add Skill': '/skill', 'Add School': '/school', 'Add Degree': '/degree', 'Add Subject': '/subject', 'Add Category': '/category' }
    if (routes[label]) router.push({ path: routes[label], query: { action: 'create' } })
}

const generateReport = () => {
    const csv = "Category,Value\n" + dashboardStore.statCardsData.map(c => `${c.label},${c.value}`).join("\n")
    const link = document.createElement("a")
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
    link.download = 'report.csv'
    link.click()
}
</script>

<style scoped>
/* Importing a Serif font for the headings to match the screenshot */
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,700..900;1,8..60,700..900&display=swap');

.serif-title {
    font-family: 'Source Serif 4', serif;
}

.dash-wrapper {
    padding: 40px;
    background: #02040a; /* Darker background from image */
    min-height: 100vh;
    color: #ffffff;
}

/* Header */
.dash-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 50px;
}

.date-badge {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 1px;
    color: #8b949e;
}

.dash-header h1 {
    font-size: 42px;
    margin: 10px 0;
    letter-spacing: -0.5px;
}

.dash-header p {
    color: #8b949e;
    font-size: 16px;
}

/* Stats Grid - Fixed to match the visual columns */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 40px;
    margin-bottom: 60px;
}

.stat-box {
    padding: 10px;
}

.stat-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.stat-icon {
    font-size: 24px;
}

.trend-badge {
    background: rgba(46, 160, 67, 0.15);
    color: #3fb950;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 700;
}

.stat-value {
    font-size: 48px;
    margin: 0;
    line-height: 1;
}

.stat-label {
    color: #8b949e;
    font-weight: 600;
    margin: 10px 0 0 0;
    font-size: 14px;
}

/* Buttons */
.btn-primary {
    background: #ffffff;
    color: #000;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-secondary {
    background: transparent;
    border: none;
    color: #ffffff;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
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
    border-radius: 20px;
    padding: 24px;
}

.main-chart { grid-column: span 8; }
.quick-controls { grid-column: span 4; }

@media (max-width: 1100px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>