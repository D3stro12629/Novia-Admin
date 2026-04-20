<template>
  <DashboardLayout>
    <div class="premium-shell">
      
      <header class="admin-header">
        <div class="header-content">
          <div class="title-stack">
            <h1>Help & Support <span class="count-chip">Live</span></h1>
            <p class="subtitle-text">Find answers, get in touch, or browse our documentation.</p>
          </div>
          
          <div class="action-group">
            <div class="search-wrapper">
              <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input v-model="searchQuery" type="text" placeholder="Search documentation..." />
              <span class="search-shortcut">⌘K</span>
            </div>
          </div>
        </div>
      </header>

      <div class="status-banner-premium">
        <div class="status-indicator">
          <span class="status-dot"></span>
          <span class="status-text">All systems operational</span>
        </div>
        <a class="status-link" @click="viewSystemStatus">System Status →</a>
      </div>

      <section class="admin-header">
        <h2 class="section-label">Browse by topic</h2>
        <div class="stats-row">
          <div
            v-for="cat in categories"
            :key="cat.title"
            class="stat-card clickable"
            @click="cat.action"
          >
            <div class="stat-icon" :style="{ background: `rgba(${cat.rgb}, 0.1)`, color: `rgb(${cat.rgb})` }">
              <component :is="cat.icon" />
            </div>
            <div class="stat-data">
              <span class="value" style="font-size: 1.1rem;">{{ cat.title }}</span>
              <span class="label">{{ cat.desc }}</span>
            </div>
          </div>
        </div>
      </section>

      <div class="help-grid-layout">
        <section class="content-wrapper">
          <div class="premium-table-header">
            <h2 class="section-label" style="padding: 1.5rem 1.5rem 0rem; font-size: 1.3rem;color: var(--text-main);">Frequently Asked Questions</h2>
          </div>
          <div class="faq-list-premium">
            <div
              v-for="(faq, i) in filteredFaqs"
              :key="i"
              class="faq-item-premium"
              :class="{ 'active': openFaq === i }"
            >
              <button class="faq-trigger" @click="toggleFaq(i)">
                <span class="name-text">{{ faq.q }}</span>
                <svg class="action-icon" :class="{'rotate': openFaq === i}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              <div v-show="openFaq === i" class="faq-body">
                <p class="subtitle-text">{{ faq.a }}</p>
              </div>
            </div>
          </div>
        </section>

        <div class="help-sidebar">
          <div class="stat-card full-column">
             <h2 class="section-label">Popular Articles</h2>
             <div class="article-links">
                <a v-for="article in popularArticles" :key="article.title" :href="article.href" class="article-item">
                  {{ article.title }}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
             </div>
          </div>

          <div class="contact-grid-premium">
            <div v-for="contact in contactOptions" :key="contact.title" class="contact-mini-card">
               <span class="emoji-icon">{{ contact.emoji }}</span>
               <div class="contact-info">
                 <span class="name-text" style="font-size: 0.85rem;">{{ contact.title }}</span>
                 <p class="label" style="margin:0">{{ contact.desc }}</p>
               </div>
               <a :href="contact.href" class="action-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const searchQuery = ref('')
const openFaq = ref(0)

const toggleFaq = (i) => {
  openFaq.value = openFaq.value === i ? null : i
}

