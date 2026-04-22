<template>
  <main class="login-page">
    <div class="blob-wrapper">
      <div class="profile-header">
        <div class="profile-circle">
          <i class="bi bi-person-fill"></i>
        </div>
      </div>

      <h2 class="text-center text-white fw-bold sign-in-title">Login</h2>

      <form @submit.prevent="handleLogin" class="mt-4">
        <!-- Email -->
        <div class="custom-input-group mb-2">
          <div class="icon-box">
            <i class="bi bi-person"></i>
          </div>
          <input
            v-model="email_or_phone"
            type="text"
            placeholder="Enter your Email or Phone"
            class="inner-input"
          />
        </div>
        <p v-if="err.email_or_phone" class="error-msg">{{ err.email_or_phone }}</p>

        <!-- Password -->
        <div class="custom-input-group mb-2 mt-3">
          <div class="icon-box">
            <i class="bi bi-lock"></i>
          </div>
          <input
            v-model="password"
            :type="passwordType"
            placeholder="Enter your password"
            class="inner-input"
          />
          <span class="eye-icon" @click="togglePassword">
            <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
          </span>
        </div>
        <p v-if="err.password" class="error-msg">{{ err.password }}</p>

        <!-- API / Auth Error -->
        <div v-if="apiError" class="api-error-box mt-2">
          <i class="bi bi-exclamation-circle-fill me-2"></i>{{ apiError }}
        </div>

        <!-- Remember me -->
        <div class="d-flex justify-content-between align-items-center mt-3 mb-4 links-row">
          <label class="checkbox-container">
            <input type="checkbox" v-model="rememberMe">
            <span>Remember me</span>
          </label>
        </div>

        <!-- Submit -->
        <div class="text-center">
          <button :disabled="isLoading" type="submit" class="btn-login-gradient">
            <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
            <span v-else>LOGIN</span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router    = useRouter()
const authStore = useAuthStore()

const email_or_phone = ref('')
const password       = ref('')
const rememberMe     = ref(false)
const isLoading      = ref(false)
const showPassword   = ref(false)
const apiError       = ref('')

const err = reactive({
  email_or_phone: '',
  password: ''
})

const passwordType   = computed(() => showPassword.value ? 'text' : 'password')
const togglePassword = () => { showPassword.value = !showPassword.value }

function validator() {
  err.email_or_phone = !email_or_phone.value.trim() ? 'Email or phone number is required.' : ''
  err.password       = !password.value.trim()       ? 'Password is required.'              : ''
  return !err.email_or_phone && !err.password
}

async function handleLogin() {
  apiError.value = ''
  if (!validator()) return

 

  isLoading.value = true
  try {
    await authStore.login({
      email: email_or_phone.value,
      password: password.value,
    })

    router.push('/dashboard')

  } catch (error) {
    apiError.value = error.message || 'Login failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #cc2be0, #2196f3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Segoe UI', sans-serif;
  padding: 20px;
}

.blob-wrapper {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  width: 100%;
  max-width: 420px;
  padding: 60px 45px 45px;
  border-radius: 40% 60% 50% 50% / 40% 40% 60% 60%;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.profile-header {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
}
.profile-circle {
  width: 85px;
  height: 85px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  color: #c729df;
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}

.sign-in-title {
  font-size: 2rem;
  margin-top: 10px;
}

.custom-input-group {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.3);
  border: 1.5px solid rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  padding: 6px 15px;
}

.icon-box {
  width: 36px;
  height: 36px;
  background: linear-gradient(to right, #b727d8, #2196f3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 12px;
  flex-shrink: 0;
}

.inner-input {
  background: transparent;
  border: none;
  width: 100%;
  color: rgb(26, 23, 23);
  outline: none;
}
.inner-input::placeholder {
  color: rgba(91, 87, 87, 0.8);
}

.eye-icon {
  cursor: pointer;
  color: white;
}

.links-row {
  font-size: 0.85rem;
  color: white;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: white;
}

.btn-login-gradient {
  background: linear-gradient(to right, #2196f3, #b727d8);
  border: none;
  color: white;
  padding: 12px 50px;
  border-radius: 50px;
  font-weight: bold;
  letter-spacing: 1px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  transition: 0.3s;
}
.btn-login-gradient:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}
.btn-login-gradient:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-msg {
  color: #ffbaba;
  font-size: 0.75rem;
  margin: 5px 0 0 15px;
}

.api-error-box {
  background: rgba(255, 0, 0, 0.15);
  border: 1px solid rgba(255, 100, 100, 0.5);
  border-radius: 12px;
  padding: 10px 14px;
  color: #ffe0e0;
  font-size: 0.82rem;
  display: flex;
  align-items: center;
}
</style>