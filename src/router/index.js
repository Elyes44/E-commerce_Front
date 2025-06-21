import { createRouter, createWebHistory } from 'vue-router'
import LoginCard from '@/components/LoginCard.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginCard
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router