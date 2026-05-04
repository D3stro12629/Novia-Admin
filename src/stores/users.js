import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    isLoading: false,
    pagination: {
      total: 0,
      currentPage: 1,
      lastPage: 1,
      perPage: 10
    }
  }),

  actions: {
    async fetchUsers(page = 1) {
      this.isLoading = true
      try {
        // Replace with your actual API endpoint
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://novia2.csm.linkpc.net'
        const response = await axios.get(`${API_BASE_URL}/api/users?page=${page}`)
        
        // Adjust these mappings based on your actual API response structure
        this.users = response.data.data
        this.pagination = {
          total: response.data.total || response.data.meta?.total || 0,
          currentPage: response.data.current_page || response.data.meta?.current_page || 1,
          lastPage: response.data.last_page || response.data.meta?.last_page || 1,
          perPage: response.data.per_page || 10
        }
      } catch (error) {
        console.error('Error fetching users:', error)
        // Fallback for testing if API fails
        this.users = [] 
      } finally {
        this.isLoading = false
      }
    }
  }
})