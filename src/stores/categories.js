import { defineStore } from "pinia";
import api from "@/api/https";
import { ref } from "vue";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);
  const category = ref(null);
  const isLoading = ref(false);
  const isProcessing = ref(false);

  const fetchCategories = async (options = {}) => {
    const { force = false } = options;
    if (!force && categories.value.length > 0) return;

    try {
      isLoading.value = true;
      const res = await api.get(`/api/categories`);
      const data = res.data?.data?.items || res.data?.data || res.data || [];
      categories.value = [...data].sort((a, b) => b.id - a.id);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      isLoading.value = false;
    }
  };

const createCategory = async (payload) => {
    try {
      isProcessing.value = true;
      const formData = new FormData();
      formData.append('name', payload.name);
      if (payload.image instanceof File) {
        formData.append('image', payload.image);
      }

      const res = await api.post(`/api/categories`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err) {
      console.error("Create Error:", err);
      throw err; // THIS IS IMPORTANT
    } finally {
      isProcessing.value = false;
    }
  };

  const editCategory = async (id, payload) => {
    try {
      isProcessing.value = true;
      const formData = new FormData();
      formData.append('name', payload.name);
      if (payload.image instanceof File) {
        formData.append('image', payload.image);
      }

      // Add this for images to work on Update
      formData.append('_method', 'PUT');

      const res = await api.post(`/api/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err) {
      console.error("Edit Error:", err);
      throw err; // THIS IS IMPORTANT
    } finally {
      isProcessing.value = false;
    }
  };

  const deleteCategory = async (id) => {
    try {
      isProcessing.value = true;
      const res = await api.delete(`/api/categories/${id}`);
      return res.data;
    } catch (err) {
      console.error("Delete Error:", err);
      throw err;
    } finally {
      isProcessing.value = false;
    }
  };

  return {
    categories, isLoading, isProcessing, category,
    fetchCategories, createCategory, editCategory, deleteCategory,
  };
});