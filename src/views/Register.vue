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

    <!-- ✅ Success popup -->
    <div v-if="showSuccessPopup" class="popup-overlay">
      <div class="popup-card">
        <div class="checkmark-circle">
          <div class="checkmark"></div>
        </div>
        <p class="success-message">Account created successfully!</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const formData = ref({
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  email: '',
  password: '',
})

const showSuccessPopup = ref(false)

const handleSubmit = async () => {
  try {
    const response = await axios.post('http://localhost:4000/api/auth/register', formData.value)
    console.log('Registration successful:', response.data)
    showSuccessPopup.value = true
    setTimeout(() => {
      showSuccessPopup.value = false
    }, 2000)
  } catch (error) {
    const errMsg = error.response && error.response.data && error.response.data.error
      ? error.response.data.error
      : 'Registration failed.'
    console.error('Registration failed:', error.response && error.response.data || error.message)
    alert(errMsg)
  }
}
</script>

<style>
/* ✅ Success Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.popup-card {
  background: white;
  padding: 30px 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 0 15px rgba(0,0,0,0.2);
  animation: fadeIn 0.3s ease-out;
}

.checkmark-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #4caf50;
  position: relative;
  margin: 0 auto 15px;
  animation: pop 0.4s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkmark {
  width: 25px;
  height: 50px;
  border-right: 5px solid white;
  border-bottom: 5px solid white;
  transform: rotate(45deg);
  animation: draw 0.4s ease-in-out;
}

.success-message {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

@keyframes pop {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes draw {
  0% { width: 0; height: 0; }
  100% { width: 25px; height: 50px; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
