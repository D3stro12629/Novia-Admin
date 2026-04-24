<template>
    <aside :class="['sidebar', { 'closed': !isOpen }]">
        <div class="sidebar-wrapper">
            <div class="nav-scroll-area">
                <nav class="nav-list">

                    <!-- Dashboard -->
                    <div :class="['nav-item dashboard-btn', { 'active': isActive('/dashboard') }]"
                        @click="navigateTo('/dashboard')" :title="!isOpen ? 'Dashboard' : ''">
                        <span class="material-icons">home</span>
                        <span v-if="isOpen" class="nav-label">Dashboard</span>
                    </div>

                    <!-- Settings Dropdown -->
                    <div :class="['nav-item', { 'parent-active': isRouteInSettings }]" @click="toggleSettings"
                        :title="!isOpen ? 'Settings' : ''">
                        <span class="material-icons">settings</span>
                        <span v-if="isOpen" class="nav-label">Settings</span>
                        <span v-if="isOpen" class="material-icons arrow-icon">
                            {{ isSettingsExpanded ? 'expand_more' : 'chevron_right' }}
                        </span>
                    </div>

                    <!-- Submenu Items -->
                    <Transition name="dropdown">
                        <div v-if="isSettingsExpanded && isOpen" class="submenu-container">
                            <div v-for="item in settingsItems" :key="item.path"
                                :class="['sub-item', { 'active': isActive(item.path) }]" @click="navigateTo(item.path)">
                                <span class="material-icons sub-icon">{{ item.icon }}</span>
                                <span class="nav-label">{{ item.name }}</span>
                            </div>
                        </div>
                    </Transition>

                    <div class="section-divider"></div>

                    <!-- Account -->
                    <p v-if="isOpen" class="section-label">Account</p>

                    <div :class="['nav-item', { 'active': isActive('/profile') }]" @click="navigateTo('/profile')"
                        :title="!isOpen ? 'Profile' : ''">
                        <span class="material-icons">person</span>
                        <span v-if="isOpen" class="nav-label">Profile</span>
                    </div>

                    <div :class="['nav-item', { 'active': isActive('/help') }]" @click="navigateTo('/help')"
                        :title="!isOpen ? 'Help' : ''">
                        <span class="material-icons">help_outline</span>
                        <span v-if="isOpen" class="nav-label">Help & Support</span>
                    </div>


                    <div class="nav-item logout-item" @click="showLogoutModal = true" :title="!isOpen ? 'Logout' : ''">
                        <span class="material-icons">logout</span>
                        <span v-if="isOpen" class="nav-label">Logout</span>
                    </div>

                </nav>
            </div>
        </div>
    </aside>

    <!-- Logout Modal -->
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="showLogoutModal" class="modal-overlay" @click.self="showLogoutModal = false">
                <div class="modal-card">
                    <div class="modal-icon"><span class="material-icons">security</span></div>
                    <h3>Security Check</h3>
                    <p>Are you sure you want to end your session?</p>
                    <div class="modal-btns">
                        <button class="btn-back" @click="showLogoutModal = false">Cancel</button>

                        <button class="btn-out" @click="handleLogout">Logout</button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

.sidebar {
    --bg: #09090b;
    --item-hover: #18181b;
    --item-active: #27272a;
    --accent: #6366f1;
    --text-muted: #71717a;

    width: 260px;
    height: calc(100vh - 60px);
    background: var(--bg);
    border-right: 1px solid #1f1f23;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: sticky;
    top: 60px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    z-index: 1000;
}

.sidebar.closed {
    width: 80px;
}

.sidebar-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.nav-scroll-area {
    flex: 1;
    overflow-y: auto;
    padding: 20px 0;
}

.nav-scroll-area::-webkit-scrollbar {
    width: 4px;
}

.nav-scroll-area::-webkit-scrollbar-thumb {
    background: #27272a;
    border-radius: 10px;
}

.nav-list {
    padding: 0 14px;
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    margin-bottom: 4px;
    border-radius: 12px;
    color: var(--text-muted);
    cursor: pointer;
    transition: 0.2s;
    gap: 16px;
}

.nav-item:hover {
    background: var(--item-hover);
    color: #fff;
}

