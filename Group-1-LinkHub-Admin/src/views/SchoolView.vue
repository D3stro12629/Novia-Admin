<template>
  <DashboardLayout>
    <div class="premium-shell" :class="{ 'is-loading': schoolStore.isLoading }">
      
      <!-- 1. HEADER SECTION -->
      <header class="admin-header">
        <div class="header-content">
          <div class="title-stack">
            <h1>
              Schools
              <span class="count-chip" v-if="!schoolStore.isLoading">
                {{ schoolStore.schools?.length || 0 }} Total
              </span>
            </h1>
            <p class="subtitle-text">Manage and monitor your educational institutions</p>
          </div>

          <div class="header-actions">
            <div class="action-group">
              <div class="search-wrapper">
                <i class="bi bi-search search-icon"></i>
                <input v-model="searchQuery" type="text" placeholder="Search schools..." />
                <div class="search-shortcut">⌘K</div>
              </div>
              <button class="primary-add-btn" @click="openCreateModal">
                <i class="bi bi-plus-lg"></i>
                <span>Add School</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 2. BENTO STATS SECTION -->
      <section class="stats-row">
        <template v-if="schoolStore.isLoading">
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
            <div class="stat-icon blue"><i class="bi bi-building-fill"></i></div>
            <div class="stat-data">
              <span class="label">Total Items</span>
              <span class="value">{{ schoolStore.schools?.length || 0 }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green"><i class="bi bi-patch-check-fill"></i></div>
            <div class="stat-data">
              <span class="label">Active Now</span>
              <span class="value">{{ activeCount }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon purple"><i class="bi bi-lightning-fill"></i></div>
            <div class="stat-data">
              <span class="label">Recently Added</span>
              <span class="value">{{ newlyAddedCount }}</span>
            </div>
          </div>
        </template>
      </section>

      <!-- 3. MAIN TABLE SECTION -->
      <main class="content-wrapper">
        <div class="table-container">
          <table class="premium-table">
            <thead>
              <tr>
                <th class="col-id">ID</th>
                <th class="col-name">School Name</th>
                <th class="col-status">Current Status</th>
                <th class="col-date">Created Date</th>
                <th class="col-actions text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="schoolStore.isLoading">
                <tr v-for="i in 6" :key="'table-s-' + i">
                  <td><div class="shimmer line-id-ghost"></div></td>
                  <td><div class="shimmer line-md"></div></td>
                  <td><div class="shimmer badge-ghost"></div></td>
                  <td><div class="shimmer line-lg"></div></td>
                  <td class="text-end"><div class="shimmer circle-ghost"></div></td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="item in paginatedSchools" :key="item.id" class="hover-row">
                  <td class="col-id"><span class="id-tag">#{{ item.id }}</span></td>
                  <td class="col-name">
                    <div class="member-cell">
                      <div class="category-img-wrapper">
                        <div class="img-placeholder">{{ item.name.charAt(0) }}</div>
                      </div>
                      <span class="name-text" :title="item.name">{{ item.name }}</span>
                    </div>
                  </td>
                  <td class="col-status">
                    <span class="status-pill" :class="getStatusClass(item.status)">
                      {{ item.status || 'Active' }}
                    </span>
                  </td>
                  <td class="col-date">
                    <span class="date-text">{{ formatDate(item.created_at) }}</span>
                  </td>
                  <td class="col-actions text-end">
                    <div class="action-btns">
                      <button class="action-icon" @click="handleView(item)" title="View"><i class="bi bi-eye"></i></button>
                      <button class="action-icon" @click="handleEdit(item)" title="Edit"><i class="bi bi-pencil"></i></button>
                      <button class="action-icon delete" @click="handleDelete(item)" title="Delete"><i class="bi bi-trash"></i></button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>

          <footer v-if="totalEntries > 0" class="premium-pagination-footer">
            <div class="pagination-left">
              <p class="entries-text">
                Showing <span class="mono-num">{{ showingStart }}</span> 
                to <span class="mono-num">{{ showingEnd }}</span> 
                of <span class="mono-num total">{{ totalEntries }}</span> entries
              </p>
            </div>
            <div class="pagination-right">
              <BasePagination v-model:page="currentPage" :per-page="itemsPerPage" :total-items="totalEntries" />
            </div>
          </footer>
        </div>
      </main>

      <!-- 5. COMPACT MODALS -->
      <Teleport to="body">
        <!-- FORM MODAL -->
        <Transition name="premium-modal">
          <div v-if="showFormModal" class="modal-overlay" @click.self="showFormModal = false">
            <div class="modal-surface compact-modal">
              <div class="modal-banner compact"></div>
              <button class="close-btn" @click="showFormModal = false"><i class="bi bi-x"></i></button>
              <div class="modal-content compact-padding">
                <div class="modal-header-clean">
                  <div class="icon-circle compact"><i class="bi bi-building-fill"></i></div>
                  <h2>{{ isEditing ? 'Update School' : 'Add School' }}</h2>
                </div>
                <div class="form-body">
                  <div class="input-group-custom">
                    <label>School Name</label>
                    <input v-model="form.name" placeholder="e.g. Harvard University" :class="{ 'has-error': errors.name }" @blur="validate('name')" />
                    <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
                  </div>
                </div>
                <div class="modal-footer-refined">
                  <button class="btn-secondary" @click="showFormModal = false">Cancel</button>
                  <button class="btn-primary" :disabled="schoolStore.isProcessing" @click="saveSchool">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- DETAILS MODAL -->
        <Transition name="premium-modal">
          <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
            <div class="modal-surface compact-modal">
              <div class="modal-banner compact detail"></div>
              <button class="close-btn" @click="showDetailsModal = false"><i class="bi bi-x"></i></button>
              <div class="modal-content compact-padding">
                <div class="modal-header-clean">
                  <div class="icon-circle compact detail"><i class="bi bi-info-circle-fill"></i></div>
                  <h2>Details</h2>
                </div>
                <div class="info-grid-simple">
                  <div class="info-box full"><label>School Name</label><p class="large-text">{{ selectedItem?.name }}</p></div>
                  <div class="info-box"><label>Status</label><p><span class="status-pill" :class="getStatusClass(selectedItem?.status)">{{ selectedItem?.status || 'Active' }}</span></p></div>
                  <div class="info-box"><label>Created At</label><p class="date-visible">{{ formatDate(selectedItem?.created_at) }}</p></div>
                </div>
                <div class="modal-footer-refined">
                  <button class="btn-secondary full-width" @click="showDetailsModal = false">Dismiss</button>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- DELETE MODAL -->
        <Transition name="premium-modal">
          <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
            <div class="modal-surface compact-modal">
              <div class="modal-banner compact danger"></div>
              <button class="close-btn" @click="showDeleteModal = false"><i class="bi bi-x"></i></button>
              <div class="modal-content compact-padding">
                <div class="modal-header-clean">
                  <div class="icon-circle compact danger"><i class="bi bi-exclamation-triangle-fill"></i></div>
                  <h2>Delete?</h2>
                </div>
                <div class="delete-warning">
                  <p>Are you sure you want to remove <strong>"{{ selectedItem?.name }}"</strong>?</p>
                </div>
                <div class="modal-footer-refined">
                  <button class="btn-secondary" @click="showDeleteModal = false">No</button>
                  <button class="btn-danger" :disabled="schoolStore.isProcessing" @click="confirmDelete">Yes, Delete</button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch, onUnmounted } from 'vue'
import { useSchoolStore } from '@/stores/schools'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import BasePagination from '@/components/ui/base/BasePagination.vue'
import { useFormValidation, validationRules } from '@/composables/useFormValidation'
import { useToast } from '@/composables/useToast'

const schoolStore = useSchoolStore()
const toast = useToast()
const searchQuery = ref('')
const showFormModal = ref(false), showDetailsModal = ref(false), showDeleteModal = ref(false)
const isEditing = ref(false), selectedItem = ref(null), currentPage = ref(1), itemsPerPage = ref(10)
const form = reactive({ name: '' })

const { errors, validateField: validate, validate: validateAll, reset: resetValidation } = useFormValidation(form, {
    name: [validationRules.required('School name is required')]
})

onMounted(async () => await schoolStore.fetchSchools())

const totalEntries = computed(() => filteredSchools.value.length)
const showingStart = computed(() => totalEntries.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1)
const showingEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalEntries.value))

