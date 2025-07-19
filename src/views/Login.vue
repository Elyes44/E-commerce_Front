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
import axios from 'axios'

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async handleEmailLogin() {
      try {
        const response = await axios.post(
          `${this.BASE_URL}/api/auth/login`,
          {
            email: this.email,
            password: this.password
          },
          {
            withCredentials: true
          }
        )

        console.log('Login success:', response.data)
        this.$router.push('/')
      } catch (err) {
        console.error(
          'Login failed:',
          err.response && err.response.data ? err.response.data : err.message
        )
        alert(
          'Login failed: ' +
          (err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : 'Server error')
        )
      }
    }
  },
computed: {
  BASE_URL() {
    return (this.$store && this.$store.state && this.$store.state.BASE_URL) || 
           (window.BASE_URL) || 
           'http://localhost:4000';
  }
}
}
</script>

<style>
/* Add any custom styles if needed */
</style>