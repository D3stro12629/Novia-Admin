<template>
    <DashboardLayout>
        <div class="profile-page">

            <!-- Enhanced Profile Header -->
            <div class="profile-header-container">
                <div class="header-cover-wrapper">
                    <img v-if="profileStore.user?.cover" :src="profileStore.user.cover" alt="Cover"
                        class="main-cover-img" />
                    <div v-else class="cover-placeholder"></div>
                    <div class="cover-glass-overlay">
                        <button class="change-cover-trigger" @click="openCoverModal">
                            <i class="bi bi-camera"></i>
                            <span>Edit Cover</span>
                        </button>
                    </div>
                </div>

                <div class="header-content-box">
                    <div class="identity-flex">
                        <div class="avatar-outer-ring">
                            <div class="avatar-inner" @click="triggerUpload"
                                :class="{ 'uploading': profileStore.isProcessing }">
                                <img v-if="profileStore.user?.avatar" :src="profileStore.user.avatar" alt="Profile" />
                                <span v-else class="avatar-initials">{{ profileStore.user?.full_name?.charAt(0) || 'N'
                                }}</span>

                                <div class="avatar-edit-overlay">
                                    <i class="bi bi-pencil"></i>
                                </div>
                                <div v-if="profileStore.isProcessing" class="avatar-loader">
                                    <div class="spinner-border spinner-border-sm"></div>
                                </div>
                            </div>
                            <div class="online-status"></div>
                            <button v-if="profileStore.user?.avatar" class="avatar-remove-shortcut"
                                @click.stop="removeAvatar">
                                <i class="bi bi-x"></i>
                            </button>
                            <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none"
                                accept="image/*" />
                        </div>

                        <div class="user-info-stack">
                            <div class="name-row">
                                <h1 class="display-name">{{ profileStore.user?.full_name || 'Naya Rachel' }}</h1>
                                <div class="badge-group">
                                    <span v-for="role in profileStore.user?.roles" :key="role.id" class="modern-badge">
                                        {{ role.name }}
                                    </span>
                                </div>
                            </div>
                            <p class="user-subtext">
                                <i class="bi bi-geo-alt"></i> {{ profileStore.user?.current_city || 'Location not set'
                                }}
                                <span class="dot-separator"></span>
                                <i class="bi bi-calendar3"></i> Joined {{ formatDate(profileStore.user?.created_at) }}
                            </p>
                        </div>

                        <div class="header-actions">
                            <button class="btn-modern-primary" @click="openEditModal">
                                <i class="bi bi-person-fill-gear"></i>
                                <span>Edit Profile</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Content Layout -->
            <div class="profile-main-grid">
                <div class="content-primary">
                    <!-- Modern Segmented Tabs -->
                    <div class="segmented-tabs">
                        <button v-for="tab in tabs" :key="tab.id"
                            :class="['segment-btn', { active: activeTab === tab.id }]" @click="activeTab = tab.id">
                            {{ tab.label }}
                        </button>
                    </div>

                    <!-- Tab contents remain logically identical, but with updated spacing/styling -->
                    <div v-if="activeTab === 'overview'" class="tab-view fade-in">
                        <BaseCard class="modern-info-card">
                            <div class="card-title-row">
                                <div class="title-icon"><i class="bi bi-person-lines-fill"></i></div>
                                <h3>Personal Details</h3>
                            </div>

                            <div class="details-grid">
                                <div class="detail-item">
                                    <label>Full Name</label>
                                    <div class="detail-value">{{ profileStore.user?.full_name || '—' }}</div>
                                </div>
                                <div class="detail-item">
                                    <label>Email Address</label>
                                    <div class="detail-value">{{ profileStore.user?.email || '—' }}</div>
                                </div>
                                <div class="detail-item">
                                    <label>Phone Number</label>
                                    <div class="detail-value">{{ profileStore.user?.phone || '—' }}</div>
                                </div>
                                <div class="detail-item">
                                    <label>Birthday</label>
                                    <div class="detail-value">{{ formatDate(profileStore.user?.dob) }}</div>
                                </div>
                                <div class="detail-item">
                                    <label>Gender</label>
                                    <div class="detail-value">{{ getGenderLabel(profileStore.user?.gender) }}</div>
                                </div>
                                <div class="detail-item">
                                    <label>Home Town</label>
                                    <div class="detail-value">{{ profileStore.user?.home_town || '—' }}</div>
                                </div>
                                <div class="detail-item full-width">
                                    <label>Portfolio / Website</label>
                                    <div class="detail-value">
                                        <a v-if="profileStore.user?.portfolio_link"
                                            :href="profileStore.user.portfolio_link" target="_blank"
                                            class="accent-link">
                                            {{ profileStore.user.portfolio_link }} <i
                                                class="bi bi-box-arrow-up-right"></i>
                                        </a>
                                        <span v-else>—</span>
                                    </div>
                                </div>
                            </div>
                        </BaseCard>

                        <BaseCard class="modern-info-card mt-4">
                            <div class="card-title-row">
                                <div class="title-icon"><i class="bi bi-briefcase"></i></div>
                                <h3>Work & Role</h3>
                            </div>
                            <div class="details-grid">
                                <div class="detail-item">
                                    <label>Assigned Role</label>
                                    <div class="detail-value">{{ profileStore.user?.roles?.[0]?.name || 'Staff' }}</div>
                                </div>
                                <div class="detail-item">
                                    <label>Department</label>
                                    <div class="detail-value">Operations & IT</div>
                                </div>
                            </div>
                        </BaseCard>
                    </div>

                    <div v-if="activeTab === 'security'" class="tab-view fade-in">
                        <BaseCard class="modern-info-card">
                            <div class="card-title-row">
                                <div class="title-icon"><i class="bi bi-shield-lock"></i></div>
                                <h3>Authentication</h3>
                            </div>

                            <form class="security-modern-form" @submit.prevent="updatePassword">
                                <input type="email" :value="profileStore.user?.email" autocomplete="off" name="username"
                                    style="display: none;" readonly>

                                <div class="input-stack">
                                    <BaseInput v-model="passwordForm.old_pass" label="Current Password" type="password"
                                        :error="passwordFormErrors.old_pass" @blur="validatePasswordField('old_pass')"
                                        autocomplete="off" />

                                    <div class="password-split">
                                        <BaseInput v-model="passwordForm.new_pass" label="New Password" type="password"
                                            :error="passwordFormErrors.new_pass"
                                            @blur="validatePasswordField('new_pass')" autocomplete="off" />

                                        <BaseInput v-model="passwordForm.new_pass_confirmation" label="Confirm Password"
                                            type="password" :error="passwordFormErrors.new_pass_confirmation"
                                            @blur="validatePasswordField('new_pass_confirmation')" autocomplete="off" />
                                    </div>
                                </div>

                                <button type="submit" class="btn-save-security" :disabled="profileStore.isProcessing">
                                    <span v-if="profileStore.isProcessing"
                                        class="spinner-border spinner-border-sm me-2"></span>
                                    <i v-else class="bi bi-check2-circle"></i>
                                    Update Password
                                </button>
                            </form>
                        </BaseCard>
                    </div>
                </div>

                <!-- Sidebar -->
                <aside class="content-sidebar">
                    <BaseCard class="sidebar-stat-card">
                        <div class="completeness-header">
                            <h4>Profile Score</h4>
                            <span class="score-pct">{{ profileCompletion }}%</span>
                        </div>
                        <div class="score-track">
                            <div class="score-fill" :style="{ width: profileCompletion + '%' }"></div>
                        </div>
                        <div class="missing-list">
                            <div v-for="field in missingFields" :key="field" class="missing-tag">
                                <i class="bi bi-plus-circle"></i> {{ field }}
                            </div>
                        </div>
                    </BaseCard>

                    <BaseCard class="sidebar-stat-card">
                        <h4 class="sidebar-heading">Account Pulse</h4>
                        <div class="pulse-list">
                            <div class="pulse-item">
                                <div class="pulse-icon"><i class="bi bi-clock-history"></i></div>
                                <div class="pulse-info">
                                    <span class="pulse-label">Last Login</span>
                                    <span class="pulse-val">{{ lastLoginDisplay }}</span>
                                </div>
                            </div>
                            <div class="pulse-item" v-for="(item, index) in recentUpdates" :key="index">
                                <div class="pulse-icon accent"><i class="bi bi-lightning-charge"></i></div>
                                <div class="pulse-info">
                                    <span class="pulse-label">{{ item.title }}</span>
                                    <span class="pulse-val">{{ item.time }}</span>
                                </div>
                            </div>
                        </div>
                    </BaseCard>
                </aside>
            </div>

            <!-- Replace your existing Edit Personal Info Modal with this -->
            <BaseModal :show="showEditModal" title="Edit Profile" subtitle="Ensure your information is up to date"
                @close="showEditModal = false">
                <template #header-icon>
                    <div class="header-icon-pill"><i class="bi bi-pencil-square"></i></div>
                </template>

                <div class="modern-modal-body">
                    <div class="modern-form-grid">
                        <!-- Full name spans 2 columns -->
                        <div class="form-section-full">
                            <BaseInput v-model="personalForm.full_name" label="Full Name"
                                :error="personalFormErrors.full_name" placeholder="Enter your full name" />
                        </div>

                        <BaseInput v-model="personalForm.email" label="Email Address"
                            :error="personalFormErrors.email" />
                        <BaseInput v-model="personalForm.phone" label="Phone Number"
                            :error="personalFormErrors.phone" />

                        <BaseInput v-model="personalForm.dob" label="Birth Date" type="date" />
                        <BaseSelect v-model="personalForm.gender" label="Gender"
                            :options="[{ value: 1, label: 'Male' }, { value: 2, label: 'Female' }]" />

                        <BaseInput v-model="personalForm.current_city" label="Current City" />
                        <BaseInput v-model="personalForm.home_town" label="Hometown" />

                        <!-- Portfolio spans 2 columns -->
                        <div class="form-section-full">
                            <BaseInput v-model="personalForm.portfolio_link" label="Portfolio Link"
                                placeholder="https://..." />
                        </div>
                    </div>
                </div>

                <template #footer>
                    <div class="modal-footer-btns">
                        <button class="btn-cancel-modern" @click="showEditModal = false">Discard</button>
                        <button class="btn-confirm-modern" :disabled="profileStore.isProcessing"
                            @click="savePersonalInfo">
                            <span v-if="profileStore.isProcessing" class="spinner-border spinner-border-sm me-2"></span>
                            {{ profileStore.isProcessing ? 'Saving Changes...' : 'Save Changes' }}
                        </button>
                    </div>
                </template>
            </BaseModal>

            <!-- Cover Modal -->
            <BaseModal :show="showCoverModal" title="Cover Image" @close="closeCoverModal">
                <div class="cover-editor">
                    <div class="cover-preview-large">
                        <img v-if="coverPreview" :src="coverPreview" />
                        <div v-else class="no-img-msg">No Image Selected</div>
                    </div>
                    <div class="cover-btns">
                        <button class="btn-outline-sm" @click="triggerCoverPicker">Browse Files</button>
                        <button v-if="coverFullUrl" class="btn-danger-sm" @click="removeCover">Remove</button>
                    </div>
                    <input type="file" ref="coverFileInput" @change="handleCoverFileChange" style="display: none"
                        accept="image/*" />
                </div>
                <template #footer>
                    <button class="btn-confirm w-100" :disabled="!coverFile || profileStore.isProcessing"
                        @click="uploadCoverFile">
                        Update Cover Image
                    </button>
                </template>
            </BaseModal>
        </div>
    </DashboardLayout>