const activeCount = computed(() => (schoolStore.schools || []).filter(s => !s.status || s.status === 'Active').length)
const newlyAddedCount = computed(() => (schoolStore.schools || []).filter(s => {
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  return new Date(s.created_at) > weekAgo;
}).length)

const filteredSchools = computed(() => {
    if (!searchQuery.value) return schoolStore.schools || []
    const q = searchQuery.value.toLowerCase()
    return (schoolStore.schools || []).filter(c => c.name.toLowerCase().includes(q))
})

const paginatedSchools = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredSchools.value.slice(start, start + itemsPerPage.value)
})

const openCreateModal = () => { isEditing.value = false; form.name = ''; resetValidation(); showFormModal.value = true }
const handleEdit = (item) => { isEditing.value = true; selectedItem.value = item; form.name = item.name; resetValidation(); showFormModal.value = true }
const handleView = (item) => { selectedItem.value = item; showDetailsModal.value = true }
const handleDelete = (item) => { selectedItem.value = item; showDeleteModal.value = true }

const saveSchool = async () => {
    if (!validateAll()) return
    try {
        isEditing.value ? await schoolStore.editSchool(selectedItem.value.id, { name: form.name }) : await schoolStore.createSchool({ name: form.name })
        showFormModal.value = false; await schoolStore.fetchSchools({ force: true }); toast.success('Saved')
    } catch (err) { toast.error('Failed') }
}

