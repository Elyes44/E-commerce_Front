<template>
  <div class="registration-page">
    <div class="registration-container">
      <!-- Left Side: Welcome Content -->
      <div class="welcome-section">
        <div class="welcome-content">
          <h1 class="welcome-title">Welcome to Our Platform</h1>
          <div class="welcome-text">
            <p>Join our growing community of users who are transforming the way they work and connect.</p>
            
            <p>When you register, you'll get access to:</p>
            <ul class="benefits-list">
              <li>Personalized dashboard tailored to your needs</li>
              <li>Secure cloud storage for your documents</li>
              <li>Priority customer support 24/7</li>
              <li>Exclusive member-only features</li>
            </ul>
            
            <p>Our platform is designed with simplicity and efficiency in mind, helping you achieve more with less effort.</p>
            
            <p class="call-to-action">Sign up now and take the first step toward a more productive future!</p>
          </div>
        </div>
      </div>

      <!-- Right Side: Form Card -->
      <div class="form-section">
        <div class="form-card">
          <h2 class="form-title">Create Your Account</h2>
          <form @submit.prevent="handleSubmit" novalidate>
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input 
                  v-model="formData.firstName" 
                  @blur="validateField('firstName')"
                  @input="clearError('firstName')"
                  type="text" 
                  id="firstName" 
                  placeholder="John"
                  :class="{ 'error-input': errors.firstName }"
                />
                <span v-if="errors.firstName" class="error-message">{{ errors.firstName }}</span>
              </div>
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input 
                  v-model="formData.lastName" 
                  @blur="validateField('lastName')"
                  @input="clearError('lastName')"
                  type="text" 
                  id="lastName" 
                  placeholder="Doe"
                  :class="{ 'error-input': errors.lastName }"
                />
                <span v-if="errors.lastName" class="error-message">{{ errors.lastName }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="email">Email Address</label>
              <input 
                v-model="formData.email" 
                @blur="validateField('email')"
                @input="clearError('email')"
                type="email" 
                id="email" 
                placeholder="john.doe@example.com"
                :class="{ 'error-input': errors.email }"
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="phone">Phone Number</label>
                <input 
                  v-model="formData.phone" 
                  @blur="validateField('phone')"
                  @input="clearError('phone')"
                  type="tel" 
                  id="phone" 
                  placeholder="+1 (555) 123-4567"
                  :class="{ 'error-input': errors.phone }"
                />
                <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
              </div>
              <div class="form-group">
                <label for="address">Address</label>
                <input 
                  v-model="formData.address" 
                  @blur="validateField('address')"
                  @input="clearError('address')"
                  type="text" 
                  id="address" 
                  placeholder="123 Main St"
                  :class="{ 'error-input': errors.address }"
                />
                <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="password">Password</label>
                <input 
                  v-model="formData.password" 
                  @blur="validateField('password')"
                  @input="clearError('password')"
                  type="password" 
                  id="password" 
                  placeholder="••••••••"
                  :class="{ 'error-input': errors.password }"
                />
                <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
              </div>
              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input 
                  v-model="formData.confirmPassword" 
                  @blur="validateField('confirmPassword')"
                  @input="clearError('confirmPassword')"
                  type="password" 
                  id="confirmPassword" 
                  placeholder="••••••••"
                  :class="{ 'error-input': errors.confirmPassword }"
                />
                <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
              </div>
            </div>

            <button type="submit" :disabled="isLoading" class="sign-up-button">
              <span v-if="isLoading">Registering...</span>
              <span v-else>Create Account</span>
            </button>
            
            <div class="login-prompt">
              <span>Have an account?</span> <a href="/login" class="link">Sign In</a>
            </div>

            <div v-if="errors.server" class="server-error">
              {{ errors.server }}
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Popup -->
    <div v-if="showSuccessPopup" class="success-popup-overlay" @click.self="showSuccessPopup = false">
      <div class="success-popup">
        <div class="success-animation">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <p class="success-message">Registration successful!</p>
        <a href="/login" class="login-button">Sign In</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  address: ''
});

const errors = ref({});
const isLoading = ref(false);
const showSuccessPopup = ref(false);
const router = useRouter();

const FIELD_LIMITS = {
  firstName: { min: 2, max: 50 },
  lastName: { min: 2, max: 50 },
  email: { min: 5, max: 254 },
  password: { min: 8, max: 128 },
  phone: { min: 10, max: 15 },
  address: { min: 5, max: 200 }
};

const clearError = (field) => {
  if (errors.value[field]) {
    errors.value[field] = '';
  }
};

