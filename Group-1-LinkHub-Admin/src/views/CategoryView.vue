<template>
  <DashboardLayout>
    <div class="premium-shell" :class="{ 'is-loading': categoryStore.isLoading }">
      
      <!-- 1. HEADER SECTION -->
      <header class="admin-header">
        <div class="header-content">
          <div class="title-stack">
            <h1>
              Categories
              <span class="count-chip" v-if="!categoryStore.isLoading">
                {{ categoryStore.categories?.length || 0 }} Total
              </span>
            </h1>
            <p class="subtitle-text">Organize and manage your product classifications</p>
          </div>

          <div class="header-actions">
            <div class="action-group">
              <div class="search-wrapper">
                <i class="bi bi-search search-icon"></i>
                <input v-model="searchQuery" type="text" placeholder="Search categories..." />
                <div class="search-shortcut">⌘K</div>
              </div>
              <button class="primary-add-btn" @click="openCreateModal">
                <i class="bi bi-plus-lg"></i>
                <span>Add Category</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 2. BENTO STATS SECTION -->
      <section class="stats-row">
        <template v-if="categoryStore.isLoading">
          <div v-for="i in 3" :key="'stat-s-' + i" class="stat-card">
            <BaseSkeleton width="56px" height="56px" radius="18px" />
            <div class="stat-data">
              <BaseSkeleton width="60px" height="12px" radius="4px" style="margin-bottom: 8px; display: block;" />
              <BaseSkeleton width="40px" height="24px" radius="6px" />
            </div>
          </div>
        </template>
        <template v-else>
          <div class="stat-card">
            <div class="stat-icon blue"><i class="bi bi-layers-fill"></i></div>
            <div class="stat-data">
              <span class="label">Total Items</span>
              <span class="value">{{ categoryStore.categories?.length || 0 }}</span>
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
                <th>ID</th>
                <th>Category Name</th>
                <th>Current Status</th>
                <th>Created Date</th>
                <th class="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="categoryStore.isLoading">
                <tr v-for="i in 6" :key="'table-s-' + i">
                  <td><BaseSkeleton width="40px" height="16px" /></td>
                  <td>
                    <div class="member-cell">
                      <BaseSkeleton width="44px" height="44px" radius="12px" />
                      <BaseSkeleton width="150px" height="16px" />
                    </div>
                  </td>
                  <td><BaseSkeleton width="80px" height="24px" radius="10px" /></td>
                  <td><BaseSkeleton width="100px" height="16px" /></td>
                  <td class="text-end">
                    <div class="action-btns">
                      <BaseSkeleton v-for="b in 3" :key="b" width="36px" height="36px" radius="10px" />
                    </div>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="item in paginatedCategories" :key="item.id" class="hover-row">
                  <td><span class="id-tag">#{{ item.id }}</span></td>
                  <td>
                    <div class="member-cell">
                      <div class="category-img-wrapper">
                        <img v-if="item.image" :src="item.image" @error="handleImageError" />
                        <div v-else class="img-placeholder">{{ item.name.charAt(0) }}</div>
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
                      <button class="action-icon" @click="handleView(item)" title="View Details"><i class="bi bi-eye"></i></button>
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

      <!-- 4. MODALS (FORM, DETAILS, DELETE) -->
      <Teleport to="body">
        <!-- FORM MODAL -->
        <Transition name="premium-modal">
          <div v-if="showFormModal" class="modal-overlay" @click.self="showFormModal = false">
            <div class="modal-surface compact-modal">
              <div class="modal-banner compact"></div>
              <button class="close-btn" @click="showFormModal = false"><i class="bi bi-x"></i></button>
              <div class="modal-content compact-padding">
                <div class="modal-header-clean">
                  <div class="icon-circle compact" @click="triggerFileInput">
                     <img v-if="imagePreview" :src="imagePreview" class="circle-img-preview" />
                     <i v-else class="bi bi-cloud-arrow-up-fill"></i>
                  </div>
                  <h2>{{ isEditing ? 'Update Category' : 'Add Category' }}</h2>
                </div>
                <div class="form-body">
                  <div class="input-group-custom">
                    <label>Category Name</label>
                    <input v-model="form.name" placeholder="e.g. Science Department" :class="{ 'has-error': errors.name }" @blur="validate('name')" />
                    <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
                  </div>
                  <div class="image-upload-zone" @click="triggerFileInput">
                    <i class="bi bi-image me-2"></i>
                    <span>{{ form.image ? 'Change Image' : 'Upload Image' }}</span>
                  </div>
                  <input ref="fileInput" type="file" accept="image/*" @change="handleImageUpload" style="display: none" />
                </div>
                <div class="modal-footer-refined">
                  <button class="btn-secondary" @click="showFormModal = false">Cancel</button>
                  <button class="btn-primary" :disabled="categoryStore.isProcessing" @click="saveCategory">
                    <span v-if="categoryStore.isProcessing" class="spinner-border spinner-border-sm me-2"></span>
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
                  <button class="btn-danger" :disabled="categoryStore.isProcessing" @click="confirmDelete">Yes, Delete</button>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <Transition name="premium-modal">
          <div v-if="showDetailsModal" class="modal-overlay" @click.self="showDetailsModal = false">
            <div class="modal-surface compact-modal">
              <div class="modal-banner compact detail"></div>
              <button class="close-btn" @click="showDetailsModal = false"><i class="bi bi-x"></i></button>
              <div class="modal-content compact-padding">
                <div class="modal-header-clean">
                  <div class="icon-circle compact detail">
                    <img v-if="selectedItem?.image" :src="selectedItem.image" class="circle-img-preview" />
                    <i v-else class="bi bi-info-circle-fill"></i>
                  </div>
                  <h2>Details</h2>
                </div>
                <div class="info-grid-simple">
                  <div class="info-box full"><label>Full Name</label><p class="large-text">{{ selectedItem?.name }}</p></div>
                  <div class="info-box"><label>Status</label><p><span class="status-pill status-active">{{ selectedItem?.status || 'Active' }}</span></p></div>
                  <div class="info-box"><label>Created At</label><p class="date-visible">{{ formatDate(selectedItem?.created_at) }}</p></div>
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
import { useRoute } from 'vue-router'
import { useCategoryStore } from '@/stores/categories'
import { useFormValidation, validationRules } from '@/composables/useFormValidation'
import { useToast } from '@/composables/useToast'