const confirmDelete = async () => {
    try {
        await schoolStore.deleteSchool(selectedItem.value.id)
        showDeleteModal.value = false; await schoolStore.fetchSchools({ force: true }); toast.success('Deleted')
    } catch (e) { toast.error('Delete failed') }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const getStatusClass = (s) => (!s || s === 'Active') ? 'status-active' : 'status-pending'

watch(searchQuery, () => { currentPage.value = 1 })
watch([showFormModal, showDetailsModal, showDeleteModal], (vals) => document.body.style.overflow = vals.some(v => v) ? 'hidden' : '')
onUnmounted(() => document.body.style.overflow = '')
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');

.premium-shell {
  --bg: #09090b; --surface: #121215; --border: #27272a; --accent: #6366f1; --text-main: #fafafa; --text-muted: #a1a1aa;
  background: var(--bg); color: var(--text-main); font-family: 'Plus Jakarta Sans', sans-serif; min-height: 100vh; padding: 2.5rem;
}

/* --- HEADER FIX --- */
.admin-header { margin-bottom: 2.5rem; }
.header-content { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; }
.title-stack h1 { font-size: 2.75rem; font-weight: 800; letter-spacing: -2px; display: flex; align-items: center; gap: 1rem; margin: 0; line-height: 1.1; }
.count-chip { font-size: 0.8rem; background: rgba(99, 102, 241, 0.1); color: var(--accent); padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(99, 102, 241, 0.2); font-weight: 600; white-space: nowrap; }
.subtitle-text { color: var(--text-muted); margin: 0.5rem 0 0 0; font-size: 0.95rem; }

.action-group { display: flex; align-items: center; gap: 1rem; flex-direction: row; }
.search-wrapper { position: relative; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 320px; height: 48px; display: flex; align-items: center; }
.search-wrapper input { width: 100%; background: transparent; border: none; color: white; padding: 0 3.5rem 0 2.8rem; outline: none; height: 100%; font-size: 0.9rem; }
.search-icon { position: absolute; left: 1rem; color: var(--text-muted); }
.search-shortcut { position: absolute; right: 0.8rem; background: #27272a; color: #71717a; padding: 2px 6px; border-radius: 6px; font-size: 0.7rem; border: 1px solid #3f3f3f; font-family: 'JetBrains Mono', monospace; }

.primary-add-btn { background: var(--accent); color: white; border: none; height: 48px; padding: 0 1.75rem; border-radius: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s; white-space: nowrap; }
.primary-add-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(99, 102, 241, 0.4); }

/* --- STATS --- */
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 28px; padding: 1.75rem; display: flex; align-items: center; gap: 1.5rem; }
.stat-icon { width: 56px; height: 56px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0; }
.stat-icon.blue { background: rgba(99, 102, 241, 0.1); color: var(--accent); }
.stat-icon.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
.stat-icon.purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
.stat-data .value { font-size: 1.85rem; font-weight: 800; display: block; }
.stat-data .label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; }

/* --- TABLE WITH ELLIPSIS FIX --- */
.content-wrapper { background: var(--surface); border: 1px solid var(--border); border-radius: 32px; overflow: hidden; }
.table-container { overflow-x: auto; }
.premium-table { width: 100%; border-collapse: collapse; table-layout: fixed; } /* FIXED LAYOUT IS KEY */

.premium-table th, .premium-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); white-space: nowrap; overflow: hidden; }
.premium-table th { background: rgba(255, 255, 255, 0.01); text-align: left; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 2px; }

/* Column Widths */
.col-id { width: 100px; }
.col-name { width: auto; } /* This column grows and shrinks */
.col-status { width: 160px; }
.col-date { width: 180px; }
.col-actions { width: 160px; }

