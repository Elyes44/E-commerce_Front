<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="form-container">
      <h2 class="form-title">Sign Up</h2>

      <div v-if="errors.server" class="error-message">
        {{ errors.server }}
      </div>

      <form @submit.prevent="handleSubmit" novalidate>
        <div class="form-row">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input v-model="formData.email" type="email" id="email"
              :class="{ 'error-border': errors.email && formData.email === '' }"
              placeholder="Enter your email address" @blur="validateField('email')" @input="clearError('email')" />
            <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
          </div>
          <div class="form-group">
            <label for="displayName">Full Name</label>
            <input v-model="formData.displayName" type="text" id="displayName"
              :class="{ 'error-border': errors.displayName && formData.displayName === '' }"
              placeholder="Enter your full name" @blur="validateField('displayName')" @input="clearError('displayName')" />
            <p v-if="errors.displayName" class="error-text">{{ errors.displayName }}</p>
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input v-model="formData.phone" type="tel" id="phone"
              :class="{ 'error-border': errors.phone && formData.phone === '' }"
              placeholder="Enter your phone (e.g., +1234567890)" @blur="validateField('phone')" @input="clearError('phone')" />
            <p v-if="errors.phone" class="error-text">{{ errors.phone }}</p>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="address">Address</label>
            <textarea v-model="formData.address" id="address"
              :class="{ 'error-border': errors.address && formData.address === '' }"
              placeholder="Enter your full address" @blur="validateField('address')" @input="clearError('address')"></textarea>
            <p v-if="errors.address" class="error-text">{{ errors.address }}</p>
          </div>
          <div class="form-group" style="visibility: hidden;">
            <label> </label>
            <input disabled />
            <p> </p>
          </div>
          <div class="form-group" style="visibility: hidden;">
            <label> </label>
            <input disabled />
            <p> </p>
          </div>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="formData.password" type="password" id="password"
            :class="{ 'error-border': errors.password && formData.password === '' }"
            placeholder="Enter your password" @blur="validateField('password')" @input="clearError('password')" />
          <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input v-model="formData.confirmPassword" type="password" id="confirmPassword"
            :class="{ 'error-border': errors.confirmPassword && formData.confirmPassword === '' }"
            placeholder="Confirm your password" @blur="validateField('confirmPassword')" @input="clearError('confirmPassword')" />
          <p v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</p>
        </div>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Registering...' : 'Create Account' }}
        </button>
        <p class="forget-password">
          <a href="/forget-password" class="link">Forget Password?</a>
        </p>
      </form>

      <p class="login-link">
        Already have an account? <a href="/login" class="link">Sign In</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  phone: '',
  address: ''
});
const errors = ref({});
const isLoading = ref(false);
const router = useRouter();

const FIELD_LIMITS = {
  email: { min: 5, max: 254 },
  password: { min: 8, max: 128 },
  displayName: { min: 2, max: 50 },
  phone: { min: 10, max: 15 },
  address: { min: 5, max: 200 }
};

const clearError = (field) => {
  errors.value[field] = '';
};

const validateField = (field) => {
  const newErrors = { ...errors.value };

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

  if (field === 'displayName') {
    if (!formData.value.displayName?.trim()) {
      newErrors.displayName = 'Full name is required';
    } else if (formData.value.displayName.length < FIELD_LIMITS.displayName.min) {
      newErrors.displayName = `Name must be at least ${FIELD_LIMITS.displayName.min} characters`;
    } else if (formData.value.displayName.length > FIELD_LIMITS.displayName.max) {
      newErrors.displayName = `Name cannot exceed ${FIELD_LIMITS.displayName.max} characters`;
    } else {
      delete newErrors.displayName;
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
  const fields = ['email', 'phone', 'password', 'confirmPassword', 'displayName', 'address'];
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
        email: formData.value.email,
        password: formData.value.password,
        displayName: formData.value.displayName,
        phone: formData.value.phone,
        address: formData.value.address
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.errors || 'Registration failed');
    }

    localStorage.setItem('token', data.token);
    router.push('/dashboard');

  } catch (error) {
    errors.value.server = error.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style>
/* Global CSS styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #ffffff;
  font-family: Arial, sans-serif;
}

.form-container {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.form-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 40px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  flex: 1;
  text-align: left;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: #f7f7f7;
  transition: border-color 0.3s, box-shadow 0.3s;
  resize: vertical; /* Allows vertical resizing for textarea */
}

.form-group textarea {
  min-height: 80px; /* Default size for textarea */
}

.form-group input.error-border,
.form-group textarea.error-border {
  border-color: #e53e3e;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
}

.form-group .error-text {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
  text-align: left;
}

.error-message {
  background-color: #fef2f2;
  border-left: 4px solid #e53e3e;
  color: #742a2a;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 32px;
  text-align: left;
}

button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(to right, #3182ce, #63b3ed);
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
  margin-top: 16px;
}

button:hover:not(:disabled) {
  background: linear-gradient(to right, #2b6cb0, #4299e1);
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.forget-password {
  margin-top: 16px;
  font-size: 14px;
  color: #4a5568;
  text-align: center;
}

.forget-password .link {
  color: #3182ce;
  text-decoration: none;
  font-weight: 500;
}

.forget-password .link:hover {
  text-decoration: underline;
}

.login-link {
  margin-top: 32px;
  font-size: 14px;
  color: #4a5568;
}

.login-link .link {
  color: #3182ce;
  text-decoration: none;
  font-weight: 500;
}

.login-link .link:hover {
  text-decoration: underline;
}
</style>