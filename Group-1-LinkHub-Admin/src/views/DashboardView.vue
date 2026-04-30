<template>
    <DashboardLayout>
        <div class="premium-shell">
            <!-- 1. HEADER -->
            <header class="admin-header">
                <div class="header-content">
                    <div class="title-stack">
                        <!-- HEADER SKELETON -->
                        <template v-if="dashboardStore.isLoading">
                            <div class="skeleton-box date-badge-skel"></div>
                            <div class="skeleton-text title-skel"></div>
                            <div class="skeleton-text sub-skel"></div>
                        </template>
                        <!-- ACTUAL HEADER -->
                        <template v-else>
                            <span class="date-badge fade-in">{{ formattedDate }}</span>
                            <h1 class="fade-in">Connexion Insights</h1>
                            <p class="subtitle-text fade-in">Real-time overview of your platform's ecosystem.</p>
                        </template>
                    </div>
                </div>
            </header>

            <!-- 2. STATS ROW -->
            <section class="stats-row">
                <template v-if="dashboardStore.isLoading">
                    <div v-for="i in 3" :key="'stat-skel' + i" class="stat-card skeleton-card">
                        <div class="skeleton-circle stat-icon-skel"></div>
                        <div class="stat-data" style="flex:1">
                            <div class="skeleton-text label-skel"></div>
                            <div class="skeleton-text value-skel"></div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div v-for="card in dashboardStore.statCardsData" :key="card.label" class="stat-card fade-in">
                        <div class="stat-icon" :style="{ color: card.iconColor, background: card.iconColor + '15' }">
                            <i :class="card.icon"></i>
                        </div>
                        <div class="stat-data">
                            <span class="label">{{ card.label }}</span>
                            <span class="value">{{ card.value }}</span>
                        </div>
                    </div>
                </template>
            </section>

            <!-- 3. MAIN BENTO GRID -->
            <main class="bento-grid-custom">
                <!-- Main Chart -->
                <div class="content-wrapper bento-box main-chart-wrapper">
                    <!-- Chart handles its own internal loading based on props, but we keep it consistent -->
                    <BarChart title="Category Distribution" subtitle="Total Items by category" icon="bi-graph-up"
                        :data="dashboardStore.barChartData" :is-loading="dashboardStore.isLoading" />
                </div>

                <!-- Quick Controls -->
                <div class="content-wrapper bento-box quick-controls">
                    <div class="box-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div class="actions-list">
                        <template v-if="dashboardStore.isLoading">
                            <div v-for="i in 5" :key="'act-skel' + i" class="skeleton-action-tile">
                                <div class="skeleton-circle-sm"></div>
                                <div style="flex: 1">
                                    <div class="skeleton-text" style="width: 60%; height: 12px; margin-bottom: 6px;"></div>
                                    <div class="skeleton-text" style="width: 40%; height: 8px;"></div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <button v-for="action in dashboardStore.quickActionsData" :key="action.label"
                                class="action-tile-premium fade-in" @click="handleQuickAction(action.label)">
                                <div class="tile-icon-wrapper"><i :class="action.icon"></i></div>
                                <div class="tile-info">
                                    <span class="tile-label">{{ action.label }}</span>
                                    <span class="tile-sub">{{ action.sub }}</span>
                                </div>
                                <div class="tile-arrow ms-4"><i class="bi bi-chevron-right"></i></div>
                            </button>
                        </template>
                    </div>
                </div>

                <!-- RECENT SECTIONS -->
                <div v-for="section in recentSections" :key="section.title" class="bento-box recent-card">
                    <div class="box-header-flex">
                        <div class="header-title-group">
                            <template v-if="dashboardStore.isLoading">
                                <div class="skeleton-circle recent-icon-skel"></div>
                                <div>
                                    <div class="skeleton-text" style="width: 100px; height: 14px; margin-bottom: 6px;"></div>
                                    <div class="skeleton-text" style="width: 60px; height: 8px;"></div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="recent-icon-circle fade-in" :style="{ color: section.color, background: section.color + '15' }">
                                    <i :class="section.icon"></i>
                                </div>
                                <div class="fade-in">
                                    <h3>{{ section.title }}</h3>
                                    <span class="new-count-label" :style="{ color: section.color }">{{ section.data.length }} new this week</span>
                                </div>
                            </template>
                        </div>
                        <div v-if="dashboardStore.isLoading" class="skeleton-view-all"></div>
                        <button v-else class="view-all-btn fade-in" @click="router.push(section.route)">
                            View <i class="bi bi-arrow-right-short"></i>
                        </button>
                    </div>

                    <div v-if="dashboardStore.isLoading" class="skeleton-list">
                        <div v-for="i in 4" :key="i" class="skeleton-row-premium">
                            <div class="skeleton-text main-text-skel"></div>
                            <div class="skeleton-text side-text-skel"></div>
                        </div>
                    </div>

                    <div v-else class="recent-list custom-scrollbar fade-in">
                        <div v-for="item in section.data" :key="item.id" class="recent-item">
                            <div class="item-info">
                                <span class="item-name">{{ item.name || item.title || item.full_name }}</span>
                                <span class="item-date">{{ formatDate(item.created_at) }}</span>
                            </div>
                        </div>
                        
                        <div v-if="!section.data?.length" class="empty-state">
                            <i class="bi bi-calendar-x"></i>
                            <p>No records this week</p>
                        </div>
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
import BarChart from '@/components/charts/BarChart.vue'

