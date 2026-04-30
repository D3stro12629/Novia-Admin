import { defineStore } from "pinia";
import api from "@/api/https";
import { ref, computed } from "vue";

export const useDashboardStore = defineStore("dashboard", () => {
  const isLoading = ref(false);
  const error = ref(null);

  // Raw data from API
  const skills = ref([]);
  const subjects = ref([]);
  const schools = ref([]);
  const degrees = ref([]);
  const categories = ref([]);
  const users = ref([]);
  const usersTotal = ref(0);

  // --- FILTER LOGIC: LAST 7 DAYS ---
  const isWithinLastWeek = (dateString) => {
    if (!dateString) return false;
    const itemDate = new Date(dateString);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return itemDate >= oneWeekAgo;
  };

  const sortNewest = (arr) => {
    return [...arr]
      .filter((i) => isWithinLastWeek(i.created_at))
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  // Computed Recent Lists (Filtered to 1 week)
  const recentCategories = computed(() => sortNewest(categories.value));
  const recentSkills = computed(() => sortNewest(skills.value));
  const recentSubjects = computed(() => sortNewest(subjects.value));
  const recentSchools = computed(() => sortNewest(schools.value));
  const recentDegrees = computed(() => sortNewest(degrees.value));
  const newestUsers = computed(() => sortNewest(users.value));

  // --- STATS & CHARTS ---
  const barChartData = computed(() => [
    { label: "Skills", height: skills.value.length || 0 },
    { label: "Schools", height: schools.value.length || 0 },
    { label: "Degrees", height: degrees.value.length || 0 },
    { label: "Subjects", height: subjects.value.length || 0 },
    { label: "Categories", height: categories.value.length || 0 },
    { label: "Users", height: usersTotal.value || 0 },
  ]);

  const statCardsData = computed(() => [
    { label: "Total Users", value: usersTotal.value, icon: "bi-people-fill", iconColor: "#3b82f6" },
    { label: "Total Skills", value: skills.value.length, icon: "bi-lightbulb-fill", iconColor: "#a855f7" },
    { label: "Total Schools", value: schools.value.length, icon: "bi-building-fill", iconColor: "#10b981" },
    { label: "Total Degrees", value: degrees.value.length, icon: "bi-mortarboard-fill", iconColor: "#f59e0b" },
    { label: "Total Categories", value: categories.value.length, icon: "bi-folder-fill", iconColor: "#06b6d4" },
    { label: "Total Subjects", value: subjects.value.length, icon: "bi-book-half", iconColor: "#f97316" }
  ]);

  const quickActionsData = [
    { label: "Add Skill", sub: "Create new skill", icon: "bi-lightbulb" },
    { label: "Add School", sub: "Register school", icon: "bi-building" },
    { label: "Add Degree", sub: "New degree type", icon: "bi-mortarboard" },
    { label: "Add Subject", sub: "Create subject", icon: "bi-journal" },
    { label: "Add Category", sub: "New category", icon: "bi-folder-plus" },
  ];

  const fetchDashboardData = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      const [skillsRes, subjectsRes, schoolsRes, degreesRes, categoriesRes, usersRes] =
        await Promise.all([
          api.get("/api/skills"),
          api.get("/api/subjects"),
          api.get("/api/schools"),
          api.get("/api/degrees"),
          api.get("/api/categories"),
          api.get("/api/users"),
        ]);

      skills.value = skillsRes.data?.data || skillsRes.data || [];
      subjects.value = subjectsRes.data?.data || subjectsRes.data || [];
      schools.value = schoolsRes.data?.data || schoolsRes.data || [];
      degrees.value = degreesRes.data?.data || degreesRes.data || [];
      categories.value = categoriesRes.data?.data || categoriesRes.data || [];
      users.value = usersRes.data?.data || usersRes.data?.data?.data || usersRes.data || [];
      usersTotal.value = usersRes.data?.total || usersRes.data?.data?.total || users.value.length || 0;
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    recentCategories,
    recentSkills,
    recentSubjects,
    recentSchools,
    recentDegrees,
    newestUsers,
    barChartData,
    statCardsData,
    quickActionsData,
    fetchDashboardData,
  };
});