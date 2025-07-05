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
                    <card type="secondary" shadow
                          header-classes="bg-white pb-5"
                          body-classes="px-lg-5 py-lg-5"
                          class="border-0">
                        <template>
                            <div class="text-muted text-center mb-3">
                                <small>Sign in with</small>
                            </div>
                            <div class="btn-wrapper text-center">
                                <base-button type="neutral">
                                    <img slot="icon" src="img/icons/common/124010.png">
                                    Facebook
                                </base-button>

                                <base-button type="neutral">
                                    <img slot="icon" src="img/icons/common/google.svg">
                                    Google
                                </base-button>
                            </div>
                        </template>
                        <template>
                            <div class="text-center text-muted mb-4">
                                <small>Or sign up with credentials</small>
                            </div>
                            <form role="form" @submit.prevent="handleSubmit">
<base-input
  alternative
  class="mb-3"
  placeholder="First Name"
  addon-left-icon="ni ni-single-02"
  v-model="formData.firstName"
/>
<base-input
  alternative
  class="mb-3"
  placeholder="Last Name"
  addon-left-icon="ni ni-single-02"
  v-model="formData.lastName"
/>
<base-input
  alternative
  class="mb-3"
  placeholder="Phone Number"
  addon-left-icon="ni ni-mobile-button"
  v-model="formData.phone"
/>
<base-input
  alternative
  class="mb-3"
  placeholder="Address"
  addon-left-icon="ni ni-map-big"
  v-model="formData.address"
/>                          
<base-input
  alternative
  class="mb-3"
  placeholder="Email"
  addon-left-icon="ni ni-email-83"
  v-model="formData.email"
/>
<base-input
  alternative
  type="password"
  placeholder="Password"
  addon-left-icon="ni ni-lock-circle-open"
  v-model="formData.password"
/>

                                <base-checkbox>
                                    <span>I agree with the
                                        <a href="#">Privacy Policy</a>
                                    </span>
                                </base-checkbox>
                                <div class="text-center">
                                    <base-button type="primary" native-type="submit" class="my-4">Create account</base-button>
                                </div>
                            </form>
                        </template>
                    </card>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'

// Reactive form state
const formData = ref({
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  email: '',
  password: '',
})

const handleSubmit = async () => {
  try {
    const response = await axios.post('http://localhost:4000/api/auth/register', formData.value)
    console.log('Registration successful:', response.data)
    alert('Registration successful!')
  } catch (error) {
    // Safe fallback without optional chaining
    const errMsg = error.response && error.response.data && error.response.data.error
      ? error.response.data.error
      : 'Registration failed.'
    console.error('Registration failed:', error.response && error.response.data || error.message)
    alert(errMsg)
  }
}
</script>
<style>
</style>
