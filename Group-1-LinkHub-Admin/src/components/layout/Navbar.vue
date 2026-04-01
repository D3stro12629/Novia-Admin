<script setup>
defineEmits(['toggleSidebar']);
</script>

<template>
    <nav class="navbar">
        <div class="nav-left">
            <span class="material-icons btn-icon" @click="$emit('toggleSidebar')">menu</span>
            <div class="logo">
                <span class="material-icons logo-icon">rocket_launch</span>
                <span class="logo-text">Rocker</span>
            </div>
        </div>

        <div class="nav-center">
            <div class="search-bar">
                <span class="material-icons">search</span>
                <input type="text" placeholder="Search..." />
            </div>
        </div>

        <div class="nav-right">
            <div class="icon-group">
                <span class="material-icons">wb_sunny</span>
                <span class="material-icons">grid_view</span>
                <div class="badge-container">
                    <span class="material-icons">notifications</span>
                    <span class="badge">7</span>
                </div>
            </div>

            <div class="profile-box">
                <div class="profile-text">
                    <p class="p-name">Pauline Seitz</p>
                    <p class="p-role">Web Designer</p>
                </div>
                <img src="https://i.pravatar.cc/40?u=pauline" class="nav-avatar" />
            </div>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    height: 70px;
    background: #111c2d;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
    border-bottom: 1px solid #1e293b;
    z-index: 100;
}

.nav-left {
    display: flex;
    align-items: center;
    gap: 20px;
    min-width: 200px;
}

.btn-icon {
    cursor: pointer;
    color: #94a3b8;
}

.logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
}

.logo-icon {
    color: #3b82f6;
}

.nav-center {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    padding-left: 40px;
}

.search-bar {
    display: flex;
    align-items: center;
    background: #1e293b;
    padding: 8px 15px;
    border-radius: 8px;
    width: 300px;
    gap: 10px;
}

.search-bar input {
    background: none;
    border: none;
    color: white;
    outline: none;
    width: 100%;
}

.nav-right {
    display: flex;
    align-items: center;
    gap: 25px;
}

.icon-group {
    display: flex;
    align-items: center;
    gap: 15px;
    color: #94a3b8;
}

.badge-container {
    position: relative;
}

.badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ef4444;
    font-size: 10px;
    padding: 2px 5px;
    border-radius: 10px;
    color: #fff;
}

.profile-box {
    display: flex;
    align-items: center;
    gap: 12px;
    border-left: 1px solid #1e293b;
    padding-left: 20px;
    white-space: nowrap;
}

.p-name {
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    margin: 0;
}

.p-role {
    font-size: 12px;
    color: #64748b;
    margin: 0;
}

.nav-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 2px solid #1e293b;
}

.navbar {
    height: 60px;
    width: 100%;
    background: #111c2d;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid #1e293b;
    flex-shrink: 0;
    /* Prevents navbar from squishing */
}

/* Ensure center area is flexible but doesn't push others out */
.nav-center {
    flex: 1;
    min-width: 0;
    display: flex;
    padding: 0 20px;
}

.search-bar {
    max-width: 400px;
    /* Limits search size so it doesn't push the profile icon off-screen */
    width: 100%;
    background: #1e293b;
    display: flex;
    align-items: center;
    padding: 6px 12px;
    border-radius: 6px;
}
</style>