<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
      
      <div v-if="errors.server" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ errors.server }}
      </div>

      <form @submit.prevent="handleSubmit" novalidate>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">Email</label>
          <input
            v-model="formData.email"
            type="email"
            id="email"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            :class="{ 'border-red-500 focus:ring-red-500': errors.email, 'border-gray-300 focus:ring-blue-500': !errors.email }"
            placeholder="Enter your email"
            @input="clearError('email')"
          />
          <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="displayName">Display Name</label>
          <input
            v-model="formData.displayName"
            type="text"
            id="displayName"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            :class="{ 'border-red-500 focus:ring-red-500': errors.displayName, 'border-gray-300 focus:ring-blue-500': !errors.displayName }"
            placeholder="Enter your display name"
            @input="clearError('displayName')"
          />
          <p v-if="errors.displayName" class="text-red-500 text-xs mt-1">{{ errors.displayName }}</p>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
          <input
            v-model="formData.password"
            type="password"
            id="password"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            :class="{ 'border-red-500 focus:ring-red-500': errors.password, 'border-gray-300 focus:ring-blue-500': !errors.password }"
            placeholder="Enter your password"
            @input="clearError('password')"
          />
          <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="confirmPassword">Confirm Password</label>
          <input
            v-model="formData.confirmPassword"
            type="password"
            id="confirmPassword"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
            :class="{ 'border-red-500 focus:ring-red-500': errors.confirmPassword, 'border-gray-300 focus:ring-blue-500': !errors.confirmPassword }"
            placeholder="Confirm your password"
            @input="clearError('confirmPassword')"
          />
          <p v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
        >
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <p class="mt-4 text-center text-gray-600">
        Already have an account? <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link>
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
  displayName: ''
});
const errors = ref({});
const isLoading = ref(false);
const router = useRouter();

const FIELD_LIMITS = {
  email: { min: 5, max: 254 },
  password: { min: 8, max: 128 },
  displayName: { min: 2, max: 50 }
};

const clearError = (field) => {
  errors.value[field] = '';
};

const validateForm = () => {
  const newErrors = {};

  // Email Validation
  if (!formData.value.email) {
    newErrors.email = 'Email is required';
  } else {
    if (formData.value.email.length < FIELD_LIMITS.email.min) {
      newErrors.email = `Email must be at least ${FIELD_LIMITS.email.min} characters`;
    }
    if (formData.value.email.length > FIELD_LIMITS.email.max) {
      newErrors.email = `Email cannot exceed ${FIELD_LIMITS.email.max} characters`;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
      newErrors.email = 'Invalid email format';
    }
  }

  // Password Validation
  if (!formData.value.password) {
    newErrors.password = 'Password is required';
  } else {
    const hasNumber = /\d/;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    
    if (formData.value.password.length < FIELD_LIMITS.password.min) {
      newErrors.password = `Password must be at least ${FIELD_LIMITS.password.min} characters`;
    }
    if (formData.value.password.length > FIELD_LIMITS.password.max) {
      newErrors.password = `Password cannot exceed ${FIELD_LIMITS.password.max} characters`;
    }
    if (!hasNumber.test(formData.value.password)) {
      newErrors.password = 'Must contain at least one number';
    }
    if (!hasSpecialChar.test(formData.value.password)) {
      newErrors.password = 'Must contain one special character (!@#$...)';
    }
  }

  // Confirm Password Validation
  if (formData.value.password !== formData.value.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  // Display Name Validation
  if (!formData.value.displayName?.trim()) {
    newErrors.displayName = 'Display name is required';
  } else {
    if (formData.value.displayName.length < FIELD_LIMITS.displayName.min) {
      newErrors.displayName = `Name must be at least ${FIELD_LIMITS.displayName.min} characters`;
    }
    if (formData.value.displayName.length > FIELD_LIMITS.displayName.max) {
      newErrors.displayName = `Name cannot exceed ${FIELD_LIMITS.displayName.max} characters`;
    }
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
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
        displayName: formData.value.displayName
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

<style scoped>
/* Scoped styles for Tailwind CSS are handled via classes in the template */
</style>