<template>
  <div class="auth-container">
    <!-- Background Gradient -->
    <div class="background-gradient"></div>
    <!-- Mosaic Layer -->
    <div class="background-mosaic"></div>
    
    <!-- Centered Login Card -->
    <div class="login-card">
      <div class="logo-container">
        <svg class="logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#2C7A7B"/>
          <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" fill="white"/>
        </svg>
        <h1>Marhbe Bik bahdena</h1>
      </div>
      <form @submit.prevent="handleEmailLogin" class="login-form">
        <div class="form-group">
          <input 
            v-model="email" 
            type="email" 
            placeholder="Email address"
            required
          >
        </div>
        
        <div class="form-group">
          <input 
            v-model="password" 
            type="password" 
            placeholder="Password"
            required
          >
        </div>
        
        <button type="submit" class="btn-login">Log in</button>
      </form>

      <div class="divider">
        <span>or</span>
      </div>

      <div class="social-logins">
 <button @click="handleGoogleLogin" class="btn-social google">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.36353H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9454 17.64 9.2045Z" fill="#4285F4"/>
      <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
      <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.5931 3.68182 9C3.68182 8.4069 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.5477 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
      <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
    </svg>
    Continue with Google
  </button>
        
        <button @click="handleFacebookLogin" class="btn-social facebook">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook">
          Continue with Facebook
        </button>
      </div>

      <div class="footer-links">
        <a href="#">Forgot password?</a>
        <span>•</span>
        <a href="#">Sign up</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

const handleEmailLogin = () => {
  console.log('Email login:', email.value)
  // Add your email/password authentication logic here
}

const handleGoogleLogin = () => {
  console.log('Google login clicked')
  // Implement Google OAuth here
}

const handleFacebookLogin = () => {
  console.log('Facebook login clicked')
  // Implement Facebook OAuth here
}
</script>

<style scoped>
.auth-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #EDF7FA 0%, #ddc8e7 100%);
  z-index: 0;
}

.background-mosaic {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://svgsilh.com/svg/1801287.svg');
  background-size: 200px 200px;
  background-repeat: repeat;
  opacity: 0.20;
  filter: blur(5px); /* Subtle blur effect */
  z-index: 1;
}

.login-card {
  position: relative;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 12px;
  padding: 48px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.logo-container {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 56px;
  height: 56px;
  margin-bottom: 16px;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1A202C;
  margin: 0;
}

.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 16px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 16px;
  background-color: #FFFFFF;
  color: #1A202C;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus {
  outline: none;
  border-color: #cc82db;
  box-shadow: 0 0 0 3px rgba(44, 122, 123, 0.1);
}

.btn-login {
  width: 100%;
  padding: 16px;
  background-color: #634ce6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-login:hover {
  background-color: #2a0cd1;
}

.divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
  color: #6B7280;
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #E5E7EB;
}

.divider::before {
  margin-right: 16px;
}

.divider::after {
  margin-left: 16px;
}

.social-logins {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.btn-social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  background: rgb(226, 142, 142);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-social img {
  width: 18px;
  height: 18px;
}

.btn-social.google:hover {
  background-color: #f15135;
}

.btn-social.facebook {
  background-color: #3B82F6;
  color: white;
  border-color: #3B82F6;
}

.btn-social.facebook:hover {
  background-color: #2563EB;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #6B7280;
}

.footer-links a {
  color: #31008b;
  text-decoration: none;
  font-weight: 500;
}

.footer-links a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-card {
    padding: 32px;
    max-width: 90%;
  }
}
</style>