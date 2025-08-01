import Vue from "vue";
import Router from "vue-router";
import AppHeader from "./layout/AppHeader";
import AppFooter from "./layout/AppFooter";
import Components from "./views/Components.vue";
import Landing from "./views/Landing.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import Profile from "./views/Profile.vue";
import profileUser from "./views/profile-user.vue";

Vue.use(Router);

const router = new Router({
  linkExactActiveClass: "active",
  routes: [
    {
      path: "/",
      name: "components",
      components: {
        header: AppHeader,
        default: Components,
        footer: AppFooter
      },
      meta: { requiresAuth: false } // Pas besoin d'authentification
    },
    {
      path: "/landing",
      name: "landing",
      components: {
        header: AppHeader,
        default: Landing,
        footer: AppFooter
      },
      meta: { requiresAuth: false }
    },
    {
      path: "/login",
      name: "login",
      components: {
        header: AppHeader,
        default: Login,
        footer: AppFooter
      },
      meta: { requiresAuth: false }
    },
    {
      path: "/register",
      name: "register",
      components: {
        header: AppHeader,
        default: Register,
        footer: AppFooter
      },
      meta: { requiresAuth: false }
    },
    {
      path: "/profile",
      name: "profile",
      components: {
        header: AppHeader,
        default: Profile,
        footer: AppFooter
      },
      meta: { requiresAuth: true } // Nécessite une connexion
    },
    {
      path: "/profileUser/:id",
      name: "profileUser",
      components: {
        header: AppHeader,
        default: profileUser,
        footer: AppFooter
      },
      props: true,
      meta: { requiresAuth: true } // Nécessite une connexion
    }
  ],
  scrollBehavior: to => {
    if (to.hash) {
      return { selector: to.hash };
    } else {
      return { x: 0, y: 0 };
    }
  }
});

// Vérifie l'authentification avant chaque navigation
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('accessToken');
  console.log('Navigating to:', to.path, 'isAuthenticated:', !!isAuthenticated);

  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Redirecting to /login because no token found');
    next('/login');
  } else {
    next();
  }
});

export default router;