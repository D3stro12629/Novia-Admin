<template>
    <DashboardLayout>
        <div class="app-shell" :class="{ 'is-loading': isLoading }">
            <!-- 1. HEADER -->
            <header class="admin-header">
                <div class="header-content">
                    <div class="title-stack">
                        <h1>Directory <span class="count-chip" v-if="!isLoading">{{ userStore.pagination.total }}</span></h1>
                    </div>

                    <div class="header-actions">
                        <div class="search-wrapper">
                            <i class="bi bi-search search-icon"></i>
                            <input v-model="searchQuery" type="text" placeholder="Search members..." />
                            <div class="search-shortcut">⌘K</div>
                        </div>

                        <div class="view-controls">
                            <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'"><i class="bi bi-grid-3x3-gap"></i></button>
                            <button :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'"><i class="bi bi-list-task"></i></button>
                        </div>
                    </div>
                </div>
            </header>

            <!-- 2. BENTO STATS -->
            <section class="stats-row">
                <template v-if="isLoading">
                    <div v-for="i in 3" :key="'stat-s-' + i" class="stat-card skeleton">
                        <div class="shimmer icon-ghost"></div>
                        <div class="stat-ghost-info">
                            <div class="shimmer line-sm"></div>
                            <div class="shimmer line-lg"></div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="stat-card">
                        <div class="stat-icon blue"><i class="bi bi-people-fill"></i></div>
                        <div class="stat-data">
                            <span class="label">Total Members</span>
                            <span class="value">{{ userStore.pagination.total }}</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon green"><i class="bi bi-patch-check-fill"></i></div>
                        <div class="stat-data">
                            <span class="label">Active Now</span>
                            <span class="value">{{ Math.floor(userStore.pagination.total * 0.4) }}</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon purple"><i class="bi bi-lightning-fill"></i></div>
                        <div class="stat-data">
                            <span class="label">Growth</span>
                            <span class="value">+12%</span>
                        </div>
                    </div>
                </template>
            </section>

            <!-- 3. MAIN CONTENT -->
            <main class="content-wrapper">
                
                <!-- GRID VIEW -->
                <div v-if="viewMode === 'grid'" class="grid-layout">
                    <template v-if="isLoading">
                        <div v-for="i in 6" :key="'grid-s-' + i" class="grid-card-skeleton">
                            <div class="shimmer avatar-ghost"></div>
                            <div class="shimmer line-name"></div>
                            <div class="shimmer line-email"></div>
                            <div class="grid-foot-skeleton">
                                <div class="shimmer line-id"></div>
                                <div class="shimmer line-btn"></div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div v-for="user in filteredUsers" :key="user.id" class="user-card" @click="viewUser(user)">
                            <div class="card-status-dot online"></div>
                            <div class="card-body">
                                <img :src="getAvatarUrl(user.avatar)" @error="handleImageError" />
                                <h3>{{ user.full_name }}</h3>
                                <p>{{ user.email }}</p>
                            </div>
                            <div class="card-footer">
                                <span class="id-tag">ID #{{ user.id }}</span>
                                <span class="view-link">View Profile <i class="bi bi-chevron-right"></i></span>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- TABLE VIEW -->
                <div v-else class="table-container">
                    <table class="premium-table">
                        <thead>
                            <tr>
                                <th>Member Name</th>
                                <th>Email Contact</th>
                                <th>Current Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-if="isLoading">
                                <tr v-for="i in 8" :key="'table-s-' + i">
                                    <td>
                                        <div class="member-col-ghost">
                                            <div class="shimmer mini-avatar"></div>
                                            <div class="shimmer line-md"></div>
                                        </div>
                                    </td>
                                    <td><div class="shimmer line-lg"></div></td>
                                    <td><div class="shimmer badge-ghost"></div></td>
                                    <td class="text-end"><div class="shimmer circle-ghost"></div></td>
                                </tr>
                            </template>
                            <template v-else>
                                <tr v-for="user in filteredUsers" :key="user.id" @click="viewUser(user)">
                                    <td>
                                        <div class="member-cell">
                                            <img :src="getAvatarUrl(user.avatar)" @error="handleImageError" />
                                            <span>{{ user.full_name }}</span>
                                        </div>
                                    </td>
                                    <td><span class="text-muted">{{ user.email }}</span></td>
                                    <td><span class="status-badge">Active</span></td>
                                    <td class="text-end"><i class="bi bi-chevron-right"></i></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>

                <!-- PAGINATION (MODIFIED FOR VISIBILITY) -->
                <footer class="pagination-footer" v-if="!isLoading && userStore.pagination.total > 0">
                    <div class="pagination-container">
                        <button 
                            class="pag-btn" 
                            :disabled="userStore.pagination.current_page <= 1"
                            @click="handlePageChange(userStore.pagination.current_page - 1)"
                        >
                            <i class="bi bi-chevron-left"></i>
                            <span>Prev</span>
                        </button>

                        <div class="page-numbers">
                            <button 
                                v-for="page in userStore.pagination.last_page" 
                                :key="page"
                                class="num-btn"
                                :class="{ active: page === userStore.pagination.current_page }"
                                @click="handlePageChange(page)"
                            >
                                {{ page }}
                            </button>
                        </div>

                        <button 
                            class="pag-btn" 
                            :disabled="userStore.pagination.current_page >= userStore.pagination.last_page"
                            @click="handlePageChange(userStore.pagination.current_page + 1)"
                        >
                            <span>Next</span>
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </footer>
            </main>

            <!-- 4. MODAL -->
            <Teleport to="body">
                <Transition name="premium-modal">
                    <div v-if="showViewModal && selectedUser" class="modal-overlay" @click.self="showViewModal = false">
                        <div class="modal-surface">
                            <aside class="modal-aside">
                                <div class="aside-profile">
                                    <div class="img-container">
                                        <img :src="getAvatarUrl(selectedUser.avatar)" @error="handleImageError" />
                                    </div>
                                    <h2>{{ selectedUser.full_name }}</h2>
                                    <p>User Account #{{ selectedUser.id }}</p>
                                </div>
                                <div class="aside-meta">
                                    <div class="meta-item"><i class="bi bi-envelope"></i> {{ selectedUser.email }}</div>
                                    <div class="meta-item"><i class="bi bi-geo-alt"></i> {{ selectedUser.current_city || 'Location Hidden' }}</div>
                                </div>
                            </aside>
                            <main class="modal-main">
                                <div class="modal-header">
                                    <h3>Account Overview</h3>
                                    <button class="close-icon" @click="showViewModal = false"><i class="bi bi-x"></i></button>
                                </div>
                                <div class="data-grid">
                                    <div class="data-box"><label>Full Name</label><p>{{ selectedUser.full_name }}</p></div>
                                    <div class="data-box"><label>Date of Birth</label><p>{{ formatDate(selectedUser.dob) || '—' }}</p></div>
                                    <div class="data-box"><label>Gender</label><p>{{ formatGender(selectedUser.gender) }}</p></div>
                                    <div class="data-box"><label>Hometown</label><p>{{ selectedUser.home_town || '—' }}</p></div>
                                    <div class="data-box full"><label>Portfolio Website</label><p class="link">{{ selectedUser.portfolio_link || 'No link provided' }}</p></div>
                                </div>
                                <div class="modal-actions">
                                    <button class="btn-close" @click="showViewModal = false">Close</button>
                                </div>
                            </main>
                        </div>
                    </div>
                </Transition>
            </Teleport>
        </div>
    </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/users'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const isLoading = ref(true)
