<template>
  <DashboardLayout>
    <div class="premium-shell" :class="{ 'is-loading': skillStore.isLoading }">
      
      <!-- 1. HEADER SECTION (Matches Categories) -->
      <header class="admin-header">
        <div class="header-content">
          <div class="title-stack">
            <h1>
              Skills
              <span class="count-chip" v-if="!skillStore.isLoading">
                {{ skillStore.skills?.length || 0 }} Total
              </span>
            </h1>
            <p class="subtitle-text">Define and manage core competencies for the platform</p>
          </div>

          <div class="header-actions">
            <div class="action-group">
              <div class="search-wrapper">
                <i class="bi bi-search search-icon"></i>
                <input v-model="searchQuery" type="text" placeholder="Search skills..." />
                <div class="search-shortcut">⌘K</div>
              </div>
              <button class="primary-add-btn" @click="openCreateModal">
                <i class="bi bi-plus-lg"></i>
                <span>Add Skill</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 2. BENTO STATS SECTION (Matches Categories) -->
      <section class="stats-row">
        <template v-if="skillStore.isLoading">
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
            <div class="stat-icon blue"><i class="bi bi-layers-fill"></i></div>
            <div class="stat-data">
              <span class="label">Total Items</span>
              <span class="value">{{ skillStore.skills?.length || 0 }}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon green"><i class="bi bi-patch-check-fill"></i></div>
            <div class="stat-data">
              <span class="label">Active Skills</span>
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

      <!-- 3. MAIN TABLE SECTION (Matches Categories) -->
      <main class="content-wrapper">
        <div class="table-container">
          <table class="premium-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Skill Name</th>
                <th>Current Status</th>
                <th>Created Date</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="skillStore.isLoading">
                <tr v-for="i in 6" :key="'table-s-' + i">
                  <td><div class="shimmer line-id-ghost"></div></td>
                  <td>
                    <div class="member-col-ghost">
                      <div class="shimmer mini-avatar"></div>
                      <div class="shimmer line-md"></div>
                    </div>
                  </td>
                  <td><div class="shimmer badge-ghost"></div></td>
                  <td><div class="shimmer line-lg"></div></td>
                  <td class="text-end"><div class="shimmer circle-ghost"></div></td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="skill in paginatedSkills" :key="skill.id" class="hover-row">
                  <td><span class="id-tag">#{{ skill.id }}</span></td>
                  <td>
                    <div class="member-cell">
                      <div class="category-img-wrapper">
                        <div class="img-placeholder">{{ skill.name.charAt(0) }}</div>
                      </div>
                      <span class="name-text">{{ skill.name }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="status-pill" :class="getStatusClass(skill.status)">
                      {{ skill.status || 'Active' }}
                    </span>
                  </td>
                  <td><span class="date-text">{{ formatDate(skill.created_at) }}</span></td>
                  <td class="text-end">
                    <div class="action-btns">
                      <button class="action-icon" @click="handleView(skill)" title="View Details"><i class="bi bi-eye"></i></button>
                      <button class="action-icon" @click="handleEdit(skill)" title="Edit"><i class="bi bi-pencil"></i></button>
                      <button class="action-icon delete" @click="handleDelete(skill)" title="Delete"><i class="bi bi-trash"></i></button>
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
              <div class="custom-pagination-wrapper">
                <BasePagination 
                  v-model:page="currentPage" 
                  :per-page="itemsPerPage" 
                  :total-items="totalEntries" 
                />
              </div>
            </div>
          </footer>
        </div>
      </main>

      <!-- 4. COMPACT MODALS -->
      <Teleport to="body">
        <!-- FORM MODAL -->
        <Transition name="premium-modal">
          <div v-if="showFormModal" class="modal-overlay" @click.self="showFormModal = false">
            <div class="modal-surface compact-modal">
              <div class="modal-banner compact"></div>
              <button class="close-btn" @click="showFormModal = false"><i class="bi bi-x"></i></button>
              
              <div class="modal-content compact-padding">
                <div class="modal-header-clean">
                  <div class="icon-circle compact">
                     <i class="bi bi-lightning-charge-fill"></i>
                  </div>
                  <h2>{{ isEditing ? 'Update Skill' : 'Add Skill' }}</h2>
                </div>

                <div class="form-body">
                  <div class="input-group-custom">
                    <label>Skill Name</label>
                    <input v-model="form.name" placeholder="e.g. JavaScript / UI Design" :class="{ 'has-error': errors.name }" @blur="validate('name')" />
                    <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
                  </div>
                </div>

                <div class="modal-footer-refined">
                  <button class="btn-secondary" @click="showFormModal = false">Cancel</button>
                  <button class="btn-primary" :disabled="skillStore.isProcessing" @click="saveSkill">
                    <span v-if="skillStore.isProcessing" class="spinner-border spinner-border-sm me-2"></span>
                    Save Changes
                  </button>
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
                  <div class="icon-circle compact detail">
                    <i class="bi bi-tag-fill"></i>
                  </div>
                  <h2>Skill Details</h2>
                </div>

                <div class="info-grid-simple">
                  <div class="info-box full"><label>Competency Name</label><p class="large-text">{{ selectedItem?.name }}</p></div>
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
                  <button class="btn-danger" :disabled="skillStore.isProcessing" @click="confirmDelete">Yes, Delete</button>
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
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { ref, computed, onMounted, reactive, watch, onUnmounted } from 'vue'
import { useSkillStore } from '@/stores/skills'
import BasePagination from '@/components/ui/base/BasePagination.vue'
import { useFormValidation, validationRules } from '@/composables/useFormValidation'
import { useToast } from '@/composables/useToast'

// --- STATE ---
const skillStore = useSkillStore()
const toast = useToast()
const searchQuery = ref('')
const showFormModal = ref(false), showDetailsModal = ref(false), showDeleteModal = ref(false)
const isEditing = ref(false), selectedItem = ref(null), currentPage = ref(1), itemsPerPage = ref(10)

const form = reactive({ name: '' })

const { errors, validateField: validate, validate: validateAll, reset: resetValidation } = useFormValidation(form, {
    name: [validationRules.required('Skill name is required'), validationRules.maxLength(255)]
})

// --- COMPUTEDS ---
const totalEntries = computed(() => filteredSkills.value.length)
const showingStart = computed(() => totalEntries.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1)
const showingEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalEntries.value))

