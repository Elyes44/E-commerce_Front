<template>
  <section class="section section-shaped section-lg my-0">
    <div class="shape shape-style-1 bg-gradient-default">
      <span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span>
    </div>

    <div class="container pt-lg-md">
      <div class="row justify-content-center">
        <div class="col-lg-5">
          <card type="secondary" shadow header-classes="bg-white pb-5" body-classes="px-lg-5 py-lg-5" class="border-0">


            <template>
              <div class="text-center text-muted mb-4">
                <small> Good idea to join us !</small>
              </div>

              <form role="form" @submit.prevent="handleSubmit">
                <base-input
                  alternative class="mb-3" placeholder="First Name"
                  addon-left-icon="ni ni-single-02"
                  v-model="formData.firstName"
                  :class="{ 'is-invalid': errors.firstName }"
                />
                <p class="text-danger" v-if="errors.firstName">{{ errors.firstName }}</p>

                <base-input
                  alternative class="mb-3" placeholder="Last Name"
                  addon-left-icon="ni ni-single-02"
                  v-model="formData.lastName"
                  :class="{ 'is-invalid': errors.lastName }"
                />
                <p class="text-danger" v-if="errors.lastName">{{ errors.lastName }}</p>

                <div class="d-flex mb-3">
                  <select v-model="formData.phoneCode" class="form-control w-25 me-2">
                    <option value="+216">🇹🇳 +216</option>
                    <option value="+33">🇫🇷 +33</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>
                  <base-input
                    alternative placeholder="Phone Number"
                    addon-left-icon="ni ni-mobile-button"
                    v-model="formData.phoneNumber"
                    :class="{ 'is-invalid': errors.phoneNumber }"
                  />
                </div>
                <p class="text-danger" v-if="errors.phoneNumber">{{ errors.phoneNumber }}</p>

                <base-input
                  alternative class="mb-3" placeholder="Email"
                  addon-left-icon="ni ni-email-83"
                  v-model="formData.email"
                  :class="{ 'is-invalid': errors.email }"
                />
                <p class="text-danger" v-if="errors.email">{{ errors.email }}</p>

                <base-input
                  alternative type="password" placeholder="Password"
                  addon-left-icon="ni ni-lock-circle-open"
                  v-model="formData.password"
                  :class="{ 'is-invalid': errors.password }"
                />

                <p class="text-danger" v-if="errors.password">{{ errors.password }}</p>

                <!-- Password Strength Checker -->
                <div class="password-checker mt-2">
                  <p :class="{'text-success': passwordStrength.hasUppercase, 'text-danger': !passwordStrength.hasUppercase}">
                    {{ passwordStrength.hasUppercase ? '✓' : '✗' }} Contains uppercase letter
                  </p>
                  <p :class="{'text-success': passwordStrength.hasNumber, 'text-danger': !passwordStrength.hasNumber}">
                    {{ passwordStrength.hasNumber ? '✓' : '✗' }} Contains a number
                  </p>
                  <p :class="{'text-success': passwordStrength.hasSpecial, 'text-danger': !passwordStrength.hasSpecial}">
                    {{ passwordStrength.hasSpecial ? '✓' : '✗' }} Contains a special character
                  </p>
                  <p :class="{'text-success': passwordStrength.hasMinLength, 'text-danger': !passwordStrength.hasMinLength}">
                    {{ passwordStrength.hasMinLength ? '✓' : '✗' }} At least 6 characters
                  </p>
                  
                </div>

                <base-checkbox v-model="formData.agreed">
                  <span>I agree with the <a href="#">Privacy Policy</a></span>
                </base-checkbox>
                <p class="text-danger" v-if="errors.agreed">{{ errors.agreed }}</p>

                <div class="text-center">
                  <base-button type="primary" native-type="submit" class="my-4">Create account</base-button>
                </div>
              </form>
            </template>
          </card>
        </div>
      </div>
    </div>

    <!-- Success Popup -->
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
import { ref, watch } from 'vue'
import axios from 'axios'

const formData = ref({
  firstName: '',
  lastName: '',
  phoneCode: '+216',
  phoneNumber: '',
  address: '',
  email: '',
  password: '',
  agreed: false
})

const errors = ref({})
const showSuccessPopup = ref(false)

const passwordStrength = ref({
  hasUppercase: false,
  hasNumber: false,
  hasSpecial: false,
  hasMinLength: false
})

// Real-time password checker
watch(() => formData.value.password, (pwd) => {
  passwordStrength.value.hasUppercase = /[A-Z]/.test(pwd)
  passwordStrength.value.hasNumber = /\d/.test(pwd)
  passwordStrength.value.hasSpecial = /[\W_]/.test(pwd)
  passwordStrength.value.hasMinLength = pwd.length >= 6
})

const validateForm = () => {
  errors.value = {}

  if (formData.value.firstName.length < 3 || formData.value.firstName.length > 100)
    errors.value.firstName = 'First name must be between 3 and 100 characters'

  if (formData.value.lastName.length < 3 || formData.value.lastName.length > 100)
    errors.value.lastName = 'Last name must be between 3 and 100 characters'

  const phoneRegex = /^[0-9]{6,10}$/
  if (!phoneRegex.test(formData.value.phoneNumber))
    errors.value.phoneNumber = 'Phone number must be 6 to 10 digits'

  if (!formData.value.email.includes('@'))
    errors.value.email = 'Email must contain "@"'

  const password = formData.value.password
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/
  if (!passwordRegex.test(password))
    errors.value.password = 'Password must have 1 uppercase, 1 number, 1 special character'

  if (!formData.value.agreed)
    errors.value.agreed = 'You must agree to the Privacy Policy'

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    await axios.post('http://localhost:4000/api/auth/register', {
      ...formData.value,
      phone: `${formData.value.phoneCode}${formData.value.phoneNumber}`
    })

    showSuccessPopup.value = true
    setTimeout(() => {
      showSuccessPopup.value = false
    }, 2000)
  } catch (error) {
    let errMsg = 'Registration failed.'
    if (error.response && error.response.data && error.response.data.error) {
      errMsg = error.response.data.error
    }
    alert(errMsg)
  }
}
</script>

<style>
.is-invalid {
  border: 1px solid red !important;
}
.text-danger {
  color: red;
  font-size: 0.85rem;
  margin-top: -8px;
  margin-bottom: 10px;
}
.text-success {
  color: green;
  font-size: 0.85rem;
}
.password-checker p {
  margin: 0;
}
.d-flex {
  display: flex;
}
.me-2 {
  margin-right: 0.5rem;
}
.w-25 {
  width: 25%;
}

/* Success Popup */
.popup-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
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