</template>

<script setup>
/* Logic is exactly as provided in your source to ensure zero functional regression */
import { ref, onMounted, reactive, watch, computed } from 'vue'
import { useProfileStore } from '@/stores/profile'
import { useToast } from '@/composables/useToast'
import { useConfirm } from '@/composables/useConfirm'
import BaseCard from '@/components/ui/base/BaseCard.vue'
import BaseModal from '@/components/ui/base/BaseModal.vue'
import BaseSkeleton from '@/components/ui/base/BaseSkeleton.vue'
import BaseInput from '@/components/ui/base/BaseInput.vue'
import BaseSelect from '@/components/ui/base/BaseSelect.vue'
import { useFormValidation, validationRules } from '@/composables/useFormValidation'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const profileStore = useProfileStore()
const toast = useToast()
const confirm = useConfirm()
const activeTab = ref('overview')
const fileInput = ref(null)
const showEditModal = ref(false)
const showCoverModal = ref(false)
const coverFileInput = ref(null)
const coverFile = ref(null)
const coverPreview = ref('')
const coverObjectUrl = ref('')
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const coverFileName = computed(() => coverFile.value?.name || '')
const coverFullUrl = computed(() => coverPreview.value || profileStore.user?.cover || '')

watch(activeTab, (newTab) => {
    if (newTab === 'security') {
        resetPasswordValidation()
        passwordForm.old_pass = ''
        passwordForm.new_pass = ''
        passwordForm.new_pass_confirmation = ''
    }
})

