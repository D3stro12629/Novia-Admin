<template>
  <DashboardLayout>
    <div class="premium-shell" :class="{ 'is-loading': degreeStore.isLoading }">

      <!-- 1. HEADER SECTION -->
      <header class="admin-header">
        <div class="header-content">
          <div class="title-stack">
            <h1>
              Degrees
              <span class="count-chip" v-if="!degreeStore.isLoading">
                {{ degreeStore.degrees?.length || 0 }} Total
              </span>
            </h1>
            <p class="subtitle-text">Manage and standardize academic qualifications</p>
          </div>

          <div class="header-actions">
            <div class="action-group">
              <div class="search-wrapper">
                <i class="bi bi-search search-icon"></i>
                <input v-model="searchQuery" type="text" placeholder="Search degrees..." />
                <div class="search-shortcut">⌘K</div>
              </div>
              <button class="primary-add-btn" @click="openCreateModal">
                <i class="bi bi-plus-lg"></i>
                <span>Add Degree</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 2. BENTO STATS SECTION (SKELETON INTEGRATED) -->
      <section class="stats-row">
        <template v-if="degreeStore.isLoading">
          <div v-for="i in 3" :key="'stat-s-' + i" class="stat-card">
            <BaseSkeleton width="56px" height="56px" radius="18px" />
            <div class="stat-data">
              <BaseSkeleton width="70px" height="12px" radius="4px" style="margin-bottom: 8px; display: block;" />
              <BaseSkeleton width="40px" height="24px" radius="6px" />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="stat-card">
            <div class="stat-icon blue"><i class="bi bi-mortarboard-fill"></i></div>
            <div class="stat-data">
              <span class="label">Total Items</span>
              <span class="value">{{ degreeStore.degrees?.length || 0 }}</span>
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

      <!-- 3. MAIN TABLE SECTION (SKELETON INTEGRATED) -->
      <main class="content-wrapper">
        <div class="table-container">
          <table class="premium-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Degree Designation</th>
                <th>Current Status</th>
                <th>Created Date</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="degreeStore.isLoading">
                <tr v-for="i in 6" :key="'table-s-' + i">
                  <td>
                    <BaseSkeleton width="40px" height="16px" />
                  </td>
                  <td>
                    <div class="member-cell">
                      <BaseSkeleton width="44px" height="44px" radius="12px" />
                      <BaseSkeleton width="200px" height="16px" radius="4px" />
                    </div>
                  </td>
                  <td>
                    <BaseSkeleton width="80px" height="24px" radius="10px" />
                  </td>
                  <td>
                    <BaseSkeleton width="110px" height="16px" radius="4px" />
                  </td>
                  <td class="text-end">
                    <div class="action-btns">
                      <BaseSkeleton width="36px" height="36px" radius="10px" v-for="b in 3" :key="b" />
                    </div>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="item in paginatedDegrees" :key="item.id" class="hover-row">
                  <td><span class="id-tag">#{{ item.id }}</span></td>
                  <td>
                    <div class="member-cell">
                      <div class="category-img-wrapper">
                        <div class="img-placeholder">{{ item.name.charAt(0) }}</div>
                      </div>
                      <span class="name-text">{{ item.name }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="status-pill" :class="getStatusClass(item.status)">
                      {{ item.status || 'Active' }}
                    </span>
                  </td>
                  <td><span class="date-text">{{ formatDate(item.created_at) }}</span></td>
                  <td class="text-end">
                    <div class="action-btns">
                      <button class="action-icon" @click="handleView(item)" title="View Details"><i
                          class="bi bi-eye"></i></button>
                      <button class="action-icon" @click="handleEdit(item)" title="Edit"><i
                          class="bi bi-pencil"></i></button>
                      <button class="action-icon delete" @click="handleDelete(item)" title="Delete"><i
                          class="bi bi-trash"></i></button>
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
                  <div class="icon-circle compact"><i class="bi bi-mortarboard-fill"></i></div>
                  <h2>{{ isEditing ? 'Update Degree' : 'Add Degree' }}</h2>
                </div>
                <div class="form-body">
                  <div class="input-group-custom">
                    <label>Degree Name / Designation</label>
                    <input v-model="form.name" placeholder="e.g. Bachelor of Computer Science"
                      :class="{ 'has-error': errors.name }" @blur="validate('name')" />
                    <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
                  </div>
                </div>
                <div class="modal-footer-refined">
                  <button class="btn-secondary" @click="showFormModal = false">Cancel</button>
                  <button class="btn-primary" :disabled="degreeStore.isProcessing" @click="saveDegree">
                    <span v-if="degreeStore.isProcessing" class="spinner-border spinner-border-sm me-2"></span>
                    Save Changes
                  </button>
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
                  <button class="btn-danger" :disabled="degreeStore.isProcessing" @click="confirmDelete">Yes,
                    Delete</button>
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
                  <h2>Degree Details</h2>
                </div>
                <div class="info-grid-simple">
                  <div class="info-box full"><label>Designation Name</label>
                    <p class="large-text">{{ selectedItem?.name }}</p>
                  </div>
                  <div class="info-box"><label>Status</label>
                    <p><span class="status-pill status-active">{{ selectedItem?.status || 'Active' }}</span></p>
                  </div>
                  <div class="info-box"><label>Created At</label>
                    <p class="date-visible">{{ formatDate(selectedItem?.created_at) }}</p>
                  </div>
                </div>
                <div class="modal-footer-refined">
                  <button class="btn-secondary full-width" @click="showDetailsModal = false">Dismiss</button>
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
import BaseSkeleton from '@/components/ui/base/BaseSkeleton.vue'
import BasePagination from '@/components/ui/base/BasePagination.vue'
import { ref, computed, onMounted, reactive, watch, onUnmounted } from 'vue'
import { useRoute } from 'vue-router' // Added
import { useDegreeStore } from '@/stores/degrees'
import { useFormValidation, validationRules } from '@/composables/useFormValidation'
import { useToast } from '@/composables/useToast'

const degreeStore = useDegreeStore()
const route = useRoute() // Added
const toast = useToast()

const searchQuery = ref('')
const showFormModal = ref(false), showDetailsModal = ref(false), showDeleteModal = ref(false)
const isEditing = ref(false), selectedItem = ref(null), currentPage = ref(1), itemsPerPage = ref(10)
const form = reactive({ name: '' })

const { errors, validateField: validate, validate: validateAll, reset: resetValidation } = useFormValidation(form, {
  name: [validationRules.required('Degree name is required'), validationRules.maxLength(255)]
})

// Computeds
const totalEntries = computed(() => filteredDegrees.value.length)
const showingStart = computed(() => totalEntries.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1)
const showingEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalEntries.value))
const activeCount = computed(() => (degreeStore.degrees || []).length)
const newlyAddedCount = computed(() => {
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
  return (degreeStore.degrees || []).filter(d => new Date(d.created_at) > weekAgo).length
})
const filteredDegrees = computed(() => {
  if (!searchQuery.value) return degreeStore.degrees || []
  return (degreeStore.degrees || []).filter(d => d.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})
const paginatedDegrees = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredDegrees.value.slice(start, start + itemsPerPage.value)
})

