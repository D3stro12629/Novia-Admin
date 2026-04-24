<template>
  <main class="login-page">
    <div class="login-card">
      <div class="top-accent"></div>

      <div class="card-header">
        <div class="app-logo">
          <i class="bi bi-shield-lock-fill"></i>
        </div>
        <h1 class="login-title">Welcome back</h1>
        <p class="login-subtitle">Please enter your details</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Email/Phone Field -->
        <div class="input-group-wrapper">
          <label class="field-label">Email or Phone</label>
          <div :class="['custom-input-box', { 'input-error': errors.email_or_phone }]">
            <i class="bi bi-person input-icon"></i>
            <input
              v-model="credentials.email_or_phone"
              type="text"
              placeholder="name@company.com"
              class="main-input"
            />
          </div>
          <p v-if="errors.email_or_phone" class="error-text">{{ errors.email_or_phone }}</p>
        </div>

        <!-- Password Field -->
        <div class="input-group-wrapper">
          <div class="label-row">
            <label class="field-label">Password</label>
         
          </div>
          <div :class="['custom-input-box', { 'input-error': errors.password }]">
            <i class="bi bi-lock input-icon"></i>
            <input
              v-model="credentials.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="main-input"
            />
            <button type="button" class="eye-btn" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
            </button>
          </div>
          <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
        </div>

        <!-- API Error Message -->
        <Transition name="fade">
          <div v-if="apiError" class="api-error-alert">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <span>{{ apiError }}</span>
          </div>
        </Transition>

        <!-- Form Options -->
        <div class="form-options">
       
        </div>

        <!-- Submit Button -->
        <button :disabled="isLoading" type="submit" class="btn-primary-login">
          <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          <span>{{ isLoading ? 'Checking...' : 'Sign In' }}</span>
        </button>
      </form>

      <footer class="card-footer">
        <p>© 2024 Admin System</p>
      </footer>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()


const VALID_EMAIL = 'chandalen@gmail.com'
const VALID_PASSWORD = '11223344Aa!'

const credentials = reactive({ email_or_phone: '', password: '' })
const errors = reactive({ email_or_phone: '', password: '' })
const rememberMe = ref(false)
const isLoading = ref(false)
const showPassword = ref(false)
const apiError = ref('')

const validate = () => {
  errors.email_or_phone = !credentials.email_or_phone.trim() ? 'Required' : ''
  errors.password = !credentials.password.trim() ? 'Required' : ''
  return !errors.email_or_phone && !errors.password
}

const handleLogin = async () => {
  apiError.value = ''
  if (!validate()) return

  isLoading.value = true

  try {
    // 1. Check hardcoded credentials first (before calling API)
    if (
      credentials.email_or_phone !== VALID_EMAIL ||
      credentials.password !== VALID_PASSWORD
    ) {
      throw new Error('Invalid email or password!')
    }

    // 2. Call auth store login → calls real API → gets real token
    await authStore.login({
      email: credentials.email_or_phone,
      password: credentials.password,
    })

    // 3. Remember me
    if (rememberMe.value) {
      localStorage.setItem('rememberMe', credentials.email_or_phone)
    } else {
      localStorage.removeItem('rememberMe')
    }

    // 4. Redirect to dashboard
    router.push({ name: 'dashboard' })

  } catch (error) {
    apiError.value = typeof error === 'string'
      ? error
      : error.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

.login-page {
  min-height: 100vh;
  background-color: #09090b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 20px;
}

.login-card {
  background-color: #121215;
  width: 100%;
  max-width: 380px;
  border-radius: 20px;
  border: 1px solid #27272a;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
  padding: 32px;
}

.top-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #6366f1;
}

.card-header {
  text-align: center;
  margin-bottom: 24px;
}

.app-logo {
  width: 44px;
  height: 44px;
  background-color: rgba(99, 102, 241, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #6366f1;
  font-size: 1.4rem;
}

.login-title {
  color: #fafafa;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.login-subtitle {
  color: #a1a1aa;
  font-size: 0.85rem;
}

.input-group-wrapper {
  margin-bottom: 16px;
}

.label-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.field-label {
  color: #e4e4e7;
  font-size: 0.8rem;
  font-weight: 600;
}

.forgot-link {
  color: #6366f1;
  font-size: 0.75rem;
  text-decoration: none;
}

.custom-input-box {
  display: flex;
  align-items: center;
  background-color: #18181b;
  border: 1px solid #27272a;
  border-radius: 10px;
  padding: 0 12px;
}

.custom-input-box:focus-within {
  border-color: #6366f1;
}

.input-icon {
  color: #71717a;
  font-size: 1rem;
  margin-right: 10px;
}

.main-input {
  background: transparent;
  border: none;
  width: 100%;
  height: 42px;
  color: #fafafa;
  outline: none;
  font-size: 0.9rem;
}

.eye-btn {
  background: transparent;
  border: none;
  color: #71717a;
  cursor: pointer;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.label-text {
  color: #a1a1aa;
  font-size: 0.8rem;
}

.btn-primary-login {
  width: 100%;
  background-color: #6366f1;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  margin-top: 20px;
  transition: 0.2s;
  cursor: pointer;
}

.btn-primary-login:hover {
  background-color: #4f46e5;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-primary-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-text {
  color: #ef4444;
  font-size: 0.7rem;
  margin-top: 4px;
}

.input-error {
  border-color: #ef4444 !important;
}

.api-error-alert {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.card-footer {
  margin-top: 24px;
  text-align: center;
  border-top: 1px solid #27272a;
  padding-top: 16px;
}

.card-footer p {
  color: #52525b;
  font-size: 0.7rem;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>