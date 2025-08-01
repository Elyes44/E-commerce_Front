<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-default">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="container pt-lg-md">
      <div class="row justify-content-center">
        <div class="col-lg-5">
          <card
            type="secondary"
            shadow
            header-classes="bg-white pb-5"
            body-classes="px-lg-5 py-lg-5"
            class="border-0"
          >
            <!-- Social login -->
            <div class="text-muted text-center mb-3">
              <small>Sign in with</small>
            </div>

            <!-- Divider -->
            <div class="text-center text-muted mb-4">
              <small>Sign in with credentials</small>
            </div>

            <!-- Email/password login -->
            <form @submit.prevent="handleEmailLogin">
              <base-input
                v-model="email"
                alternative
                class="mb-3"
                placeholder="Email"
                addon-left-icon="ni ni-email-83"
              />
              <base-input
                v-model="password"
                type="password"
                alternative
                placeholder="Password"
                addon-left-icon="ni ni-lock-circle-open"
              />

              <base-checkbox>Remember me</base-checkbox>

              <div class="text-center">
                <base-button type="primary" class="my-4" native-type="submit">
                  Sign In
                </base-button>
              </div>
            </form>
          </card>

          <div class="row mt-3">
            <div class="col-6">
              <a href="#" class="text-light">
                <small>Forgot password?</small>
              </a>
            </div>
            <div class="col-6 text-right">
              <a href="/register#/register" class="text-light">
                <small>Create new account</small>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      refreshInterval: null,
      axiosInterceptor: null
    };
  },
  methods: {
    async handleEmailLogin() {
      try {
        const response = await axios.post(
          `${this.BASE_URL}/api/auth/login`,
          { email: this.email, password: this.password },
          { withCredentials: true }
        );

        console.log('Login response:', response.data);

        // Sauvegarder les données d'authentification
        this.saveAuthData(response.data);

        // Vérifier que le token est bien enregistré
        const token = localStorage.getItem('accessToken');
        this.$store.commit('setAuth', true);  // ← Mise à jour de l'état d'authentification
        this.$router.push('/profile');        // ← Redirection vers le profil
        if (!token) {
          throw new Error('Token not saved properly');
        }

        // Configurer axios et les intercepteurs
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        this.setupAxiosInterceptor();
        this.scheduleTokenRefresh();

        // Rediriger vers profileUser
        console.log('Redirecting to profile...');
        await this.$router.push({ 
          name: 'profileUser', 
          params: { id: response.data.user.id },
          query: { freshLogin: 'true' }
        });

      } catch (err) {
        this.handleLoginError(err);
      }
    },
    async refreshToken() {
  try {
    const currentToken = localStorage.getItem('accessToken');
    console.log('Attempting to refresh token...');
    const response = await axios.post(
      `${this.BASE_URL}/api/auth/refresh-token`,
      {},
      {
        headers: { 'Authorization': `Bearer ${currentToken}` },
        withCredentials: true
      }
    );

    const newToken = response.data.token || response.data.accessToken;
    if (!newToken) throw new Error('No new token received');

    localStorage.setItem('accessToken', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    console.log('Token refreshed successfully');
    return true;
  } catch (err) {
    // Replace optional chaining with explicit checks
    const errorData = err.response && err.response.data ? err.response.data : err.message;
    console.error('Refresh failed:', errorData);
    this.clearAuthData();
    this.$router.push('/login');
    return false;
  }
},
    setupAxiosInterceptor() {
      if (this.axiosInterceptor !== null) {
        axios.interceptors.response.eject(this.axiosInterceptor);
      }

      this.axiosInterceptor = axios.interceptors.response.use(
        response => response,
        async error => {
          const originalRequest = error.config;
          
          if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const refreshed = await this.refreshToken();
            if (refreshed) {
              originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
              return axios(originalRequest);
            }
          }
          
          return Promise.reject(error);
        }
      );
    },
    scheduleTokenRefresh() {
      if (this.refreshInterval) clearInterval(this.refreshInterval);
      
      this.refreshInterval = setInterval(async () => {
        console.log('Auto-refreshing token...');
        await this.refreshToken();
      }, 300000); // 5 minutes
    },
    saveAuthData(authData) {
      if (!authData || !authData.token || !authData.user) {
        console.error('Invalid auth data:', authData);
        throw new Error('Invalid authentication data');
      }

      localStorage.setItem('accessToken', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
      console.log('Auth data saved:', { 
        token: authData.token, 
        user: authData.user 
      });
    },
    clearAuthData() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      if (this.refreshInterval) clearInterval(this.refreshInterval);
      if (this.axiosInterceptor !== null) {
        axios.interceptors.response.eject(this.axiosInterceptor);
      }
    },
    initializeAuth() {
      const token = localStorage.getItem('accessToken');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        this.setupAxiosInterceptor();
        this.scheduleTokenRefresh();
      }
    },
    handleLoginError(err) {
      const errorMsg = (err.response && err.response.data && err.response.data.message) 
        || 'Server error';
      console.error('Login failed:', errorMsg);
      alert(`Login failed: ${errorMsg}`);
    }
  },
  computed: {
    BASE_URL() {
      return (this.$store && this.$store.state && this.$store.state.BASE_URL) || 
             window.BASE_URL || 
             'http://localhost:4000';
    }
  },
  created() {
    this.initializeAuth();
  },
  // Supprimer beforeDestroy pour éviter de supprimer le token
  // beforeDestroy() {
  //   this.clearAuthData();
  // }
};
</script>

<style>
/* Add any custom styles if needed */
</style>