const userStore = useUserStore()
const viewMode = ref('grid')
const showViewModal = ref(false)
const selectedUser = ref(null)
const searchQuery = ref('')
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://novia2.csm.linkpc.net'

onMounted(async () => {
    isLoading.value = true
    try {
        await userStore.fetchUsers(1)
    } finally {
        setTimeout(() => isLoading.value = false, 1000)
    }
})

const handlePageChange = async (page) => {
    if (page < 1 || page > userStore.pagination.last_page) return
    isLoading.value = true
    try {
        await userStore.fetchUsers(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
        setTimeout(() => isLoading.value = false, 800)
    }
}

watch(showViewModal, (val) => document.body.style.overflow = val ? 'hidden' : '')
onUnmounted(() => document.body.style.overflow = '')

const filteredUsers = computed(() => {
    if (!searchQuery.value) return userStore.users
    const q = searchQuery.value.toLowerCase()
    return userStore.users.filter(u => u.full_name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q))
})

const viewUser = (u) => { selectedUser.value = u; showViewModal.value = true }
const getAvatarUrl = (a) => (!a || a === 'no_photo.jpg') ? `https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff` : `${API_BASE_URL}/storage/avatars/${a}`
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : null
const formatGender = (g) => g == 1 ? 'Male' : g == 2 ? 'Female' : 'Other'
const handleImageError = (e) => e.target.src = 'https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