const personalForm = reactive({
    full_name: '',
    phone: '',
    email: '',
    dob: '',
    gender: null,
    current_city: '',
    home_town: '',
    portfolio_link: ''
})

const {
    errors: personalFormErrors,
    validateField: validatePersonalField,
    validate: validateAllPersonal
} = useFormValidation(personalForm, {
    full_name: [
        validationRules.required('Full name is required'),
        validationRules.maxLength(255, 'Full name must be under 255 characters')
    ],
    email: [
        validationRules.required('Email is required'),
        validationRules.email(),
        validationRules.maxLength(255, 'Email must be under 255 characters')
    ],
    phone: [
        validationRules.required('Phone number is required'),
        validationRules.maxLength(255, 'Phone number must be under 255 characters')
    ],
    current_city: [validationRules.maxLength(255, 'City must be under 255 characters')],
    home_town: [validationRules.maxLength(255, 'Home town must be under 255 characters')],
    portfolio_link: [
        validationRules.url('Please enter a valid URL (https://...)'),
        validationRules.maxLength(255, 'Portfolio link must be under 255 characters')
    ]
})

const passwordForm = reactive({
    old_pass: '',
    new_pass: '',
    new_pass_confirmation: ''
})

const {
    errors: passwordFormErrors,
    validateField: validatePasswordField,
    validate: validateAllPassword,
    reset: resetPasswordValidation
} = useFormValidation(passwordForm, {
    old_pass: [validationRules.required('Current password is required')],
    new_pass: [
        validationRules.required('New password is required'),
        validationRules.minLength(8, 'Password must be at least 8 characters'),
        validationRules.maxLength(255, 'Password must be under 255 characters'),
        validationRules.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$',
            'Use upper, lower, number, and special character'
        ),
        (value) => value !== passwordForm.old_pass || 'New password must be different from current password'
    ],
    new_pass_confirmation: [
        validationRules.required('Please confirm your new password'),
        (value) => value === passwordForm.new_pass || 'Passwords do not match'
    ]
})