const dashboardStore = useDashboardStore()
const router = useRouter()

onMounted(() => {
    dashboardStore.fetchDashboardData()
})

const formattedDate = computed(() => {
    return new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
})

const formatDate = (dateString) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const recentSections = computed(() => [
    { title: 'Recent Users', icon: 'bi-people-fill', color: '#3b82f6', data: dashboardStore.newestUsers, route: '/users' },
    { title: 'Recent Skills', icon: 'bi-lightbulb-fill', color: '#a855f7', data: dashboardStore.recentSkills, route: '/skills' },
    { title: 'Recent Schools', icon: 'bi-building-fill', color: '#10b981', data: dashboardStore.recentSchools, route: '/schools' },
    { title: 'Recent Degrees', icon: 'bi-mortarboard-fill', color: '#f59e0b', data: dashboardStore.recentDegrees, route: '/degrees' },
    { title: 'Recent Categories', icon: 'bi-folder-fill', color: '#06b6d4', data: dashboardStore.recentCategories, route: '/category' },
    { title: 'Recent Subjects', icon: 'bi-book-half', color: '#f97316', data: dashboardStore.recentSubjects, route: '/subjects' }
])

const handleQuickAction = (label) => {
    const routes = {
        'Add Skill': '/skills', 'Add School': '/schools', 'Add Degree': '/degrees',
        'Add Subject': '/subjects', 'Add Category': '/category'
    }
    if (routes[label]) router.push({ path: routes[label], query: { action: 'create' } })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

/* --- SHARED SKELETON BASE --- */
.skeleton-text, .skeleton-box, .skeleton-circle, .skeleton-circle-sm, .skeleton-card, .skeleton-action-tile, .skeleton-row-premium {
    background: #18181b;
    position: relative;
    overflow: hidden;
    border: none;
}

.skeleton-text::after, .skeleton-box::after, .skeleton-circle::after, .skeleton-circle-sm::after, .skeleton-card::after, .skeleton-action-tile::after, .skeleton-row-premium::after {
    content: "";
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
    animation: shimmer 1.8s infinite;
}

@keyframes shimmer {
    100% { transform: translateX(100%); }
}

.skeleton-text { background: #27272a; border-radius: 4px; }
.skeleton-circle { background: #27272a; border-radius: 50%; }
.skeleton-circle-sm { width: 36px; height: 36px; background: #27272a; border-radius: 10px; margin-right: 1rem; }

/* --- HEADER SKELETONS --- */
.date-badge-skel { width: 140px; height: 18px; border-radius: 100px; margin-bottom: 0.8rem; }
.title-skel { width: 320px; height: 40px; margin-bottom: 10px; border-radius: 8px; }
.sub-skel { width: 400px; height: 16px; border-radius: 4px; }

/* --- STAT CARD SKELETONS --- */
.skeleton-card { background: var(--surface) !important; border: 1px solid var(--border); }
.stat-icon-skel { width: 54px; height: 54px; border-radius: 14px; }
.label-skel { width: 40%; height: 10px; margin-bottom: 8px; }
.value-skel { width: 60%; height: 24px; }

/* --- QUICK ACTIONS SKELETONS --- */
.skeleton-action-tile { 
    display: flex; align-items: center; padding: 0.8rem; 
    border-radius: 16px; background: #18181b; border: 1px solid var(--border);
    height: 60px;
}

/* --- RECENT CARD SKELETONS --- */
.recent-icon-skel { width: 38px; height: 38px; border-radius: 10px; margin-right: 12px; }
.skeleton-view-all { width: 50px; height: 14px; background: #27272a; border-radius: 4px; }
.skeleton-row-premium {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.75rem 1rem; border-radius: 12px; height: 46px; margin-bottom: 8px;
    background: rgba(255,255,255,0.02);
}
.main-text-skel { width: 50%; height: 12px; }
.side-text-skel { width: 20%; height: 10px; }

/* --- TRANSITIONS --- */
.fade-in {
    animation: fadeInContent 0.5s ease forwards;
}

@keyframes fadeInContent {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
}

/* --- EXISTING UI STYLES --- */
.premium-shell {
    --bg: #09090b; --surface: #121212; --border: #1f1f1f;
    --accent: #6366f1; --text-main: #fafafa; --text-muted: #71717a;
    background: var(--bg); color: var(--text-main);
    font-family: 'Plus Jakarta Sans', sans-serif; 
    min-height: 100vh; padding: 2.5rem;
    overflow-x: hidden;
}

.admin-header { margin-bottom: 2.5rem; }
.title-stack h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -1.2px; margin: 0; color: white; }
.subtitle-text { color: var(--text-muted); margin-top: 0.5rem; }
.date-badge { color: var(--accent); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.5rem; display: block; }

.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 1.5rem; display: flex; align-items: center; gap: 1.25rem; }
.stat-icon { width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
.stat-data .value { font-size: 1.75rem; font-weight: 700; color: white; display: block; }
.stat-data .label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; }

.bento-grid-custom { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1.5rem; }
.bento-box { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 1.75rem; }
.main-chart-wrapper { grid-column: span 8; min-height: 400px; }
.quick-controls { grid-column: span 4; }
.recent-card { grid-column: span 4; }

.recent-icon-circle {
    width: 38px; height: 38px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; flex-shrink: 0;
}

.actions-list { display: flex; flex-direction: column; gap: 10px; margin-top: 1rem; }
.action-tile-premium { display: flex; align-items: center; background: #18181b; border: 1px solid var(--border); border-radius: 16px; padding: 0.8rem; cursor: pointer; transition: 0.2s; color: white; width: 100%; }
.action-tile-premium:hover { border-color: var(--accent); transform: translateX(4px); }
.tile-icon-wrapper { width: 36px; height: 36px; background: #27272a; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--accent); margin-right: 1rem; }
.tile-label { display: block; font-weight: 700; font-size: 0.85rem; }
.tile-sub { font-size: 0.7rem; color: var(--text-muted); }

.box-header-flex { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.header-title-group { display: flex; align-items: center; gap: 10px; max-width: 75%; }
.header-title-group h3 { font-size: 0.95rem; font-weight: 700; margin: 0; line-height: 1.2; color: white; }
.new-count-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; display: block; }

.view-all-btn { background: none; border: none; color: var(--text-muted); font-size: 0.75rem; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 4px; white-space: nowrap; padding-top: 4px; }
.view-all-btn:hover { color: white; }

.recent-list { display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto; padding-right: 4px; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }

.recent-item { background: rgba(255,255,255,0.02); padding: 0.75rem 1rem; border-radius: 12px; border: 1px solid transparent; transition: 0.2s; }
.recent-item:hover { background: rgba(255,255,255,0.04); border-color: #27272a; transform: translateY(-2px); }
.item-info { display: flex; justify-content: space-between; align-items: center; }
.item-name { font-size: 0.9rem; font-weight: 600; color: #f4f4f5; }
.item-date { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }

.empty-state { text-align: center; padding: 2.5rem; color: var(--text-muted); border: 1px dashed var(--border); border-radius: 16px; font-size: 0.8rem; }
.empty-state i { font-size: 1.5rem; display: block; margin-bottom: 0.5rem; opacity: 0.5; }

@media (max-width: 1100px) { 
    .main-chart-wrapper, .quick-controls, .recent-card { grid-column: span 12; } 
    .stats-row { grid-template-columns: 1fr; } 
    .premium-shell { padding: 1.5rem; }
}
</style>