// MODIFIED LIFECYCLE
onMounted(async () => {
  await degreeStore.fetchDegrees()
  // Open modal if coming from Dashboard
  if (route.query.action === 'create') {
    openCreateModal()
  }
})

// Methods
const openCreateModal = () => { isEditing.value = false; form.name = ''; resetValidation(); showFormModal.value = true }
const handleEdit = (item) => { isEditing.value = true; selectedItem.value = item; form.name = item.name; resetValidation(); showFormModal.value = true }
const handleView = (item) => { selectedItem.value = item; showDetailsModal.value = true }
const handleDelete = (item) => { selectedItem.value = item; showDeleteModal.value = true }

const saveDegree = async () => {
  if (!validateAll()) return
  try {
    isEditing.value ? await degreeStore.editDegree(selectedItem.value.id, { name: form.name }) : await degreeStore.createDegree({ name: form.name })
    showFormModal.value = false; await degreeStore.fetchDegrees({ force: true }); toast.success('Saved Successfully')
  } catch { toast.error('Save Failed') }
}

const confirmDelete = async () => {
  try {
    await degreeStore.deleteDegree(selectedItem.value.id)
    showDeleteModal.value = false; await degreeStore.fetchDegrees({ force: true }); toast.success('Deleted Successfully')
  } catch { toast.error('Delete Failed') }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const getStatusClass = (s) => (!s || s === 'Active') ? 'status-active' : 'status-pending'

// WATCHERS
watch(searchQuery, () => currentPage.value = 1)
watch(() => route.query.action, (newAction) => {
  if (newAction === 'create') openCreateModal()
})
watch([showFormModal, showDetailsModal, showDeleteModal], (v) => document.body.style.overflow = v.some(x => x) ? 'hidden' : '')
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
  padding: 2rem;
}

/* Header */
.admin-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.title-stack h1 {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -1.5px;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0;
}