const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'security', label: 'Security' }
]

onMounted(async () => {
    await profileStore.fetchProfile()
})

const openEditModal = () => {
    const u = profileStore.user
    personalForm.full_name = u?.full_name || ''
    personalForm.phone = u?.phone || ''
    personalForm.email = u?.email || ''
    personalForm.dob = u?.dob || ''
    personalForm.gender = u?.gender ?? null
    personalForm.current_city = u?.current_city || ''
    personalForm.home_town = u?.home_town || ''
    personalForm.portfolio_link = u?.portfolio_link || ''
    showEditModal.value = true
}

const savePersonalInfo = async () => {
    if (!validateAllPersonal()) {
        toast.error('Please fix the errors before saving')
        return
    }
    try {
        const payload = { ...personalForm }
        await profileStore.updatePersonalInfo(payload)
        showEditModal.value = false
        toast.success('Profile updated successfully!')
    } catch (err) {
        console.error(err)
        toast.error('Failed to update profile info')
    }
}

const updatePassword = async () => {
    if (!validateAllPassword()) return
    try {
        const res = await profileStore.changePassword(passwordForm)
        if (res?.result === false || res?.success === false || res?.status === false || res?.error || res?.errors) {
            toast.error('Incorrect current password')
            passwordForm.old_pass = ''
            return
        }
        passwordForm.old_pass = ''
        passwordForm.new_pass = ''
        passwordForm.new_pass_confirmation = ''
        toast.success(res?.message || 'Password updated successfully!')
    } catch (err) {
        toast.error('Failed to update password')
    }
}

const triggerUpload = () => fileInput.value.click()

const openCoverModal = () => {
    if (coverObjectUrl.value) URL.revokeObjectURL(coverObjectUrl.value)
    coverPreview.value = profileStore.user?.cover || ''
    coverFile.value = null
    showCoverModal.value = true
}