const categoryStore = useCategoryStore()
const route = useRoute()
const toast = useToast()

// STATE
const searchQuery = ref('')
const showFormModal = ref(false), showDetailsModal = ref(false), showDeleteModal = ref(false)
const isEditing = ref(false), selectedItem = ref(null), currentPage = ref(1), itemsPerPage = ref(10)
const form = reactive({ name: '', image: null })
const imagePreview = ref(null)
const fileInput = ref(null)

const { errors, validateField: validate, validate: validateAll, reset: resetValidation } = useFormValidation(form, {
    name: [validationRules.required('Category name is required'), validationRules.maxLength(255)]
})

// COMPUTEDS
const totalEntries = computed(() => filteredCategories.value.length)
const showingStart = computed(() => totalEntries.value === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1)
const showingEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, totalEntries.value))
const activeCount = computed(() => (categoryStore.categories || []).length)
const newlyAddedCount = computed(() => {
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
    return (categoryStore.categories || []).filter(c => new Date(c.created_at) > weekAgo).length
})
const filteredCategories = computed(() => {
    if (!searchQuery.value) return categoryStore.categories || []
    return (categoryStore.categories || []).filter(c => c.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})
const paginatedCategories = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredCategories.value.slice(start, start + itemsPerPage.value)
})

// METHODS
onMounted(async () => {
    await categoryStore.fetchCategories()
    if (route.query.action === 'create') openCreateModal()
})

const openCreateModal = () => { 
    isEditing.value = false; 
    form.name = ''; 
    form.image = null; // Reset image data
    imagePreview.value = null; 
    resetValidation(); 
    showFormModal.value = true 
}

