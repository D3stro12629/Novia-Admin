<template>
    <DashboardLayout>
        <div class="dash-wrapper">
            <!-- 1. Header Section -->
            <header class="dash-header">
                <div class="header-left">
                    <span class="date-badge">{{ new Date().toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric',
                        year: 'numeric' }) }}</span>
                    <h1>Insights Dashboard</h1>
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

            <!-- 2. Stat Cards Row -->
            <section class="stats-grid">
                <StatCard v-for="card in dashboardStore.statCardsData" :key="card.label" v-bind="card"
                    :is-loading="dashboardStore.isLoading" />
            </section>

            <!-- 3. Bento Grid Content -->
            <main class="bento-container">
                <!-- Top Left: Main Chart -->
                <div class="bento-item main-chart">
                    <div class="item-head">
                        <h3>Category Distribution</h3>
                        <i class="bi bi-pie-chart"></i>
                    </div>
                    <BarChart :data="dashboardStore.barChartData" :is-loading="dashboardStore.isLoading" />
                </div>

                <!-- Top Right: Actions -->
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

                <!-- Bottom Left: Progress -->
                <div class="bento-item progress-section">
                    <ProgressBarChart title="Completion Progress" icon="bi-check2-circle"
                        :data="dashboardStore.progressData" :summary="dashboardStore.summaryData"
                        :is-loading="dashboardStore.isLoading" />
                </div>

                <!-- Bottom Right: Users -->
                <div class="bento-item users-section">
                    <div class="item-head">
                        <h3>Recent Users</h3>
                        <span class="count-tag">{{ dashboardStore.userStats.totalUsers }} Total</span>
                    </div>

                    <div class="user-list">
                        <div v-for="user in dashboardStore.newestUsers" :key="user.id" class="user-card">
                            <img :src="getAvatarUrl(user.avatar)" class="u-avatar" />
                            <div class="u-info">
                                <span class="u-name">{{ user.full_name }}</span>
                                <span class="u-mail">{{ user.email }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'
import StatCard from '@/components/ui/StatCard.vue'
import BarChart from '@/components/charts/BarChart.vue'
import ProgressBarChart from '@/components/charts/ProgressBarChart.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const dashboardStore = useDashboardStore()
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://novia2.csm.linkpc.net'

onMounted(() => dashboardStore.fetchDashboardData())

const getAvatarUrl = (a) => (!a || a === 'no_photo.jpg' ? '/images/avatar/avatar-illustrated-01.png' : `${API_BASE_URL}/storage/avatars/${a}`)

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
.dash-wrapper {
    padding: 30px;
    background: var(--nav-bg);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

/* Header */
.dash-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.date-badge {
    background: var(--color-hover);
    padding: 4px 12px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-muted);
}

.dash-header h1 {
    font-size: 32px;
    font-weight: 800;
    margin: 8px 0;
    letter-spacing: -1px;
}

.dash-header p {
    color: var(--color-muted);
    margin: 0;
}

.header-right {
    display: flex;
    gap: 12px;
}

.btn-primary {
    background: var(--color-text);
    color: var(--nav-bg);
    padding: 12px 20px;
    border-radius: 12px;
    font-weight: 600;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-secondary {
    background: var(--nav-surface);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    padding: 12px 20px;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
}

/* Bento Layout */
.bento-container {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 24px;
}

.bento-item {
    background: var(--nav-surface);
    border: 1px solid var(--color-border);
    border-radius: 24px;
    padding: 24px;
}

.item-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.item-head h3 {
    font-size: 17px;
    font-weight: 700;
    margin: 0;
}

.main-chart {
    grid-column: span 8;
}

.quick-controls {
    grid-column: span 4;
}

.progress-section {
    grid-column: span 7;
}

.users-section {
    grid-column: span 5;
}

/* Quick Action Tiles */
.actions-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.action-tile {
    display: flex;
    align-items: center;
    padding: 14px;
    background: var(--nav-bg);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    cursor: pointer;
    transition: 0.2s;
    text-align: left;
    width: 100%;
}

.action-tile:hover {
    border-color: var(--color-text);
    transform: translateX(4px);
}

.tile-icon {
    width: 36px;
    height: 36px;
    background: var(--nav-surface);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
}

.tile-text .label {
    display: block;
    font-weight: 700;
    font-size: 14px;
}

.tile-text .sub {
    font-size: 12px;
    color: var(--color-muted);
}

.arrow {
    margin-left: auto;
    color: var(--color-muted);
}

/* User Cards */
.user-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.user-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    background: var(--nav-bg);
    border-radius: 14px;
    border: 1px solid var(--color-border);
}

.u-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    object-fit: cover;
}

.u-name {
    display: block;
    font-weight: 600;
    font-size: 14px;
}

.u-mail {
    font-size: 12px;
    color: var(--color-muted);
}

.count-tag {
    background: var(--color-text);
    color: var(--nav-bg);
    font-size: 10px;
    padding: 2px 8px;
    border-radius: 6px;
    font-weight: 800;
}

@media (max-width: 1024px) {

    .main-chart,
    .quick-controls,
    .progress-section,
    .users-section {
        grid-column: span 12;
    }
}
</style>