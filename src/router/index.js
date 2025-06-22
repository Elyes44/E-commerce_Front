import { createRouter, createWebHistory } from 'vue-router'
import LoginCard from '@/components/LoginCard.vue'
import Register from '@/components/Register.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginCard
  },
    {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router