const closeCoverModal = () => {
    if (coverObjectUrl.value) URL.revokeObjectURL(coverObjectUrl.value)
    showCoverModal.value = false
}

const triggerCoverPicker = () => coverFileInput.value?.click()

const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
        try {
            await profileStore.uploadAvatar(file)
            toast.success('Avatar updated!')
        } catch (err) { toast.error('Upload failed') }
    }
}

const handleCoverFileChange = (event) => {
    const file = event.target.files[0]
    if (!file) return
    coverFile.value = file
    coverObjectUrl.value = URL.createObjectURL(file)
    coverPreview.value = coverObjectUrl.value
}

const uploadCoverFile = async () => {
    if (!coverFile.value) return
    try {
        await profileStore.uploadCover(coverFile.value)
        toast.success('Cover updated!')
        closeCoverModal()
    } catch (err) { toast.error('Upload failed') }
}

const removeCover = () => {
    confirm.show({
        title: 'Remove Cover?',
        message: 'This will delete your cover image.',
        type: 'danger',
        onConfirm: async () => {
            try {
                await profileStore.removeCover()
                coverPreview.value = ''
                toast.success('Cover removed')
            } catch (err) { toast.error('Failed to remove') }
        }
    })
}

const removeAvatar = () => {
    confirm.show({
        title: 'Remove Photo?',
        message: 'Reset profile photo to default?',
        type: 'danger',
        onConfirm: async () => {
            try {
                await profileStore.removeAvatar()
                toast.success('Avatar removed')
            } catch (err) { toast.error('Failed to remove') }
        }
    })
}

const getGenderLabel = (g) => ({ 1: 'Male', 2: 'Female' }[g] || '—')

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'

const formatCompactDate = (d) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not available'

const profileFields = () => ([
    { key: 'full_name', label: 'Full name', value: profileStore.user?.full_name },
    { key: 'email', label: 'Email', value: profileStore.user?.email },
    { key: 'phone', label: 'Phone', value: profileStore.user?.phone },
    { key: 'dob', label: 'Date of birth', value: profileStore.user?.dob },
    { key: 'gender', label: 'Gender', value: profileStore.user?.gender },
    { key: 'current_city', label: 'City', value: profileStore.user?.current_city },
    { key: 'avatar', label: 'Avatar', value: profileStore.user?.avatar },
])

const profileCompletion = computed(() => {
    const fields = profileFields()
    const filled = fields.filter((f) => f.value).length
    return fields.length ? Math.round((filled / fields.length) * 100) : 0
})

const lastLoginDisplay = computed(() => {
    const local = localStorage.getItem('prevLoginAt') || localStorage.getItem('lastLoginAt')
    return formatCompactDate(profileStore.user?.last_login_at || local)
})

const missingFields = computed(() => profileFields().filter(f => !f.value).map(f => f.label).slice(0, 3))

const recentUpdates = computed(() => {
    const items = []
    if (profileStore.user?.updated_at) items.push({ title: 'Profile Refresh', time: formatCompactDate(profileStore.user.updated_at) })
    if (profileStore.user?.avatar) items.push({ title: 'New Photo', time: 'Recently' })
    return items.slice(0, 2)
})
</script>

<style scoped>
.profile-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding-bottom: 40px;
}

/* Redesigned Header */
.profile-header-container {
    background: var(--nav-surface);
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--color-border);
    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
}

.header-cover-wrapper {
    height: 220px;
    position: relative;
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.main-cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cover-glass-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.4));
    display: flex;
    justify-content: flex-end;
    padding: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.header-cover-wrapper:hover .cover-glass-overlay {
    opacity: 1;
}

.change-cover-trigger {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 8px 16px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    height: fit-content;
}

.header-content-box {
    padding: 0 40px 32px;
    margin-top: -60px;
    position: relative;
    z-index: 2;
}

.identity-flex {
    display: flex;
    align-items: flex-end;
    gap: 32px;
}

.avatar-outer-ring {
    position: relative;
    padding: 6px;
    background: var(--nav-surface);
    border-radius: 50%;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.avatar-inner {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    position: relative;
}

.avatar-inner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-initials {
    font-size: 48px;
    font-weight: 700;
    color: white;
}

.avatar-edit-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    opacity: 0;
    transition: 0.2s;
}

.avatar-inner:hover .avatar-edit-overlay {
    opacity: 1;
}

