<script setup>
defineProps(['isOpen']);
</script>

<template>
    <aside :class="['sidebar', { 'closed': !isOpen }]">
        <div class="sidebar-scroll">
            <p class="section-tag">MAIN</p>
            <div class="menu-item active">
                <span class="material-icons">grid_view</span>
                <span>Dashboard</span>
                <span class="material-icons arrow">expand_more</span>
            </div>
            <ul class="sub-links">
                <li>Default</li>
                <li class="active-sub">Alternate</li>
                <li>Graphical</li>
            </ul>

            <p class="section-tag">UI ELEMENTS</p>
            <div class="menu-item">
                <span class="material-icons">widgets</span>
                <span>Widgets</span>
            </div>
            <div class="menu-item">
                <span class="material-icons">shopping_cart</span>
                <span>eCommerce</span>
                <span class="material-icons arrow">chevron_right</span>
            </div>
        </div>
    </aside>
</template>

<style scoped>
.sidebar {
    width: 250px;
    flex-shrink: 0;
    /* Stop sidebar from getting squashed */
    background: #111c2d;
    border-right: 1px solid #1e293b;
    transition: width 0.3s ease, margin 0.3s ease;
    overflow: hidden;
}

.sidebar.closed {
    width: 0;
    border: none;
}
.sidebar {
width: 250px;
background: #111c2d;
border-right: 1px solid #1e293b;
transition: width 0.3s ease;
overflow: hidden;
height: 100%;
}

.sidebar.closed {
width: 0;
border: none;
}

.sidebar-scroll {
width: 250px;
padding-top: 20px;
}

.section-tag {
padding: 15px 25px 8px;
font-size: 11px;
color: #475569;
letter-spacing: 1px;
}

.menu-item {
display: flex;
align-items: center;
padding: 12px 25px;
gap: 15px;
color: #94a3b8;
cursor: pointer;
transition: 0.2s;
}

.menu-item:hover,
.menu-item.active {
background: #1e293b;
color: #fff;
}

.menu-item .arrow {
margin-left: auto;
font-size: 18px;
}

.sub-links {
list-style: none;
padding: 5px 0 10px 65px;
}

.sub-links li {
padding: 8px 0;
color: #94a3b8;
font-size: 14px;
cursor: pointer;
}

.sub-links li:hover,
.active-sub {
color: #3b82f6;
}
</style>