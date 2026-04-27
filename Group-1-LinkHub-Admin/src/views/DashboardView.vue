<template>
    <DashboardLayout>
        <div class="premium-shell">
            <!-- 1. HEADER SECTION -->
            <header class="admin-header">
                <div class="header-content">
                    <div class="title-stack">
                        <span class="date-badge">{{ formattedDate }}</span>
                        <h1>Novia Insights</h1>
                        <p class="subtitle-text">Real-time overview of your platform's ecosystem.</p>
                    </div>
                </div>
            </header>

            <!-- 2. SUMMARY STATS ROW -->
            <section class="stats-row">
                <div v-for="card in dashboardStore.statCardsData" :key="card.label" class="stat-card">
                    <div class="stat-icon"
                        :style="{ color: card.iconColor || 'var(--accent)', background: (card.iconColor + '15') || 'rgba(99, 102, 241, 0.1)' }">
                        <i :class="card.icon"></i>
                    </div>
                    <div class="stat-data">
                        <div class="label-row">
                            <span class="label">{{ card.label }}</span>
                        </div>
                        <span class="value">{{ card.value }}</span>
                    </div>
                </div>
            </section>

            <!-- 3. BENTO GRID -->
            <main class="bento-grid-custom">

                <!-- THE DYNAMIC MULTI-COLOR CHART CARD -->
                <div class="content-wrapper bento-box main-chart">
                    <div class="box-header">
                        <div class="header-title">
                            <h3>System Distribution</h3>
                            <span class="live-indicator"><span class="pulse"></span> LIVE</span>
                        </div>
                    </div>

                    <div class="chart-container-inner">
                        <BarChart :data="distributionData" :options="chartOptions"
                            :is-loading="dashboardStore.isLoading" />
                    </div>
                </div>

                <!-- QUICK CONTROLS CARD -->
                <div class="content-wrapper bento-box quick-controls">
                    <div class="box-header">
                        <div class="header-title">
                            <h3>Quick Actions</h3>
                        </div>
                    </div>
                    <div class="actions-list">
                        <button v-for="action in dashboardStore.quickActionsData" :key="action.label"
                            class="action-tile-premium" @click="handleQuickAction(action.label)">
                            <div class="tile-icon-wrapper"><i :class="action.icon"></i></div>
                            <div class="tile-info">
                                <span class="tile-label">{{ action.label }}</span>
                                <span class="tile-sub">{{ action.sub }}</span>
                            </div>
                            <div class="tile-arrow"><i class="bi bi-chevron-right"></i></div>
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
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const dashboardStore = useDashboardStore()
const router = useRouter()

onMounted(() => {
    if (dashboardStore.fetchDashboardData) dashboardStore.fetchDashboardData()
})

const formattedDate = computed(() => {
    return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
})

/**
 * 1. DYNAMIC DATA & COLORS
 * This maps exactly to the screenshot colors and labels you provided.
 */
const distributionData = computed(() => {
    return {
        labels: ['Skills', 'Schools', 'Degrees', 'Subjects', 'Categories', 'Users'],
        datasets: [
            {
                label: 'Total Units',
                data: [
                    dashboardStore.totalSkills || 5,
                    dashboardStore.totalSchools || 9,
                    dashboardStore.totalDegrees || 7,
                    dashboardStore.totalSubjects || 7,
                    dashboardStore.totalCategories || 6,
                    dashboardStore.totalUsers || 155 // The big green bar
                ],
                backgroundColor: [
                    '#3b82f6', // Blue
                    '#10b981', // Teal
                    '#f59e0b', // Orange
                    '#6366f1', // Indigo
                    '#ec4899', // Pink
                    '#22c55e'  // Green
                ],
                borderRadius: 10,
                borderSkipped: false,
                barThickness: 35
            }
        ]
    }
})

/**
 * 2. PREMIUM CHART OPTIONS
 * Hides vertical grids and cleans up the Y-axis for a high-end look.
 */
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#18181b',
            titleFont: { weight: 'bold' },
            padding: 12,
            cornerRadius: 10,
            displayColors: false
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
            ticks: { color: '#71717a', font: { size: 11 } }
        },
        x: {
            grid: { display: false },
            ticks: { color: '#a1a1aa', font: { weight: '600', size: 12 } }
        }
    }
}

const handleQuickAction = (label) => {
    const routes = {
        'Add Skill': '/skills',
        'Add School': '/schools',
        'Add Degree': '/degrees',
        'Add Subject': '/subjects',
        'Add Category': '/category'
    }
    if (routes[label]) {
        router.push({ path: routes[label], query: { action: 'create' } })
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.premium-shell {
    --bg: #09090b;
    --surface: #121212;
    --border: #1f1f1f;
    --accent: #6366f1;
    --text-main: #fafafa;
    --text-muted: #71717a;
    background: var(--bg);
    color: var(--text-main);
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    padding: 2.5rem;
}

/* Header Styling */
.admin-header {
    margin-bottom: 2.5rem;
}

.title-stack h1 {
    font-size: 2.5rem;
    font-weight: 800;
    letter-spacing: -1.2px;
    margin: 0;
    color: white;
}

.subtitle-text {
    color: var(--text-muted);
    margin-top: 0.5rem;
    font-size: 1rem;
}

.date-badge {
    color: var(--accent);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
    display: block;
}

/* Mini Stats Row */
.stats-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2.5rem;
}

.stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

.stat-icon {
    width: 54px;
    height: 54px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
}

.stat-data .value {
    font-size: 1.75rem;
    font-weight: 700;
    color: white;
    display: block;
}

.stat-data .label {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 600;
    text-transform: uppercase;
}

/* Bento Grid System */
.bento-grid-custom {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1.5rem;
}

.bento-box {
    padding: 1.75rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
}

.main-chart {
    grid-column: span 8;
    min-height: 480px;
}

.quick-controls {
    grid-column: span 4;
}

.box-header {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.box-header h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #efefef;
    margin: 0;
}

/* The Chart Container */
.chart-container-inner {
    height: 350px;
    width: 100%;
    position: relative;
}

/* Quick Action Buttons */
.actions-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.action-tile-premium {
    display: flex;
    align-items: center;
    background: #18181b;
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1rem;
    cursor: pointer;
    transition: 0.2s;
    text-align: left;
    color: white;
    width: 100%;
}

.action-tile-premium:hover {
    border-color: var(--accent);
    background: #1c1c21;
    transform: translateX(4px);
}

.tile-icon-wrapper {
    width: 40px;
    height: 40px;
    background: #27272a;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    font-size: 1.1rem;
    margin-right: 1rem;
}

.tile-label {
    display: block;
    font-weight: 700;
    font-size: 0.9rem;
}

.tile-sub {
    font-size: 0.75rem;
    color: var(--text-muted);
}

.tile-arrow {
    margin-left: auto;
    color: #3f3f46;
    font-size: 0.8rem;
}

/* Live Pulse Animation */
.live-indicator {
    font-size: 0.7rem;
    font-weight: 800;
    color: #22c55e;
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(34, 197, 94, 0.1);
    padding: 4px 10px;
    border-radius: 6px;
}

.pulse {
    width: 6px;
    height: 6px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulse-animation 2s infinite;
}

@keyframes pulse-animation {
    0% {
        box-shadow: 0 0 0 0px rgba(34, 197, 94, 0.4);
    }

    100% {
        box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
    }
}

/* Responsive Fix */
@media (max-width: 1100px) {

    .main-chart,
    .quick-controls {
        grid-column: span 12;
    }

    .stats-row {
        grid-template-columns: 1fr;
    }
}
</style>