.member-cell { display: flex; align-items: center; gap: 1rem; min-width: 0; } /* min-width: 0 allows children to truncate */
.category-img-wrapper { width: 44px; height: 44px; border-radius: 12px; overflow: hidden; background: #000; flex-shrink: 0; }
.img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--accent); color: white; font-weight: 800; }

.name-text { 
  font-weight: 700; font-size: 1.1rem; color: #fff; 
  flex: 1; /* Take up space */
  overflow: hidden; 
  text-overflow: ellipsis; /* ADDS ... */
  white-space: nowrap; 
}

.status-pill { padding: 6px 12px; border-radius: 10px; font-size: 0.7rem; font-weight: 800; border: 1px solid currentColor; text-transform: uppercase; display: inline-block; }
.status-active { background: rgba(34, 197, 94, 0.1); color: #34d399; }
.date-text { color: #f1f5f9; font-weight: 600; font-size: 1rem; }
.id-tag { color: #71717a; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; }

.action-btns { display: flex; gap: 8px; justify-content: flex-end; }
.action-icon { background: #1c1c21; border: 1px solid var(--border); color: var(--text-muted); width: 36px; height: 36px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.action-icon:hover { color: white; border-color: var(--accent); background: var(--accent); }
.action-icon.delete:hover { border-color: #ef4444; background: #ef4444; }

/* --- MODALS --- */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-surface.compact-modal { max-width: 400px; border-radius: 28px; background: #0c0c0e; border: 1px solid var(--border); width: 100%; position: relative; overflow: hidden; }
.modal-banner.compact { height: 80px; background: linear-gradient(90deg, #6366f1, #a855f7); width: 100%; }
.modal-banner.danger { background: linear-gradient(90deg, #ef4444, #f87171); }
.modal-banner.detail { background: linear-gradient(90deg, #22c55e, #10b981); }
.close-btn { position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; z-index: 10; }
.modal-content.compact-padding { padding: 0 1.5rem 2rem 1.5rem; margin-top: -40px; }
.icon-circle.compact { width: 70px; height: 70px; border-radius: 20px; border: 5px solid #0c0c0e; background: var(--surface); margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: var(--accent); font-size: 1.5rem; }
.icon-circle.danger { color: #ef4444; }
.icon-circle.detail { color: #22c55e; }

.input-group-custom label { display: block; font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; margin-bottom: 8px; }
.input-group-custom input { width: 100%; background: #121216; border: 1px solid var(--border); color: white; padding: 0.8rem; border-radius: 12px; outline: none; }
.btn-primary { background: var(--accent); color: white; border: none; padding: 0.8rem; border-radius: 14px; font-weight: 700; width: 100%; cursor: pointer; }
.btn-danger { background: #ef4444; color: white; border: none; padding: 0.8rem; border-radius: 14px; font-weight: 700; cursor: pointer; }
.btn-secondary { background: #1c1c21; color: white; border: 1px solid var(--border); padding: 0.8rem; border-radius: 14px; font-weight: 700; cursor: pointer; flex: 1; }

.info-grid-simple { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.info-box { background: #121216; border: 1px solid var(--border); padding: 1rem; border-radius: 15px; }
.info-box label { font-size: 0.6rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; margin-bottom: 4px; display: block; }
.large-text { font-size: 1.2rem !important; color: var(--accent); font-weight: 700; }
.modal-footer-refined { display: flex; gap: 1rem; margin-top: 2rem; }
.delete-warning { text-align: center; background: rgba(239, 68, 68, 0.05); padding: 1rem; border-radius: 14px; color: #fca5a5; }

/* PAGINATION */
.premium-pagination-footer { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; background: rgba(0, 0, 0, 0.2); border-top: 1px solid var(--border); }
.mono-num { font-family: 'JetBrains Mono', monospace; color: white; font-weight: 600; }

.shimmer { background: #1c1c21; background-image: linear-gradient(90deg, #1c1c21 0px, #2a2a32 40px, #1c1c21 80px); background-size: 200% 100%; animation: shimmer-anim 1.5s infinite linear; border-radius: 8px; }
@keyframes shimmer-anim { 0% { background-position: -150% 0; } 100% { background-position: 150% 0; } }

.premium-modal-enter-active, .premium-modal-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.premium-modal-enter-from, .premium-modal-leave-to { opacity: 0; transform: scale(0.9) translateY(20px); }

@media (max-width: 992px) {
    .header-content { flex-direction: column; align-items: stretch; gap: 1.5rem; }
    .search-wrapper { width: 100%; }
    .stats-row { grid-template-columns: 1fr; }
}
</style>