.nav-item.active,
.parent-active {
    background: var(--item-active);
    color: #fff;
}

.nav-item .material-icons {
    font-size: 24px;
    color: #fff;
}

.nav-item.active .material-icons,
.parent-active .material-icons {
    color: var(--accent);
}

.nav-label {
    font-weight: 600;
    font-size: 0.95rem;
    white-space: nowrap;
    flex: 1;
}

.arrow-icon {
    font-size: 18px !important;
    color: var(--text-muted) !important;
}

.submenu-container {
    margin-left: 20px;
    border-left: 1px solid #1f1f23;
    padding-left: 10px;
    margin-bottom: 10px;
}

.sub-item {
    display: flex;
    align-items: center;
    padding: 10px 14px;
    border-radius: 10px;
    color: var(--text-muted);
    cursor: pointer;
    gap: 12px;
}

.sub-item:hover {
    color: #fff;
}

.sub-item.active {
    color: var(--accent);
    background: rgba(99, 102, 241, 0.05);
}

.sub-icon {
    font-size: 20px !important;
}

.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.3s ease;
    max-height: 500px;
    overflow: hidden;
}

.dropdown-enter-from,
.dropdown-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
}

.section-divider {
    height: 1px;
    background: #1f1f23;
    margin: 20px 10px;
}

.section-label {
    padding: 0 16px 10px;
    font-size: 0.65rem;
    font-weight: 800;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 1.2px;
}

.logout-item {
    color: #ef4444 !important;
}

.logout-item .material-icons {
    color: #ef4444;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
}

.modal-card {
    background: #121212;
    border: 1px solid #27272a;
    padding: 30px;
    border-radius: 20px;
    text-align: center;
    width: 90%;
    max-width: 350px;
}

.modal-icon {
    width: 50px;
    height: 50px;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    color: var(--accent);
}

.modal-btns {
    display: flex;
    gap: 10px;
    margin-top: 25px;
}

.modal-btns button {
    flex: 1;
    padding: 12px;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 700;
    border: none;
}

.btn-back {
    background: #27272a;
    color: #fff;
}

.btn-out {
    background: #ef4444;
    color: #fff;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.sidebar.closed .nav-item {
    justify-content: center;
    padding: 12px 0;
    gap: 0;
}

.sidebar.closed .arrow-icon,
.sidebar.closed .section-label,
.sidebar.closed .submenu-container {
    display: none;
}
</style>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // 1. Import your auth store

const props = defineProps({
    isOpen: { type: Boolean, default: true }
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore(); // 2. Initialize the store

// --- STATE ---
const isSettingsExpanded = ref(false);
const showLogoutModal = ref(false);

const settingsItems = [
    { name: 'Users', icon: 'group', path: '/users' },
    { name: 'Categories', icon: 'category', path: '/category' },
    { name: 'Degree', icon: 'workspace_premium', path: '/degrees' },
    { name: 'Schools', icon: 'school', path: '/schools' },
    { name: 'Skills', icon: 'psychology', path: '/skills' },
    { name: 'Subjects', icon: 'book', path: '/subjects' },
];

// --- LOGIC ---
const isActive = (path) => route.path === path;

const isRouteInSettings = computed(() =>
    settingsItems.some(item => route.path.startsWith(item.path))
);

watch(
    () => route.path,
    () => {
        if (isRouteInSettings.value) {
            isSettingsExpanded.value = true;
        }
    },
    { immediate: true }
);

const toggleSettings = () => {
    if (props.isOpen) {
        isSettingsExpanded.value = !isSettingsExpanded.value;
    }
};

const navigateTo = (path) => {
    router.push(path);
};

// ✅ FIXED: Now calls the API and clears state via the Pinia Store
const handleLogout = async () => {
    try {
        // This calls api.delete("/api/logout") AND clears localStorage/token
        await authStore.logout();
    } catch (error) {
        console.error("Logout failed:", error);
    } finally {
        // Close modal and send user to login regardless of API success
        showLogoutModal.value = false;
        router.push('/login');
    }
};

watch(() => props.isOpen, (newVal) => {
    if (!newVal) isSettingsExpanded.value = false;
    else if (isRouteInSettings.value) isSettingsExpanded.value = true;
});
</script>

<!-- The Template and Style remain the same as you provided -->