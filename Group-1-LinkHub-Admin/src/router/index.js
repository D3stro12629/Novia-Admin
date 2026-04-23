import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Redirect root path to dashboard
    // The Navigation Guard will intercept this and send them to /login if needed
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('../views/CategoryView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/degrees',
      name: 'degrees',
      component: () => import('../views/DegreeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/schools',
      name: 'schools',
      component: () => import('../views/SchoolView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/skills',
      name: 'skills',
      component: () => import('../views/SkillView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/subjects',
      name: 'subjects',
      component: () => import('../views/SubjectView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UserView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/HelpView.vue'),
      meta: { requiresAuth: true }
    },
    // 404 Not Found Page
    {
      path: "/:catchAll(.*)",
      name: "page.404",
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: "404 Not Found" },
    },
  ],
})

/**
 * NAVIGATION GUARD
 * Logic: 
 * 1. If trying to access a restricted page without a token -> Redirect to Login
 * 2. If trying to access Login while already having a token -> Redirect to Dashboard
 */
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check token from store or localStorage (for persistence on refresh)
  const token = authStore.token || localStorage.getItem('token');
  const isAuthenticated = !!token;

  // Case 1: User is not logged in and tries to access any page except Login
  if (to.name !== 'login' && !isAuthenticated) {
    next({ name: 'login' });
  } 
  // Case 2: User is already logged in and tries to go to the Login page
  else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'dashboard' });
  } 
  // Case 3: Allow the navigation
  else {
    next();
  }
});

export default router