const validateField = (field) => {
  const newErrors = { ...errors.value };

  if (field === 'firstName') {
    if (!formData.value.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.value.firstName.length < FIELD_LIMITS.firstName.min) {
      newErrors.firstName = `First name must be at least ${FIELD_LIMITS.firstName.min} characters`;
    } else if (formData.value.firstName.length > FIELD_LIMITS.firstName.max) {
      newErrors.firstName = `First name cannot exceed ${FIELD_LIMITS.firstName.max} characters`;
    } else {
      delete newErrors.firstName;
    }
  }

  if (field === 'lastName') {
    if (!formData.value.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.value.lastName.length < FIELD_LIMITS.lastName.min) {
      newErrors.lastName = `Last name must be at least ${FIELD_LIMITS.lastName.min} characters`;
    } else if (formData.value.lastName.length > FIELD_LIMITS.lastName.max) {
      newErrors.lastName = `Last name cannot exceed ${FIELD_LIMITS.lastName.max} characters`;
    } else {
      delete newErrors.lastName;
    }
  }

  if (field === 'email') {
    if (!formData.value.email) {
      newErrors.email = 'Email is required';
    } else if (formData.value.email.length < FIELD_LIMITS.email.min) {
      newErrors.email = `Email must be at least ${FIELD_LIMITS.email.min} characters`;
    } else if (formData.value.email.length > FIELD_LIMITS.email.max) {
      newErrors.email = `Email cannot exceed ${FIELD_LIMITS.email.max} characters`;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
      newErrors.email = 'Invalid email format';
    } else {
      delete newErrors.email;
    }
  }

  if (field === 'phone') {
    if (!formData.value.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{8,15}$/.test(formData.value.phone)) {
      newErrors.phone = 'Invalid phone number';
    } else {
      delete newErrors.phone;
    }
  }

  if (field === 'password') {
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    if (!formData.value.password) {
      newErrors.password = 'Password is required';
    } else if (formData.value.password.length < FIELD_LIMITS.password.min) {
      newErrors.password = `Password must be at least ${FIELD_LIMITS.password.min} characters`;
    } else if (formData.value.password.length > FIELD_LIMITS.password.max) {
      newErrors.password = `Password cannot exceed ${FIELD_LIMITS.password.max} characters`;
    } else if (!hasNumber.test(formData.value.password)) {
      newErrors.password = 'Must contain at least one number';
    } else if (!hasSpecialChar.test(formData.value.password)) {
      newErrors.password = 'Must contain one special character (!@#$...)';
    } else {
      delete newErrors.password;
    }
  }

  if (field === 'confirmPassword') {
    if (formData.value.password !== formData.value.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    } else {
      delete newErrors.confirmPassword;
    }
  }

  if (field === 'address') {
    if (!formData.value.address?.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.value.address.length < FIELD_LIMITS.address.min) {
      newErrors.address = `Address must be at least ${FIELD_LIMITS.address.min} characters`;
    } else if (formData.value.address.length > FIELD_LIMITS.address.max) {
      newErrors.address = `Address cannot exceed ${FIELD_LIMITS.address.max} characters`;
    } else {
      delete newErrors.address;
    }
  }

  errors.value = newErrors;
};

const validateForm = () => {
  const fields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword', 'address'];
  fields.forEach(validateField);
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    const response = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email,
        password: formData.value.password,
        phone: formData.value.phone,
        address: formData.value.address
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.errors || 'Registration failed');
    }

    // Show success popup
    showSuccessPopup.value = true;

  } catch (error) {
    errors.value.server = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style>
/* Reset all margins and padding for the entire page */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: #ffffff !important;
  overflow-x: hidden; /* Prevents horizontal scroll */
}
</style>

<style scoped>
/* Root container that covers the ENTIRE page */
.registration-page {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  overflow: auto;
}

/* Main content container */
.registration-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #ffffff;
}

/* Welcome section (left side) */
.welcome-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #ffffff;
}

.welcome-content {
  max-width: 500px;
  padding: 1.5rem;
}

.welcome-title {
  font-size: 2rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.welcome-text {
  color: #4a5568;
  line-height: 1.6;
  font-size: 1.0625rem;
}

.benefits-list {
  margin: 1.25rem 0;
  padding-left: 1.5rem;
  list-style-type: none;
}

.benefits-list li {
  margin-bottom: 0.75rem;
  position: relative;
}

.benefits-list li:before {
  content: "✓";
  position: absolute;
  left: -1.5rem;
  color: #2b6cb0;
  font-weight: bold;
}

.call-to-action {
  font-weight: 600;
  color: #2b6cb0;
  margin-top: 1.5rem;
}

/* Form section (right side) */
.form-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #ffffff;
}

.form-card {
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.form-title {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-align: center;
}

.form-row {
  display: flex;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.form-group {
  flex: 1;
  margin-bottom: 0.5rem;
  position: relative;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9375rem;
  color: #1a202c;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.form-group input.error-input {
  border-color: #e53e3e;
}

.form-group input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.16);
}

.error-message {
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

.server-error {
  color: #e53e3e;
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
}

.sign-up-button {
  width: 100%;
  padding: 0.875rem;
  background-color: #2b6cb0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s ease;
}

.sign-up-button:hover:not(:disabled) {
  background-color: #2c5282;
}

.sign-up-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-prompt {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.875rem;
}

.login-prompt span {
  color: #4a5568;
}

.link {
  color: #2b6cb0;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

/* Success Popup Styles */
.success-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.success-popup {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
}

.success-animation {
  margin-bottom: 1.5rem;
}

.checkmark {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #4bb71b;
  stroke-miterlimit: 10;
  margin: 0 auto;
  animation: fill 0.4s ease-in-out 0.4s forwards, scale 0.3s ease-in-out 0.9s both;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #4bb71b;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

.success-message {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
}

.login-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #2b6cb0;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.login-button:hover {
  background-color: #2c5282;
}

/* Animations */
@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0 0 0 100px rgba(75, 183, 27, 0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .registration-container {
    flex-direction: column;
  }
  
  .welcome-section,
  .form-section {
    padding: 1.5rem;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .welcome-content {
    text-align: center;
  }
  
  .benefits-list {
    text-align: left;
    display: inline-block;
  }
}
</style>