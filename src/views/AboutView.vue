<script setup>
import DashboardLayout from '../layouts/DashboardLayout.vue';
</script>

<template>
  <DashboardLayout>
    <div class="content-header">
      <h2 class="title">Dashboard <span class="sub">Alternate</span></h2>
    </div>

    <div class="dashboard-grid">
      <div class="card lg-card">
        <div class="card-head">Sales Overview</div>
        <div class="chart-area line-bg"></div>
      </div>

      <div class="card sm-card">
        <div class="card-head">Order Status</div>
        <div class="bar-container">
          <div class="bar-item" style="height: 60%"></div>
          <div class="bar-item" style="height: 40%"></div>
          <div class="bar-item" style="height: 90%"></div>
          <div class="bar-item" style="height: 75%"></div>
          <div class="bar-item" style="height: 85%"></div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 25px;
  color: white;
}

.title .sub {
  font-size: 14px;
  font-weight: 400;
  color: #64748b;
  margin-left: 10px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.card {
  background: #111c2d;
  border-radius: 12px;
  border: 1px solid #1e293b;
  padding: 20px;
}

.card-head {
  font-weight: 600;
  margin-bottom: 20px;
  color: #94a3b8;
}

.chart-area {
  height: 260px;
  background: #0f172a;
  border-radius: 8px;
}

.line-bg {
  background: linear-gradient(to bottom, #1e293b 1px, transparent 1px);
  background-size: 100% 40px;
}

.bar-container {
  height: 260px;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
}

.bar-item {
  width: 16px;
  background: linear-gradient(to top, #f97316, #ec4899);
  border-radius: 10px 10px 0 0;
}

@media (max-width: 1100px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>