.count-chip {
  font-size: 0.8rem;
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.subtitle-text {
  color: var(--text-muted);
  margin: 0.5rem 0 0 0;
}

/* Actions */
.action-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-wrapper {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-wrapper input {
  width: 100%;
  background: transparent;
  border: none;
  color: white;
  padding: 0.75rem 1rem 0.75rem 2.8rem;
  outline: none;
}

.search-shortcut {
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  background: #27272a;
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 4px;
  color: #71717a;
}

.primary-add-btn {
  background: var(--accent);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
}

.primary-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

.stat-icon.blue {
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent);
}

.stat-icon.green {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.stat-icon.purple {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.stat-data .label {
  display: block;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.stat-data .value {
  font-size: 1.75rem;
  font-weight: 800;
}

/* Table */
.content-wrapper {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 24px;
  overflow: hidden;
}

.premium-table {
  width: 100%;
  border-collapse: collapse;
}

.premium-table th {
  text-align: left;
  padding: 1rem 1.5rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
  letter-spacing: 1.5px;
  font-weight: 700;
}

.premium-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}

.member-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-img-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  border: 1px solid var(--border);
  flex-shrink: 0;
}

.img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  color: white;
  font-weight: 800;
  font-size: 1.2rem;
}

.status-pill {
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  border: 1px solid currentColor;
}

.status-active {
  background: rgba(52, 211, 153, 0.1);
  color: #34d399;
}

.name-text {
  font-weight: 700;
  color: white;
  font-size: 1rem;
}

.date-text {
  color: #f1f5f9;
  font-weight: 600;
}

.id-tag {
  font-family: 'JetBrains Mono', monospace;
  color: #71717a;
  font-size: 0.85rem;
}

.action-btns {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-icon {
  background: #1c1c21;
  border: 1px solid var(--border);
  color: var(--text-muted);
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.action-icon:hover {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.action-icon.delete:hover {
  background: #ef4444;
  border-color: #ef4444;
}

/* Footer */
.premium-pagination-footer {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
}

.entries-text {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0;
}

.mono-num {
  color: white;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
}

.mono-num.total {
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent);
  padding: 2px 8px;
  border-radius: 6px;
  margin-left: 4px;
}

/* Modals */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-surface.compact-modal {
  max-width: 400px;
  width: 90%;
  background: #0c0c0e;
  border: 1px solid var(--border);
  border-radius: 28px;
  overflow: hidden;
  position: relative;
}

.modal-banner.compact {
  height: 80px;
  background: linear-gradient(90deg, #6366f1, #a855f7);
}

.modal-banner.danger {
  background: linear-gradient(90deg, #ef4444, #f87171);
}

.modal-banner.detail {
  background: linear-gradient(90deg, #22c55e, #10b981);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
}

.modal-content.compact-padding {
  padding: 0 1.5rem 2rem 1.5rem;
  margin-top: -40px;
}

.icon-circle.compact {
  width: 70px;
  height: 70px;
  border-radius: 20px;
  border: 5px solid #0c0c0e;
  background: var(--surface);
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  font-size: 1.5rem;
}

.icon-circle.danger {
  color: #ef4444;
}

.icon-circle.detail {
  color: #22c55e;
}

.modal-header-clean h2 {
  text-align: center;
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  font-weight: 800;
}

.input-group-custom label {
  display: block;
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.input-group-custom input {
  width: 100%;
  background: #121216;
  border: 1px solid var(--border);
  color: white;
  padding: 0.8rem;
  border-radius: 12px;
  outline: none;
}

.input-group-custom input:focus {
  border-color: var(--accent);
}

.modal-footer-refined {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  flex: 1;
  padding: 0.8rem;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.btn-primary {
  background: var(--accent);
  color: white;
}

.btn-secondary {
  background: #1c1c21;
  border: 1px solid var(--border);
  color: white;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.full-width {
  width: 100%;
}

.info-grid-simple {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-box {
  background: #121216;
  border: 1px solid var(--border);
  padding: 1rem;
  border-radius: 14px;
}

.info-box label {
  font-size: 0.6rem;
  color: var(--text-muted);
  text-transform: uppercase;
  display: block;
  margin-bottom: 4px;
  font-weight: 800;
}

.info-box p {
  margin: 0;
  font-weight: 700;
}

.large-text {
  color: var(--accent);
  font-size: 1.1rem !important;
}

.delete-warning {
  text-align: center;
  background: rgba(239, 68, 68, 0.05);
  padding: 1rem;
  border-radius: 12px;
  color: #fca5a5;
  margin-bottom: 1rem;
}

/* Transitions */
.premium-modal-enter-active,
.premium-modal-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.premium-modal-enter-from,
.premium-modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

@media (max-width: 992px) {
  .stats-row {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .search-wrapper {
    width: 100%;
  }
}
</style>