const activeCount = computed(() => (skillStore.skills || []).filter(s => !s.status || s.status === 'Active').length)
const newlyAddedCount = computed(() => {
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return (skillStore.skills || []).filter(s => new Date(s.created_at || Date.now()) > sevenDaysAgo).length
})

const filteredSkills = computed(() => {
    if (!searchQuery.value) return skillStore.skills || []
    const q = searchQuery.value.toLowerCase()
    return (skillStore.skills || []).filter(s => s.name.toLowerCase().includes(q))
})

const paginatedSkills = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredSkills.value.slice(start, start + itemsPerPage.value)
})

// --- METHODS ---
onMounted(async () => {
    await skillStore.fetchSkills()
})

const openCreateModal = () => { isEditing.value = false; form.name = ''; resetValidation(); showFormModal.value = true }
const handleEdit = (item) => { isEditing.value = true; selectedItem.value = item; form.name = item.name; resetValidation(); showFormModal.value = true }
const handleView = (item) => { selectedItem.value = item; showDetailsModal.value = true }
const handleDelete = (item) => { selectedItem.value = item; showDeleteModal.value = true }

const saveSkill = async () => {
    if (!validateAll()) return
    try {
        isEditing.value ? await skillStore.editSkill(selectedItem.value.id, { name: form.name }) : await skillStore.createSkill({ name: form.name })
        showFormModal.value = false; await skillStore.fetchSkills({ force: true }); toast.success('Saved Successfully')
    } catch (err) { toast.error('Save Failed') }
}