const handleEdit = (item) => { 
    isEditing.value = true; 
    selectedItem.value = item; 
    form.name = item.name; 
    form.image = null; // Keep null unless user chooses a new file
    imagePreview.value = item.image; 
    resetValidation();
    showFormModal.value = true 
}

const handleView = (item) => { selectedItem.value = item; showDetailsModal.value = true }
const handleDelete = (item) => { selectedItem.value = item; showDeleteModal.value = true }
const triggerFileInput = () => fileInput.value?.click()

const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
        form.image = file
        const reader = new FileReader(); 
        reader.onload = (ev) => imagePreview.value = ev.target?.result; 
        reader.readAsDataURL(file)
    }
}

// FIXED: Use FormData for real file uploads
const saveCategory = async () => {
    if (!validateAll()) return

    const payload = {
        name: form.name,
        image: form.image 
    }

    try {
        if (isEditing.value) {
            await categoryStore.editCategory(selectedItem.value.id, payload)
            toast.success('Category updated successfully')
        } else {
            if (!form.image) {
                toast.error('Please select an image')
                return
            }
            await categoryStore.createCategory(payload)
            toast.success('Category created successfully')
        }
        
        showFormModal.value = false
        await categoryStore.fetchCategories({ force: true })
    } catch (err) {
        const errorMsg = err.response?.data?.message || 'Something went wrong'
        toast.error('Error: ' + errorMsg)
        console.error("API Error:", err)
    }
}

const confirmDelete = async () => {
    try {
        await categoryStore.deleteCategory(selectedItem.value.id)
        showDeleteModal.value = false; 
        await categoryStore.fetchCategories({ force: true }); 
        toast.success('Deleted')
    } catch { toast.error('Error') }
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'
const getStatusClass = (s) => (!s || s === 'Active') ? 'status-active' : 'status-pending'
const handleImageError = (e) => e.target.src = 'https://ui-avatars.com/api/?name=C&background=4f46e5&color=fff'

watch(searchQuery, () => currentPage.value = 1)
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
  padding: 2.5rem;
}

/* Header */
.admin-header { margin-bottom: 2.5rem; }
.header-content { display: flex; justify-content: space-between; align-items: flex-end; }
.title-stack h1 { font-size: 2.75rem; font-weight: 800; letter-spacing: -1.5px; display: flex; align-items: center; gap: 1rem; margin: 0; }
.count-chip { font-size: 0.8rem; background: rgba(99, 102, 241, 0.1); color: var(--accent); padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(99,102,241,0.2); }
.subtitle-text { color: var(--text-muted); margin: 0.5rem 0 0 0; }