.online-status {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 24px;
    height: 24px;
    background: #22c55e;
    border: 4px solid var(--nav-surface);
    border-radius: 50%;
}

.avatar-remove-shortcut {
    position: absolute;
    top: 0;
    right: 0;
    background: #ef4444;
    color: white;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(239, 68, 68, 0.4);
}

.user-info-stack {
    flex: 1;
    padding-bottom: 10px;
}

.display-name {
    font-size: 32px;
    font-weight: 800;
    margin: 0;
    color: var(--color-text);
    letter-spacing: -0.5px;
}

.name-row {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 6px;
}

.modern-badge {
    background: rgba(37, 99, 235, 0.1);
    color: #2563eb;
    padding: 4px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
}

.user-subtext {
    color: var(--color-muted);
    font-size: 15px;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.dot-separator {
    width: 4px;
    height: 4px;
    background: var(--color-border);
    border-radius: 50%;
}

.btn-modern-primary {
    background: var(--color-text);
    color: var(--nav-surface);
    border: none;
    padding: 12px 24px;
    border-radius: 14px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-modern-primary:hover {
    transform: translateY(-2px);
    opacity: 0.9;
}

/* Main Grid Layout */
.profile-main-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 32px;
}

.segmented-tabs {
    background: var(--nav-surface);
    padding: 6px;
    border-radius: 16px;
    display: inline-flex;
    gap: 4px;
    border: 1px solid var(--color-border);
    margin-bottom: 24px;
}

.segment-btn {
    background: transparent;
    border: none;
    padding: 8px 24px;
    border-radius: 12px;
    font-weight: 600;
    color: var(--color-muted);
    cursor: pointer;
    transition: 0.2s;
}

.segment-btn.active {
    background: var(--color-text);
    color: var(--nav-surface);
}

.modern-info-card {
    padding: 32px !important;
    border-radius: 24px !important;
}

.card-title-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 28px;
}

.title-icon {
    width: 40px;
    height: 40px;
    background: rgba(37, 99, 235, 0.1);
    color: #2563eb;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.card-title-row h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
}

.details-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px 24px;
}

.detail-item.full-width {
    grid-column: span 2;
}

.detail-item label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: var(--color-muted);
    text-transform: uppercase;
    margin-bottom: 8px;
    letter-spacing: 0.5px;
}

.detail-value {
    font-size: 16px;
    font-weight: 600;
    color: var(--color-text);
}

.accent-link {
    color: #2563eb;
    text-decoration: none;
}

/* Sidebar Styling */
.sidebar-stat-card {
    padding: 24px !important;
    border-radius: 20px !important;
    margin-bottom: 24px;
}

.completeness-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.score-pct {
    font-weight: 800;
    color: #2563eb;
    font-size: 18px;
}

.score-track {
    height: 8px;
    background: var(--color-border);
    border-radius: 4px;
    margin-bottom: 20px;
    overflow: hidden;
}

.score-fill {
    height: 100%;
    background: linear-gradient(to right, #2563eb, #60a5fa);
    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.missing-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: var(--nav-bg);
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
    color: var(--color-muted);
    margin: 0 8px 8px 0;
}

.pulse-item {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
}

.pulse-icon {
    width: 36px;
    height: 36px;
    background: var(--nav-bg);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-muted);
}

.pulse-icon.accent {
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.1);
}

.pulse-info {
    display: flex;
    flex-direction: column;
}

.pulse-label {
    font-size: 11px;
    color: var(--color-muted);
    font-weight: 700;
}

.pulse-val {
    font-size: 13px;
    font-weight: 600;
}

/* Form Elements */
.security-modern-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.password-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.btn-save-security {
    align-self: flex-start;
    padding: 12px 32px;
    background: var(--color-text);
    color: var(--nav-surface);
    border: none;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
}

.modern-form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.span-2 {
    grid-column: span 2;
}

/* Responsive */
@media (max-width: 1024px) {
    .profile-main-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .identity-flex {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .header-content-box {
        margin-top: -70px;
    }

    .details-grid {
        grid-template-columns: 1fr;
    }

    .password-split {
        grid-template-columns: 1fr;
    }

    .header-actions {
        width: 100%;
    }

    .btn-modern-primary {
        width: 100%;
        justify-content: center;
    }
}

.fade-in {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>