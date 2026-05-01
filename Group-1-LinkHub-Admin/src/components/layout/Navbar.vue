<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Stores & Navigation
const authStore = useAuthStore();
const router = useRouter();
const emit = defineEmits(['toggleSidebar']);

// --- STATE ---
const isLoading = ref(true);

// --- COMPUTED (Linked to Store) ---
const user = computed(() => ({
    name: authStore.user?.full_name || 'Guest User',
    role: authStore.user?.role || 'Member',
    avatar: authStore.user?.avatar || `https://ui-avatars.com/api/?name=${authStore.user?.full_name || 'U'}&background=random`
}));

// --- ACTIONS ---
const goToProfile = () => {
    router.push({ name: 'profile' });
};

// Error handling for broken avatar images
const onAvatarError = (e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${user.value.name}&background=random`;
};

// Initialize Profile from Store
const fetchProfile = async () => {
    isLoading.value = true;
    try {
        await authStore.fetchProfile();
    } catch (error) {
        console.error("Error fetching profile from store:", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchProfile();
});
</script>

<template>
    <nav class="navbar">
        <!-- LEFT: Brand & Menu -->
        <div class="nav-left">
            <button class="icon-btn menu-btn" @click="emit('toggleSidebar')">
                <span class="material-icons">menu_open</span>
            </button>
            
            <div class="brand">
                <img src="../../../src/assets/logo2.png" alt="" class="brand-logo">
                <!-- <div class="brand-logo"> -->
                    <!-- logo image -->
                        <!-- <span class="material-icons">rocket_launch</span> -->
                    <!-- <span class="material-icons"><img src="../../../src/assets/logo.jpg" class="material-icons" alt=""></span> -->
                <!-- </div> -->
                <span class="brand-name">Connexion</span>
            </div>
        </div>

        <!-- CENTER: Search -->
        <div class="nav-center">
            <div class="search-container">
                <span class="material-icons search-icon">search</span>
                <input type="text" placeholder="Search dashboard..." />
                <kbd class="search-kbd">/</kbd>
            </div>
        </div>

        <!-- RIGHT: Profile -->
        <div class="nav-right">
            <div class="profile-card" @click="goToProfile" :class="{ 'is-loading': isLoading }">
                <div class="profile-text">
                    <span class="profile-name">{{ isLoading ? 'Loading...' : user.name }}</span>
                    <span class="profile-role">{{ isLoading ? 'Please wait' : user.role }}</span>
                </div>
                
                <div class="avatar-container">
                    <img 
                        v-if="!isLoading" 
                        :src="user.avatar" 
                        @error="onAvatarError"
                        alt="User Avatar" 
                        class="avatar-img" 
                    />
                    <div v-else class="avatar-placeholder"></div>
                    <div class="online-status"></div>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Main Container */
.navbar {
    height: 64px;
    background: #09090b;
    border-bottom: 1px solid #1f1f23;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    font-family: 'Inter', sans-serif;
    position: sticky;
    top: 0;
    z-index: 1000;
    transition: all 0.3s ease;
}

/* --- LEFT --- */
.nav-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.brand {
    display: flex;
    align-items: center;
    gap: 10px;
}

.brand-logo {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: cover;
}

/* .brand-logo .material-icons { font-size: 20px; } */

.brand-name {
    color: #ffffff;
    font-weight: 800;
    letter-spacing: 1px;
    font-size: 1.1rem;
}

/* --- CENTER (Search) --- */
.nav-center {
    flex: 1;
    max-width: 480px;
    margin: 0 20px;
}

.search-container {
    background: #18181b;
    border: 1px solid #27272a;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: 38px;
    transition: 0.2s;
}

.search-container:focus-within {
    border-color: #6366f1;
    background: #000;
}

.search-icon { color: #71717a; font-size: 18px; }

.search-container input {
    background: transparent;
    border: none;
    color: white;
    padding: 0 10px;
    width: 100%;
    outline: none;
    font-size: 0.9rem;
}

.search-kbd {
    background: #27272a;
    color: #a1a1aa;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: bold;
}

/* --- RIGHT --- */
.nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.icon-btn {
    background: transparent;
    border: none;
    color: #a1a1aa;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
}

.icon-btn:hover {
    background: #18181b;
    color: white;
}

/* PROFILE CARD */
.profile-card {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 10px;
    transition: 0.2s;
}

.profile-card:hover {
    background: #18181b;
}

.profile-text {
    display: flex;
    flex-direction: column;
    text-align: right;
}

.profile-name {
    color: white;
    font-size: 0.85rem;
    font-weight: 600;
}

.profile-role {
    color: #71717a;
    font-size: 0.75rem;
}

.avatar-container {
    position: relative;
    width: 38px;
    height: 38px;
}

.avatar-img, .avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
}

.avatar-placeholder {
    background: #27272a;
    animation: pulse 1.5s infinite;
}

.online-status {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 10px;
    height: 10px;
    background: #22c55e;
    border-radius: 50%;
    border: 2px solid #09090b;
}

/* LOADING ANIMATION */
@keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
}

/* RESPONSIVE */
@media (max-width: 768px) {
    .nav-center, .profile-text {
        display: none;
    }
}
</style>