import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login/LoginView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile/ProfileView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/category',
      name: 'category',
      component: () => import('../views/CategoryView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/degree',
      name: 'degree',
      component: () => import('../views/DegreeView.vue'),
    },
    {
      path: '/school',
      name: 'school',
      component: () => import('../views/SchoolView.vue'),
    },
    {
      path: '/skill',
      name: 'skill',
      component: () => import('../views/SkillView.vue'),
    },
    {
      path: '/subject',
      name: 'subject',
      component: () => import('../views/SubjectView.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/UserView.vue'),
    },
    //Not Found Page
    {
      path: "/:catchAll(.*)",
      name: "page.404",
      component: () => import('../views/NotFoundView.vue'),
      meta: { title: "404 Not Found" },
    },
  ],
})

export default router