/* Actions */
.action-group { display: flex; gap: 1rem; align-items: center; }
.search-wrapper { position: relative; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; width: 300px; }
.search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
.search-wrapper input { width: 100%; background: transparent; border: none; color: white; padding: 0.75rem 1rem 0.75rem 2.8rem; outline: none; }
.search-shortcut { position: absolute; right: 0.8rem; top: 50%; transform: translateY(-50%); background: #27272a; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; color: #71717a; }
.primary-add-btn { background: var(--accent); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
.primary-add-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99,102,241,0.3); }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
.stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 1.5rem; display: flex; align-items: center; gap: 1.25rem; }
.stat-icon { width: 56px; height: 56px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; }
.stat-icon.blue { background: rgba(99, 102, 241, 0.1); color: var(--accent); }
.stat-icon.green { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
.stat-icon.purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
.stat-data .label { display: block; color: var(--text-muted); font-size: 0.8rem; font-weight: 600; }
.stat-data .value { font-size: 1.75rem; font-weight: 800; }

/* Table */
.content-wrapper { background: var(--surface); border: 1px solid var(--border); border-radius: 24px; overflow: hidden; }
.premium-table { width: 100%; border-collapse: collapse; }
.premium-table th { text-align: left; padding: 1rem 1.5rem; font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border); letter-spacing: 1px; font-weight: 700; }
.premium-table td { padding: 1rem 1.5rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
.member-cell { display: flex; align-items: center; gap: 1rem; }
.category-img-wrapper { width: 44px; height: 44px; border-radius: 12px; overflow: hidden; background: #000; border: 1px solid var(--border); flex-shrink: 0; }
.category-img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
.img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--accent); color: white; font-weight: 800; }
.status-pill { padding: 5px 12px; border-radius: 8px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; border: 1px solid currentColor; }
.status-active { background: rgba(34, 197, 94, 0.1); color: #34d399; }
.action-btns { display: flex; gap: 8px; justify-content: flex-end; }
.action-icon { background: #1c1c21; border: 1px solid var(--border); color: var(--text-muted); width: 36px; height: 36px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
.action-icon:hover { background: var(--accent); color: white; border-color: var(--accent); }
.action-icon.delete:hover { background: #ef4444; border-color: #ef4444; }

/* Pagination */
.premium-pagination-footer { padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); }
.entries-text { color: var(--text-muted); font-size: 0.85rem; margin: 0; }
.mono-num { color: white; font-family: 'JetBrains Mono', monospace; font-weight: 600; }

/* Modals */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-surface.compact-modal { max-width: 400px; width: 90%; background: #0c0c0e; border: 1px solid var(--border); border-radius: 28px; overflow: hidden; position: relative; }
.modal-banner.compact { height: 80px; background: linear-gradient(90deg, #6366f1, #a855f7); }
.modal-banner.danger { background: linear-gradient(90deg, #ef4444, #f87171); }
.modal-banner.detail { background: linear-gradient(90deg, #22c55e, #10b981); }
.close-btn { position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.3); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; }
.modal-content.compact-padding { padding: 0 1.5rem 2rem 1.5rem; margin-top: -40px; }
.icon-circle.compact { width: 70px; height: 70px; border-radius: 20px; border: 5px solid #0c0c0e; background: var(--surface); margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: var(--accent); font-size: 1.5rem; overflow: hidden; cursor: pointer; }
.circle-img-preview { width: 100%; height: 100%; object-fit: cover; }
.modal-header-clean h2 { text-align: center; margin: 0 0 1.5rem 0; font-size: 1.5rem; font-weight: 800; }

.input-group-custom label { display: block; font-size: 0.65rem; text-transform: uppercase; color: var(--text-muted); font-weight: 800; margin-bottom: 8px; letter-spacing: 1px; }
.input-group-custom input { width: 100%; background: #121216; border: 1px solid var(--border); color: white; padding: 0.8rem; border-radius: 12px; outline: none; }
.input-group-custom input:focus { border-color: var(--accent); }
.image-upload-zone { margin-top: 1rem; background: rgba(255,255,255,0.02); border: 1px dashed var(--border); padding: 0.8rem; border-radius: 12px; text-align: center; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; }

.modal-footer-refined { display: flex; gap: 1rem; margin-top: 1.5rem; }
.btn-primary, .btn-secondary, .btn-danger { flex: 1; padding: 0.8rem; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; transition: 0.2s; }
.btn-primary { background: var(--accent); color: white; }
.btn-secondary { background: #1c1c21; border: 1px solid var(--border); color: white; }
.btn-danger { background: #ef4444; color: white; }

.info-grid-simple { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.info-box { background: #121216; border: 1px solid var(--border); padding: 1rem; border-radius: 14px; }
.info-box label { font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 4px; font-weight: 800; }
.info-box p { margin: 0; font-weight: 700; }
.large-text { color: var(--accent); font-size: 1.1rem !important; }

/* Transitions */
.premium-modal-enter-active, .premium-modal-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.premium-modal-enter-from, .premium-modal-leave-to { opacity: 0; transform: scale(0.9) translateY(20px); }

@media (max-width: 992px) {
    .stats-row { grid-template-columns: 1fr; }
    .header-content { flex-direction: column; align-items: stretch; gap: 1.5rem; }
    .search-wrapper { width: 100%; }
}
</style>