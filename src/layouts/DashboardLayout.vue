<script setup>
import { ref } from 'vue';
import Navbar from '../components/layout/Navbar.vue';
import Sidebar from '../components/layout/Sidebar.vue';

const isSidebarOpen = ref(true);
</script>

<template>
    <div class="layout-wrapper">
        <Navbar @toggleSidebar="isSidebarOpen = !isSidebarOpen" />
        <div class="body-wrapper">
            <Sidebar :isOpen="isSidebarOpen" />
            <main class="main-content">
                <slot/>
            </main>
        </div>
    </div>
</template>

<style>
/* Ensure the confirmation modal is above the profile modal */
:deep(.confirm-modal-backdrop) {
    z-index: 10000 !important; /* One level higher than your 9999 */
}
/* 1. Global reset to prevent any hidden margins from causing overflow */
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    /* Kill horizontal scroll globally */
    background-color: #020617;
}

* {
    box-sizing: border-box;
}

.layout-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;
    /* Use 100% instead of 100vw */
    overflow: hidden;
    /* Keeps the main structure rigid */
}

.body-wrapper {
    display: flex;
    flex: 1;
    width: 100%;
    overflow: hidden;
}

.main-content {
    flex: 1;
    min-width: 0;
    /* CRITICAL FIX: prevents flex child from growing larger than parent */
    padding: 25px;
    background-color: #020617;
    overflow-y: auto;
    /* Only vertical scroll allowed here */
    overflow-x: hidden;
    /* Extra safety */
}

/* Global Resets */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', sans-serif;
    background-color: #020617;
    color: #fff;
    overflow: hidden;
}

.layout-wrapper {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
}

.body-wrapper {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.main-content {
    flex: 1;
    padding: 30px;
    background-color: #020617;
    overflow-y: auto;
}
</style>