<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

defineEmits(['toggleSidebar']);

const router = useRouter();

// Theme state
const isDark = ref(true);
const toggleTheme = () => {
    isDark.value = !isDark.value;
};

// Navigate to Profile route
const goToProfile = () => {
    router.push({ name: 'profile' });
};
</script>

<template>
    <nav class="navbar">
        <!-- LEFT: Toggle & Logo (UNCHANGED) -->
        <div class="nav-left">
            <div class="menu-trigger" @click="$emit('toggleSidebar')">
                <span class="material-icons btn-icon">menu_open</span>
            </div>
            <div class="logo">
                <div class="logo-orb">
                    <span class="material-icons logo-icon">rocket_launch</span>
                </div>
                <span class="logo-text">Rocker</span>
            </div>
        </div>

        <!-- CENTER: Search (UNCHANGED) -->
        <div class="nav-center">
            <div class="search-bar">
                <span class="material-icons search-i">search</span>
                <input type="text" placeholder="Search anything..." />
                <div class="search-shortcut">/</div>
            </div>
        </div>

        <!-- RIGHT: Theme Toggle & Profile -->
        <div class="nav-right">
            <div class="icon-actions">
                <!-- Theme Switch Icon -->
                <div class="action-btn" @click="toggleTheme" :title="isDark ? 'Switch to Light' : 'Switch to Dark'">
                    <span class="material-icons">
                        {{ isDark ? 'light_mode' : 'dark_mode' }}
                    </span>
                </div>
            </div>

            <!-- Profile Section -->
            <div class="profile-section" @click="goToProfile">
                <div class="profile-info">
                    <p class="user-name">Pauline Seitz</p>
                    <p class="user-role">Web Designer</p>
                </div>
                <div class="avatar-wrapper">
                    <img src="https://i.pravatar.cc/40?u=pauline" alt="Profile" />
                    <div class="status-indicator"></div>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

.navbar {
    height: 60px;
    width: 100%;
    background: #09090b;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    border-bottom: 1px solid #1f1f23;
    position: sticky;
    top: 0;
    z-index: 1100;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

/* --- LEFT SECTION --- */
.nav-left {
    display: flex;
    align-items: center;
    gap: 24px;
    min-width: 230px;
}

.menu-trigger {
    cursor: pointer;
    color: #71717a;
    display: flex;
    align-items: center;
    transition: all 0.2s ease;
}

.menu-trigger:hover {
    color: #6366f1;
    transform: scale(1.1);
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo-orb {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
}

.logo-icon {
    font-size: 18px;
    color: #fff;
}

.logo-text {
    font-size: 1.15rem;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.5px;
}

/* --- CENTER SECTION --- */
.nav-center {
    flex: 1;
    display: flex;
    justify-content: center;
    max-width: 500px;
}

.search-bar {
    display: flex;
    align-items: center;
    background: #121215;
    border: 1px solid #1f1f23;
    padding: 6px 14px;
    border-radius: 12px;
    width: 100%;
    gap: 10px;
    transition: all 0.3s ease;
}

.search-bar:focus-within {
    border-color: #6366f1;
    background: #000;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-i {
    font-size: 18px;
    color: #71717a;
}

.search-bar input {
    background: none;
    border: none;
    color: #fafafa;
    outline: none;
    width: 100%;
    font-size: 0.85rem;
    font-weight: 500;
}

.search-shortcut {
    color: #3f3f46;
    font-size: 0.75rem;
    font-weight: 700;
    border: 1px solid #27272a;
    padding: 1px 6px;
    border-radius: 4px;
    background: #18181b;
}

/* --- RIGHT SECTION --- */
.nav-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.icon-actions {
    display: flex;
    align-items: center;
}

.action-btn {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #71717a;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-btn:hover {
    background: #18181b;
    color: #fff;
}

.action-btn .material-icons {
    font-size: 22px;
}

/* PROFILE SECTION */
.profile-section {
    display: flex;
    align-items: center;
    gap: 14px;
    padding-left: 20px;
    border-left: 1px solid #1f1f23;
    cursor: pointer;
    transition: opacity 0.2s ease;
}

.profile-section:hover {
    opacity: 0.8;
}

.profile-info {
    text-align: right;
}

.user-name {
    font-size: 0.85rem;
    font-weight: 700;
    color: #fff;
    margin: 0;
}

.user-role {
    font-size: 0.75rem;
    color: #71717a;
    margin: 0;
    font-weight: 500;
}

.avatar-wrapper {
    position: relative;
    width: 36px;
    height: 36px;
}

.avatar-wrapper img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid #27272a;
}

.status-indicator {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 10px;
    height: 10px;
    background: #22c55e;
    border-radius: 50%;
    border: 2px solid #09090b;
}

@media (max-width: 768px) {

    .profile-info,
    .nav-center {
        display: none;
    }

    .nav-left {
        min-width: auto;
    }
}
</style>