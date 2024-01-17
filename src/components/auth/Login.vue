<script setup>

  import axios from 'axios'
  import { useToast } from "vue-toastification"
  import { useRouter } from 'vue-router'
  import { ref } from 'vue'
  import InputText from 'primevue/inputtext'
  import { useUserStore } from '../../stores/user'


  const toast = useToast()
  const router = useRouter()
  const userStore = useUserStore()
  const credentials = ref({
    username: '',
    password: ''
  })
  const errors = ref(null)


  const emit = defineEmits(['auth/login'])

  const login = async () => {
    if (await userStore.login(credentials.value)) {
      toast.success('User ' + userStore.user.name + ' has entered the application.')
      emit('auth/login')
      router.push({ name: 'home' })

    } else {
      credentials.value.password = ''
    }
  }

</script>
<template>
  <div class="login-container">
    <img src="..\icons\logo.png" alt="Logo" class="login-logo" />
    <div class="card login-card">
      <h3 class="mt-2 mb-5">Login</h3>
      <form
        class="row g-3 needs-validation"
        novalidate
        @submit.prevent="login"
      >
        <div class="mb-5">
          <span class="p-float-label">
            <InputText type="text" v-model="credentials.username" 
                    :class="{ 'is-invalid': errors ? errors['username'] : false }"/>
            <label for="number-input">Username</label>
            <field-error-message :errors="errors" fieldName="username"></field-error-message>
          </span>
        </div>

        <div class="mb-5">
          <span class="p-float-label">
            <InputText type="password" v-model="credentials.password" 
                    :class="{ 'is-invalid': errors ? errors['password'] : false }"/>
            <label for="number-input">Password</label>
            <field-error-message :errors="errors" fieldName="password"></field-error-message>
          </span>
        </div>
      </form>
    
      <div class="mb-3 d-flex justify-content-center">
        <button
          type="button"
          class="btn btn-dark px-5"
          @click="login"
        >Login</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-logo {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
  margin-top: 10px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border: 2px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}
</style>