const confirmDelete = async () => {
    try {
        await skillStore.deleteSkill(selectedItem.value.id)
        showDeleteModal.value = false; await skillStore.fetchSkills({ force: true }); toast.success('Deleted Successfully')
    } catch (e) { toast.error('Delete Failed') }
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
  padding: 2.5rem;
}

/* --- HEADER SECTION --- */
.admin-header { margin-bottom: 2.5rem; }
.header-content { display: flex; justify-content: space-between; align-items: flex-end; gap: 1rem; }
.title-stack h1 { font-size: 2.75rem; font-weight: 800; letter-spacing: -2px; display: flex; align-items: center; gap: 1rem; margin: 0; }
.count-chip { font-size: 0.8rem; background: rgba(99, 102, 241, 0.1); color: var(--accent); padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(99, 102, 241, 0.2); font-weight: 600; }
.subtitle-text { color: var(--text-muted); margin: 0.5rem 0 0 0; font-size: 0.95rem; }
.action-group { display: flex; align-items: center; gap: 1rem; }
.search-wrapper { position: relative; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; width: 320px; display: flex; align-items: center; transition: 0.3s; }
.search-icon { position: absolute; left: 1rem; color: var(--text-muted); }
.search-wrapper input { width: 100%; background: transparent; border: none; color: white; padding: 0.85rem 3.5rem 0.85rem 2.8rem; outline: none; font-size: 0.9rem; }
.search-shortcut { position: absolute; right: 0.8rem; background: #27272a; color: #71717a; padding: 2px 6px; border-radius: 6px; font-size: 0.7rem; border: 1px solid #3f3f46; font-family: 'JetBrains Mono', monospace; }
.primary-add-btn { background: var(--accent); color: white; border: none; padding: 0.85rem 1.75rem; border-radius: 16px; font-weight: 700; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s; }
.primary-add-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 24px rgba(99, 102, 241, 0.4); }