const categories = [
  { title: 'Getting started', desc: 'Onboarding & first steps', rgb: '99, 102, 241', icon: { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': 2 }, [h('path', { d: 'M13 10V3L4 14h7v7l9-11h-7z' })]) } },
  { title: 'Account', desc: 'Security & preferences', rgb: '168, 85, 247', icon: { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': 2 }, [h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }), h('circle', { cx: 12, cy: 7, r: 4 })]) } },
  { title: 'Billing', desc: 'Invoices & payments', rgb: '34, 197, 94', icon: { render: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 20, height: 20, fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': 2 }, [h('rect', { x: 1, y: 4, width: 22, height: 16, rx: 2 }), h('line', { x1: 1, y1: 10, x2: 23, y2: 10 })]) } },
]

const faqs = [
  { q: 'How do I reset my password?', a: 'Go to the login page and click "Forgot password." Enter your registered email and we\'ll send a reset link within a few minutes.' },
  { q: 'How do I upgrade or downgrade my plan?', a: 'Navigate to Settings → Billing → Manage plan. Upgrades take effect immediately; downgrades apply at the start of your next billing cycle.' },
  { q: 'Can I export my data?', a: 'Yes. Go to Settings → Privacy → Export data and choose JSON or CSV. Your export will be ready within 24 hours.' },
  { q: 'How do I add team members?', a: 'From your dashboard, go to Settings → Team → Invite members. Enter their email addresses and assign a role.' },
]

const filteredFaqs = computed(() => {
  if (!searchQuery.value.trim()) return faqs
  const q = searchQuery.value.toLowerCase()
  return faqs.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
})

const popularArticles = [
  { title: 'Set up two-factor authentication', href: '#' },
  { title: 'Understanding your billing cycle', href: '#' },
  { title: 'Connecting third-party integrations', href: '#' },
]

const contactOptions = [
  { emoji: '📧', title: 'Email support', desc: '24h response', href: 'mailto:support@linkhub.com' },
  // { emoji: '💬', title: 'Live chat', desc: 'Under 2 mins', href: '#' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
.name-text {
  color: var(--text-main);
}
.premium-shell {
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
  padding: 2rem;
}

.admin-header { margin-bottom: 2rem; }
.header-content { display: flex; justify-content: space-between; align-items: flex-end; }
.title-stack h1 { font-size: 2.2rem; font-weight: 800; letter-spacing: -1.5px; margin: 0; }
.count-chip { font-size: 0.7rem; background: rgba(99, 102, 241, 0.1); color: var(--accent); padding: 2px 10px; border-radius: 20px; border: 1px solid rgba(99, 102, 241, 0.2); vertical-align: middle; }
.subtitle-text { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem; }

.section-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); font-weight: 700; margin-bottom: 1rem; }

/* Bento Stats Style */
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; transition: 0.3s; }
.stat-card.clickable:hover { border-color: var(--accent); transform: translateY(-2px); cursor: pointer; }
.stat-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
.stat-data .value { font-weight: 700; display: block; margin-bottom: 2px; }
.stat-data .label { font-size: 0.75rem; color: var(--text-muted); }

/* Status Banner */
.status-banner-premium {
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.15);
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.status-indicator { display: flex; align-items: center; gap: 8px; }
.status-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 10px #22c55e; }
.status-text { font-size: 0.85rem; color: #4ade80; font-weight: 600; }
.status-link { font-size: 0.8rem; color: #22c55e; text-decoration: none; font-weight: 700; }

/* Grid Layout */
.help-grid-layout { display: grid; grid-template-columns: 1fr 320px; gap: 1.5rem; }

.content-wrapper { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; }
.faq-item-premium { border-bottom: 1px solid var(--border); }
.faq-trigger { width: 100%; background: none; border: none; padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; text-align: left; }
.faq-body { padding: 0 1.5rem 1.25rem; }
.faq-trigger .action-icon { transition: 0.3s; color: var(--text-muted); }
.faq-trigger .action-icon.rotate { transform: rotate(180deg); color: var(--accent); }

.help-sidebar { display: flex; flex-direction: column; gap: 1rem; }
.article-links { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; }
.article-item { font-size: 0.85rem; color: var(--text-muted); text-decoration: none; display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--border); transition: 0.2s; }
.article-item:hover { color: var(--text-main); }

.contact-grid-premium { display: flex; flex-direction: column; gap: 0.75rem; }
.contact-mini-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 0.75rem 1rem; display: flex; align-items: center; gap: 12px; }
.emoji-icon { font-size: 1.2rem; }
.contact-info { flex: 1; }

/* Search Wrapper Style */
.search-wrapper { position: relative; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; width: 280px; display: flex; align-items: center; }
.search-icon { position: absolute; left: 0.75rem; color: var(--text-muted); }
.search-wrapper input { width: 100%; background: transparent; border: none; color: white; padding: 0.6rem 2.5rem; outline: none; font-size: 0.85rem; }
.search-shortcut { position: absolute; right: 0.75rem; color: var(--text-muted); font-size: 0.7rem; font-family: 'JetBrains Mono'; }

@media (max-width: 992px) {
  .help-grid-layout { grid-template-columns: 1fr; }
  .stats-row { grid-template-columns: 1fr; }
}
</style>