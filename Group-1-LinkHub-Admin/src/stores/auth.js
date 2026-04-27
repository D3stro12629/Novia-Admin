import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/api/https";

export const useAuthStore = defineStore("auth", () => {
  // --- STATE ---
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(null);
  const isLoading = ref(false);

  // --- GETTERS ---
  const isAuthenticated = computed(() => !!token.value);
  const isLoggedIn = computed(() => !!token.value);

  // ✅ Role is inside roles array → roles[0].name
  const userRole = computed(() => user.value?.roles?.[0]?.name || null);

  // --- ACTIONS ---

  /**
   * Login Action
   * @param {Object} credentials { email, password }
   */
  const login = async (credentials) => {
    isLoading.value = true;
    try {
      // 1. Prepare Data
      const formData = new FormData();
      formData.append("email_or_phone", credentials.email);
      formData.append("password", credentials.password);

      // 2. API Call
      const res = await api.post("/api/login", formData);

      // 3. Handle Backend "False" Flag
      if (res.data?.result === false || res.data?.result === "false") {
        throw new Error(res.data?.message || "Login failed.");
      }

      // 4. Extract Token
      const tokenValue = res.data?.data?.token;
      if (!tokenValue) {
        throw new Error("No authentication token received.");
      }

      // 5. Save Token
      setAuth(tokenValue);

      // 6. Get User Profile (roles are inside user)
      await fetchProfile();

      // 7. Return role so login component can route
      const role = user.value?.roles?.[0]?.name || null;
      return { success: true, role };

    } catch (error) {
      clearAuth();
      throw new Error(formatError(error));
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Fetch User Profile
   */
  const fetchProfile = async () => {
    if (!token.value) return;
    try {
      const res = await api.get("/api/me");
      // ✅ Store full user object including roles array
      user.value = res.data.data;
    } catch (error) {
      clearAuth();
      throw error;
    }
  };

  /**
   * Logout Action
   */
  const logout = async () => {
    try {
      await api.delete("/api/logout");
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      clearAuth();
    }
  };

  // --- HELPERS ---

  const setAuth = (newToken) => {
    token.value = newToken;
    localStorage.setItem("token", newToken);
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
  };

  const formatError = (error) => {
    if (error.response?.data) {
      const data = error.response.data;
      if (data.errors) return Object.values(data.errors).flat()[0];
      if (data.message) return data.message;
      if (data.error) return data.error;
    }
    return error.message || "An unexpected error occurred.";
  };

  return {
    token,
    user,
    userRole,
    isLoading,
    isAuthenticated,
    isLoggedIn,
    login,
    fetchProfile,
    logout,
    clearAuth,
  };
});