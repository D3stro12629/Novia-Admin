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

  // --- ACTIONS ---

  /**
   * Login Action
   * @param {Object} credentials { email, password }
   */
  const login = async (credentials) => {
    isLoading.value = true;
    try {
      // 1. Prepare Data (using FormData as per your previous requirement)
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

      // 5. Save State
      setAuth(tokenValue);

      // 6. Get User Profile immediately
      await fetchProfile();

      return res.data;
    } catch (error) {
      clearAuth();
      throw formatError(error);
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
      user.value = res.data.data;
    } catch (error) {
      // If profile fetch fails (e.g., token expired), log out
      clearAuth();
      throw error;
    }
  };

  /**
   * Logout Action
   */
  const logout = async () => {
    try {
      // Tell backend to invalidate token
      await api.delete("/api/logout");
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      // Always clear local state even if API call fails
      clearAuth();
      // Force page reload or redirect is handled in the component/router
    }
  };

  // --- HELPERS ---

  const setAuth = (newToken) => {
    token.value = newToken;
    localStorage.setItem("token", newToken);
    // Note: If your axios instance (api) needs a header update, do it here:
    // api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const clearAuth = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    // delete api.defaults.headers.common['Authorization'];
  };

  /**
   * Consistent Error Formatter
   */
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
    isLoading,
    isAuthenticated,
    login,
    fetchProfile,
    logout,
    clearAuth,
  };
});