.app-shell {
    --bg: #09090b;
    --surface: #121215;
    --border: #27272a;
    --accent: #6366f1;
    --text-main: #fafafa;
    --text-muted: #a1a1aa;
    
    background: var(--bg);
    color: var(--text-main);
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    padding: 2.5rem 2.5rem 8rem 2.5rem; /* ADDED HUGE BOTTOM PADDING */
}

/* --- SHIMMER --- */
.shimmer {
    background: #1c1c21;
    background-image: linear-gradient(90deg, #1c1c21 0px, #2a2a32 40px, #1c1c21 80px);
    background-size: 200% 100%;
    animation: shimmer-anim 1.5s infinite linear;
    border-radius: 6px;
}
@keyframes shimmer-anim { 0% { background-position: -150% 0; } 100% { background-position: 150% 0; } }

/* --- HEADER --- */
.admin-header { margin-bottom: 2.5rem; }
.header-content { display: flex; justify-content: space-between; align-items: flex-end; }
.title-stack h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -2px; display: flex; align-items: center; gap: 1rem; }
.count-chip { font-size: 0.9rem; background: #1c1c21; padding: 4px 12px; border-radius: 20px; color: var(--text-muted); border: 1px solid var(--border); }

.search-wrapper { position: relative; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; width: 380px; display: flex; align-items: center; }
.search-icon { position: absolute; left: 1rem; color: var(--text-muted); }
.search-wrapper input { width: 100%; background: transparent; border: none; color: white; padding: 0.8rem 3.5rem 0.8rem 2.8rem; outline: none; }
.search-shortcut { position: absolute; right: 0.8rem; background: #27272a; color: #71717a; padding: 2px 6px; border-radius: 5px; font-size: 0.7rem; border: 1px solid #3f3f46; }

.view-controls { display: flex; background: var(--surface); padding: 4px; border-radius: 14px; border: 1px solid var(--border); margin-left: 1rem; }
.view-controls button { background: transparent; border: none; color: var(--text-muted); width: 44px; height: 38px; border-radius: 10px; cursor: pointer; transition: 0.2s; }
.view-controls button.active { background: #27272a; color: white; }
.header-actions { display: flex; align-items: center; }

/* --- STATS --- */
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 3rem; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 1.5rem; display: flex; align-items: center; gap: 1.25rem; }
.stat-icon { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
.stat-icon.blue { background: rgba(99, 102, 241, 0.1); color: var(--accent); }
.stat-icon.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
.stat-icon.purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
.stat-data .label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 2px; }
.stat-data .value { font-size: 1.75rem; font-weight: 800; }

/* --- GRID & TABLE --- */
.grid-layout { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.user-card { background: var(--surface); border: 1px solid var(--border); border-radius: 32px; padding: 2rem; cursor: pointer; transition: 0.4s; position: relative; }
.user-card:hover { border-color: var(--accent); transform: translateY(-8px); background: #16161a; }
.card-status-dot { width: 10px; height: 10px; background: #22c55e; border-radius: 50%; position: absolute; top: 25px; right: 25px; box-shadow: 0 0 10px #22c55e; }
.card-body { text-align: center; margin-bottom: 2.5rem; }
.card-body img { width: 100px; height: 100px; border-radius: 35px; object-fit: cover; border: 5px solid #1c1c21; }
.card-body h3 { font-size: 1.25rem; font-weight: 700; margin: 1rem 0 0.5rem 0; }
.card-body p { color: var(--text-muted); font-size: 0.85rem; }
.card-footer { border-top: 1px solid var(--border); padding-top: 1.5rem; display: flex; justify-content: space-between; }
.id-tag { font-family: monospace; color: var(--text-muted); font-size: 0.75rem; }
.view-link { font-size: 0.8rem; font-weight: 800; color: var(--accent); opacity: 0; transition: 0.3s; }
.user-card:hover .view-link { opacity: 1; }

.table-container { background: var(--surface); border: 1px solid var(--border); border-radius: 28px; overflow: hidden; }
.premium-table { width: 100%; border-collapse: collapse; }
.premium-table th { background: rgba(255, 255, 255, 0.02); text-align: left; padding: 1.25rem; font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border); }
.premium-table td { padding: 1.25rem; border-bottom: 1px solid var(--border); cursor: pointer; }
.member-cell { display: flex; align-items: center; gap: 1rem; font-weight: 700; }
.member-cell img { width: 42px; height: 42px; border-radius: 12px; }
.status-badge { background: rgba(34, 197, 94, 0.1); color: #34d399; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; }

/* --- PAGINATION (FIXED POS) --- */
.pagination-footer { margin-top: 4rem; display: flex; justify-content: center; width: 100%; padding-bottom: 2rem; }
.pagination-container { display: flex; align-items: center; gap: 1rem; background: var(--surface); padding: 0.75rem; border-radius: 20px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.pag-btn { background: #1c1c21; border: 1px solid var(--border); color: white; padding: 0.6rem 1.2rem; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 600; }
.pag-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.num-btn { background: transparent; border: none; color: var(--text-muted); width: 40px; height: 40px; border-radius: 10px; cursor: pointer; font-weight: 700; }
.num-btn.active { background: var(--accent); color: white; }

/* --- MODAL --- */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center; z-index: 9999; padding: 2rem; }
.modal-surface { background: #09090b; border: 1px solid var(--border); border-radius: 40px; width: 100%; max-width: 750px; display: grid; grid-template-columns: 260px 1fr; overflow: hidden; }
.modal-aside { background: #121216; border-right: 1px solid var(--border); padding: 2.5rem; text-align: center; }
.aside-profile .img-container img { width: 100px; height: 100px; border-radius: 35px; border: 4px solid #1c1c21; }
.aside-profile h2 { font-size: 1.5rem; font-weight: 800; margin-top: 1rem; }
.aside-meta { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; text-align: left; }
.meta-item { background: #09090b; padding: 0.8rem; border-radius: 14px; font-size: 0.8rem; color: var(--text-muted); border: 1px solid var(--border); display: flex; gap: 10px; }
.modal-main { padding: 2.5rem; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.modal-header h3 { font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 2px; }
.close-icon { background: #1c1c21; border: none; color: white; width: 40px; height: 40px; border-radius: 12px; cursor: pointer; font-size: 1.5rem; }
.data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.data-box { background: #121216; border: 1px solid var(--border); padding: 1.2rem; border-radius: 16px; }
.data-box label { display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.5rem; }
.data-box p { font-size: 1rem; font-weight: 700; margin: 0; }
.data-box.full { grid-column: span 2; }
.link { color: var(--accent); }
.modal-actions { margin-top: 2.5rem; display: flex; justify-content: flex-end; }
.btn-close { background: var(--accent); color: white; border: none; padding: 1rem 2.5rem; border-radius: 14px; font-weight: 800; cursor: pointer; }

/* --- SKELETONS --- */
.icon-ghost { width: 52px; height: 52px; border-radius: 16px; }
.stat-ghost-info { display: flex; flex-direction: column; gap: 8px; }
.line-sm { width: 60px; height: 10px; }
.line-lg { width: 100px; height: 20px; }
.grid-card-skeleton { background: var(--surface); padding: 2rem; border-radius: 32px; border: 1px solid var(--border); display: flex; flex-direction: column; align-items: center; }
.avatar-ghost { width: 100px; height: 100px; border-radius: 35px; margin-bottom: 1.5rem; }
.line-name { width: 60%; height: 15px; margin-bottom: 8px; }
.line-email { width: 40%; height: 12px; margin-bottom: 2rem; }
.grid-foot-skeleton { width: 100%; display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 1rem; }
.line-id, .line-btn { height: 10px; width: 40px; }

@media (max-width: 1100px) { .grid-layout { grid-template-columns: 1fr 1fr; } }
@media (max-width: 900px) {
    .modal-surface { grid-template-columns: 1fr; }
    .modal-aside { border-right: none; border-bottom: 1px solid var(--border); }
    .stats-row, .grid-layout { grid-template-columns: 1fr; }
}

.premium-modal-enter-active, .premium-modal-leave-active { transition: all 0.5s cubic-bezier(0.2, 1, 0.2, 1); }
.premium-modal-enter-from, .premium-modal-leave-to { opacity: 0; transform: scale(0.9) translateY(40px); }
</style>