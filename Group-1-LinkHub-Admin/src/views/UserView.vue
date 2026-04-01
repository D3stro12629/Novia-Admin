<template>
    <div class="dashboard-container">
        <!-- Premium Header Section -->
        <header class="dashboard-header">
            <div class="header-left">
                <h1 class="text-gradient">User Directory</h1>
                <p class="text-subtitle">Manage your ecosystem and user permissions with precision.</p>
            </div>

            <div class="header-right">
                <div class="search-wrapper">
                    <i class="bi bi-search search-icon"></i>
                    <input v-model="searchQuery" type="text" placeholder="Search users..." class="glass-input" />
                </div>

                <div class="filter-dropdown">
                    <button class="glass-btn secondary">
                        <i class="bi bi-filter"></i> Filters
                    </button>
                </div>

                <div class="view-pill-toggle">
                    <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
                        <i class="bi bi-grid-fill"></i>
                    </button>
                    <button :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'">
                        <i class="bi bi-list-ul"></i>
                    </button>
                </div>
            </div>
        </header>

        <!-- Stats Section with Glow Effects -->
        <section class="stats-overview">
            <div class="stat-glass-card">
                <div class="stat-icon-box blue-glow"><i class="bi bi-people"></i></div>
                <div class="stat-content">
                    <span class="stat-label">Total Users</span>
                    <h2 class="stat-value">{{ userStore.pagination.total }}</h2>
                </div>
            </div>
            <div class="stat-glass-card">
                <div class="stat-icon-box green-glow"><i class="bi bi-person-check"></i></div>
                <div class="stat-content">
                    <span class="stat-label">Active Now</span>
                    <h2 class="stat-value">{{ activeUsersCount }}</h2>
                </div>
            </div>
            <div class="stat-glass-card">
                <div class="stat-icon-box purple-glow"><i class="bi bi-lightning-charge"></i></div>
                <div class="stat-content">
                    <span class="stat-label">New (30d)</span>
                    <h2 class="stat-value">{{ newUsersCount }}</h2>
                </div>
            </div>
        </section>

        <!-- Content Area -->
        <main class="content-view">
            <!-- Loading State -->
            <div v-if="userStore.isLoading" class="skeleton-grid">
                <div v-for="i in 8" :key="i" class="skeleton-card"></div>
            </div>

            <!-- Empty State -->
            <div v-else-if="filteredUsers.length === 0" class="empty-state-container">
                <div class="empty-illustration">
                    <i class="bi bi-search"></i>
                </div>
                <h3>No users found</h3>
                <p>Try adjusting your search or filters to find what you're looking for.</p>
                <button class="glass-btn primary" @click="searchQuery = ''">Clear Search</button>
            </div>

            <!-- Grid View -->
            <div v-else-if="viewMode === 'grid'" class="modern-user-grid">
                <div v-for="user in filteredUsers" :key="user.id" class="user-profile-card" @click="viewUser(user)">
                    <div class="card-header-gradient">
                        <span class="status-dot" :class="user.id % 3 === 0 ? 'inactive' : 'active'"></span>
                        <div class="card-actions">
                            <button class="icon-only-btn"><i class="bi bi-three-dots"></i></button>
                        </div>
                    </div>

                    <div class="card-profile-body">
                        <div class="avatar-floating-wrapper">
                            <img :src="getAvatarUrl(user.avatar)" :alt="user.full_name" @error="handleImageError" />
                        </div>
                        <div class="user-meta">
                            <h3>{{ user.full_name }}</h3>
                            <p class="email">{{ user.email }}</p>
                            <div class="badge-row">
                                <span class="location-badge">
                                    <i class="bi bi-geo-alt"></i> {{ user.current_city || 'Remote' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="card-footer">
                        <button class="view-profile-btn">View Profile <i class="bi bi-arrow-right-short"></i></button>
                    </div>
                </div>
            </div>

            <!-- Table View -->
            <div v-else class="modern-table-wrapper glass-panel">
                <table class="modern-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Contact</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in filteredUsers" :key="user.id" class="table-row-hover">
                            <td>
                                <div class="table-user-cell">
                                    <img :src="getAvatarUrl(user.avatar)" class="table-avatar"
                                        @error="handleImageError" />
                                    <div class="table-user-info">
                                        <span class="name">{{ user.full_name }}</span>
                                        <span class="id">ID: #{{ user.id }}</span>
                                    </div>
                                </div>
                            </td>
                            <td>{{ user.email }}</td>
                            <td>{{ user.current_city || '-' }}</td>
                            <td>
                                <span :class="['status-pill', user.id % 3 === 0 ? 'inactive' : 'active']">
                                    {{ user.id % 3 === 0 ? 'Offline' : 'Active' }}
                                </span>
                            </td>
                            <td>
                                <div class="table-actions">
                                    <button class="action-icon-btn" @click.stop="viewUser(user)"><i
                                            class="bi bi-eye"></i></button>
                                    <button class="action-icon-btn"><i class="bi bi-pencil"></i></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <footer class="modern-pagination">
                <div class="pagination-info">
                    Showing <span>{{ filteredUsers.length }}</span> of <span>{{ userStore.pagination.total }}</span>
                    users
                </div>
                <div class="pagination-controls">
                    <button :disabled="userStore.pagination.currentPage === 1"
                        @click="changePage(userStore.pagination.currentPage - 1)" class="pagination-btn">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <div class="page-numbers">
                        <span class="current-page">{{ userStore.pagination.currentPage }}</span>
                    </div>
                    <button :disabled="userStore.pagination.currentPage >= userStore.pagination.lastPage"
                        @click="changePage(userStore.pagination.currentPage + 1)" class="pagination-btn">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </footer>
        </main>

        <!-- Premium Profile Modal -->
        <Transition name="modal-fade">
            <div v-if="showViewModal" class="premium-modal-overlay" @click.self="showViewModal = false">
                <div class="premium-modal-content">
                    <button class="close-modal-btn" @click="showViewModal = false">
                        <i class="bi bi-x-lg"></i>
                    </button>

                    <div class="modal-grid">
                        <!-- Sidebar -->
                        <div class="modal-sidebar">
                            <div class="sidebar-user-card">
                                <img :src="getAvatarUrl(selectedUser.avatar)" class="large-avatar" />
                                <h2>{{ selectedUser.full_name }}</h2>
                                <p>{{ selectedUser.email }}</p>
                                <div class="social-links">
                                    <button class="social-btn"><i class="bi bi-linkedin"></i></button>
                                    <button class="social-btn"><i class="bi bi-github"></i></button>
                                </div>
                            </div>
                            <div class="quick-stats">
                                <div class="q-stat">
                                    <label>Joined</label>
                                    <span>{{ formatDate(selectedUser.created_at) }}</span>
                                </div>
                                <div class="q-stat">
                                    <label>Role</label>
                                    <span>Collaborator</span>
                                </div>
                            </div>
                        </div>

                        <!-- Details -->
                        <div class="modal-main">
                            <section class="info-section">
                                <h4 class="section-title">Personal Information</h4>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <label>Full Name</label>
                                        <p>{{ selectedUser.full_name }}</p>
                                    </div>
                                    <div class="info-item">
                                        <label>Birthday</label>
                                        <p>{{ formatDate(selectedUser.dob) }}</p>
                                    </div>
                                    <div class="info-item">
                                        <label>Gender</label>
                                        <p>{{ formatGender(selectedUser.gender) }}</p>
                                    </div>
                                    <div class="info-item">
                                        <label>Hometown</label>
                                        <p>{{ selectedUser.home_town || 'Not specified' }}</p>
                                    </div>
                                </div>
                            </section>

                            <section class="info-section">
                                <h4 class="section-title">Contact & Professional</h4>
                                <div class="info-grid">
                                    <div class="info-item">
                                        <label>Phone Number</label>
                                        <p>{{ selectedUser.phone || '—' }}</p>
                                    </div>
                                    <div class="info-item full">
                                        <label>Portfolio</label>
                                        <a :href="selectedUser.portfolio_link" target="_blank" class="link-accent">
                                            {{ selectedUser.portfolio_link || 'No portfolio linked' }}
                                        </a>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/users'

const userStore = useUserStore()
const viewMode = ref('grid')
const showViewModal = ref(false)
const selectedUser = ref(null)
const searchQuery = ref('')
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://novia2.csm.linkpc.net'

onMounted(async () => {
    await userStore.fetchUsers(1)
})

const filteredUsers = computed(() => {
    if (!searchQuery.value) return userStore.users
    const query = searchQuery.value.toLowerCase()
    return userStore.users.filter(u =>
        u.full_name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    )
})

const activeUsersCount = computed(() => Math.floor(userStore.pagination.total * 0.85)) // Mock active count

const newUsersCount = computed(() => {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return userStore.users.filter(u => new Date(u.created_at) > thirtyDaysAgo).length
})

const getAvatarUrl = (avatar) => {
    if (!avatar || avatar === 'no_photo.jpg') return '/images/avatar/avatar-illustrated-01.png'
    return `${API_BASE_URL}/storage/avatars/${avatar}`
}

const viewUser = (user) => {
    selectedUser.value = user
    showViewModal.value = true
}

const changePage = (page) => {
    userStore.fetchUsers(page)
}

const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatGender = (gender) => {
    if (gender === 1) return 'Male'
    if (gender === 2) return 'Female'
    return 'Other'
}

const handleImageError = (e) => {
    e.target.src = '/images/avatar/avatar-illustrated-01.png'
}
</script>

<style scoped>
/* Theme Variables */
:offset {
    --bg-main: #0a0a0c;
    --bg-card: rgba(22, 22, 26, 0.7);
    --border-color: rgba(255, 255, 255, 0.08);
    --accent-primary: #6366f1;
    --accent-glow: rgba(99, 102, 241, 0.3);
    --text-main: #f1f1f3;
    --text-muted: #94a3b8;
    --glass-effect: blur(12px) saturate(180%);
}

.dashboard-container {
    padding: 2rem;
    background-color: var(--bg-main);
    min-height: 100vh;
    color: var(--text-main);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Header & Search */
.dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2.5rem;
    gap: 2rem;
}

.text-gradient {
    background: linear-gradient(to right, #fff, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-size: 1.875rem;
    font-weight: 700;
    letter-spacing: -0.02em;
}

.text-subtitle {
    color: var(--text-muted);
    margin-top: 0.25rem;
}

.header-right {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.search-wrapper {
    position: relative;
    width: 300px;
}

.search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
}

.glass-input {
    width: 100%;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 0.6rem 1rem 0.6rem 2.8rem;
    color: white;
    transition: all 0.2s ease;
}

.glass-input:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 4px var(--accent-glow);
}

/* View Toggle Pill */
.view-pill-toggle {
    display: flex;
    background: var(--bg-card);
    padding: 4px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
}

.view-pill-toggle button {
    border: none;
    background: transparent;
    color: var(--text-muted);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-pill-toggle button.active {
    background: rgba(255, 255, 255, 0.1);
    color: white;
}

/* Stats Cards */
.stats-overview {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    margin-bottom: 2.5rem;
}

.stat-glass-card {
    background: var(--bg-card);
    backdrop-filter: var(--glass-effect);
    border: 1px solid var(--border-color);
    padding: 1.5rem;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    transition: transform 0.3s ease;
}

.stat-glass-card:hover {
    transform: translateY(-5px);
}

.stat-icon-box {
    width: 54px;
    height: 54px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.blue-glow {
    background: rgba(59, 130, 246, 0.15);
    color: #60a5fa;
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}

.green-glow {
    background: rgba(34, 197, 94, 0.15);
    color: #4ade80;
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
}

.purple-glow {
    background: rgba(168, 85, 247, 0.15);
    color: #c084fc;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.2);
}

/* Modern Grid Cards */
.modern-user-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

.user-profile-card {
    background: var(--bg-card);
    backdrop-filter: var(--glass-effect);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
}

.user-profile-card:hover {
    transform: scale(1.02);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.card-header-gradient {
    height: 80px;
    background: linear-gradient(135deg, #1e1e24 0%, #334155 100%);
    position: relative;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
}

.status-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid var(--bg-main);
}

.status-dot.active {
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
}

.status-dot.inactive {
    background: #64748b;
}

.avatar-floating-wrapper {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    padding: 4px;
    background: var(--bg-main);
    margin: -42px auto 0;
    position: relative;
    z-index: 2;
}

.avatar-floating-wrapper img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
}

.card-profile-body {
    padding: 1.5rem;
    text-align: center;
}

.user-meta h3 {
    font-size: 1.125rem;
    margin: 0.5rem 0 0.25rem;
}

.user-meta .email {
    color: var(--text-muted);
    font-size: 0.875rem;
    margin-bottom: 1rem;
}

.location-badge {
    background: rgba(255, 255, 255, 0.05);
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.75rem;
    color: var(--text-muted);
}

.card-footer {
    padding: 1rem;
    border-top: 1px solid var(--border-color);
    text-align: center;
}

.view-profile-btn {
    background: transparent;
    border: none;
    color: var(--accent-primary);
    font-weight: 600;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
}

/* Modern Table */
.glass-panel {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    overflow: hidden;
}

.modern-table {
    width: 100%;
    border-collapse: collapse;
}

.modern-table th {
    background: rgba(255, 255, 255, 0.02);
    padding: 1rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
}

.modern-table td {
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid var(--border-color);
}

.table-user-cell {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.table-avatar {
    width: 40px;
    height: 40px;
    border-radius: 10px;
}

.table-user-info .name {
    display: block;
    font-weight: 600;
}

.table-user-info .id {
    font-size: 0.75rem;
    color: var(--text-muted);
}

.status-pill {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
}

.status-pill.active {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
}

.status-pill.inactive {
    background: rgba(148, 163, 184, 0.1);
    color: #94a3b8;
}

/* Modal Design */
.premium-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
}

.premium-modal-content {
    background: #111114;
    width: 100%;
    max-width: 900px;
    border-radius: 24px;
    border: 1px solid var(--border-color);
    position: relative;
    overflow: hidden;
    animation: slideUp 0.4s ease-out;
}

.modal-grid {
    display: grid;
    grid-template-columns: 300px 1fr;
}

.modal-sidebar {
    background: rgba(255, 255, 255, 0.02);
    padding: 3rem 2rem;
    border-right: 1px solid var(--border-color);
    text-align: center;
}

.large-avatar {
    width: 120px;
    height: 120px;
    border-radius: 32px;
    margin-bottom: 1.5rem;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-main {
    padding: 3rem;
    max-height: 80vh;
    overflow-y: auto;
}

.info-section {
    margin-bottom: 2.5rem;
}

.section-title {
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--accent-primary);
    letter-spacing: 0.1em;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.5rem;
}

.info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

.info-item label {
    display: block;
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-bottom: 0.25rem;
}

.info-item p {
    font-weight: 500;
}

.info-item.full {
    grid-column: span 2;
}

/* Animations */
@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }

    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

/* Loading Skeleton */
.skeleton-card {
    height: 300px;
    background: linear-gradient(90deg, var(--bg-card) 25%, #1e1e24 50%, var(--bg-card) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 20px;
}

@keyframes shimmer {
    0% {
        background-position: 200% 0;
    }

    100% {
        background-position: -200% 0;
    }
}

@media (max-width: 992px) {
    .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .search-wrapper {
        width: 100%;
    }

    .stats-overview {
        grid-template-columns: 1fr;
    }

    .modal-grid {
        grid-template-columns: 1fr;
    }
}
</style>