/* --- BENTO STATS --- */
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 28px; padding: 1.75rem; display: flex; align-items: center; gap: 1.5rem; }
.stat-icon { width: 56px; height: 56px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.stat-icon.blue { background: rgba(99, 102, 241, 0.1); color: var(--accent); }
.stat-icon.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
.stat-icon.purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
.stat-data .value { font-size: 1.85rem; font-weight: 800; display: block; }
.stat-data .label { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

/* --- MAIN TABLE --- */
.content-wrapper { background: var(--surface); border: 1px solid var(--border); border-radius: 32px; overflow: hidden; }
.premium-table { width: 100%; border-collapse: collapse; }
.premium-table th { background: rgba(255, 255, 255, 0.01); text-align: left; padding: 1.25rem 1.5rem; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border); font-weight: 700; letter-spacing: 2px; }
.premium-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); }
.member-cell { display: flex; align-items: center; gap: 1rem; }
.category-img-wrapper { width: 44px; height: 44px; border-radius: 12px; overflow: hidden; background: #000; border: 1px solid var(--border); }
.img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--accent); color: white; font-weight: 800; }
.name-text { font-weight: 700; color: white; font-size: 1rem; }
.status-pill { padding: 6px 12px; border-radius: 10px; font-size: 0.7rem; font-weight: 800; border: 1px solid currentColor; text-transform: uppercase; }
.status-active { background: rgba(34, 197, 94, 0.1); color: #34d399; }
.status-pending { background: rgba(234, 179, 8, 0.1); color: #fbbf24; }
.date-text { color: #f1f5f9; font-weight: 600; }
.id-tag { font-family: 'JetBrains Mono', monospace; color: #71717a; font-size: 0.85rem; }
.action-btns { display: flex; gap: 8px; justify-content: flex-end; }
.action-icon { background: #1c1c21; border: 1px solid var(--border); color: var(--text-muted); width: 36px; height: 36px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.action-icon:hover { color: white; border-color: var(--accent); background: var(--accent); }
.action-icon.delete:hover { border-color: #ef4444; background: #ef4444; }

/* --- FOOTER & PAGINATION --- */
.premium-pagination-footer { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2rem; background: rgba(0, 0, 0, 0.2); border-top: 1px solid var(--border); }
.entries-text { font-size: 0.85rem; color: var(--text-muted); margin: 0; }
.mono-num { font-family: 'JetBrains Mono', monospace; color: white; font-weight: 600; }
.mono-num.total { background: rgba(99, 102, 241, 0.1); color: var(--accent); padding: 2px 8px; border-radius: 6px; margin-left: 4px; }

/* --- COMPACT MODALS --- */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-surface.compact-modal { max-width: 400px; border-radius: 28px; background: #0c0c0e; border: 1px solid var(--border); width: 100%; position: relative; overflow: hidden; box-shadow: 0 40px 100px rgba(0,0,0,0.8); }
.modal-banner.compact { height: 80px; background: linear-gradient(90deg, #6366f1, #a855f7); width: 100%; }
.modal-banner.danger { background: linear-gradient(90deg, #ef4444, #f87171); }
.modal-banner.detail { background: linear-gradient(90deg, #22c55e, #10b981); }
.close-btn { position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.2); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; z-index: 10; }
.modal-content.compact-padding { padding: 0 1.5rem 2rem 1.5rem; margin-top: -40px; }
.modal-header-clean { text-align: center; margin-bottom: 1.5rem; }
.icon-circle.compact { width: 70px; height: 70px; border-radius: 20px; border: 5px solid #0c0c0e; background: var(--surface); margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: var(--accent); font-size: 1.5rem; overflow: hidden; }
.icon-circle.danger { color: #ef4444; }
.icon-circle.detail { color: #22c55e; }

.input-group-custom label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-weight: 800; margin-bottom: 8px; }
.input-group-custom input { width: 100%; background: #121216; border: 1px solid var(--border); color: white; padding: 0.8rem; border-radius: 12px; outline: none; }
.input-group-custom input:focus { border-color: var(--accent); }
.error-msg { color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: block; }

.info-grid-simple { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.info-box { background: #121216; border: 1px solid var(--border); padding: 1rem; border-radius: 15px; }
.info-box label { font-size: 0.6rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; margin-bottom: 4px; display: block; }
.info-box p { font-weight: 700; margin: 0; font-size: 1rem; }
.info-box.full { grid-column: span 2; }
.large-text { font-size: 1.2rem !important; color: var(--accent); }
.date-visible { color: #f1f5f9; font-weight: 600; }

.modal-footer-refined { display: flex; gap: 1rem; margin-top: 2rem; }
.btn-primary, .btn-danger, .btn-secondary { flex: 1; padding: 0.8rem; border-radius: 14px; font-weight: 700; cursor: pointer; border: none; }
.btn-primary { background: var(--accent); color: white; }
.btn-danger { background: #ef4444; color: white; }
.btn-secondary { background: #1c1c21; color: white; border: 1px solid var(--border); }
.full-width { width: 100%; }
.delete-warning { text-align: center; background: rgba(239, 68, 68, 0.05); padding: 1rem; border-radius: 14px; color: #fca5a5; }

/* --- SHIMMERS & ANIMATIONS --- */
.shimmer { background: #1c1c21; background-image: linear-gradient(90deg, #1c1c21 0px, #2a2a32 40px, #1c1c21 80px); background-size: 200% 100%; animation: shimmer-anim 1.5s infinite linear; border-radius: 8px; }
@keyframes shimmer-anim { 0% { background-position: -150% 0; } 100% { background-position: 150% 0; } }

.premium-modal-enter-active, .premium-modal-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.premium-modal-enter-from, .premium-modal-leave-to { opacity: 0; transform: scale(0.9) translateY(20px); }

@media (max-width: 992px) {
    .header-content { flex-direction: column; align-items: stretch; }
    .stats-row { grid-template-columns: 1fr; }
}
</style>