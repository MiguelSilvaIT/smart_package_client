<script setup>
import { useRouter,RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useUserStore } from './stores/user'
import axios from 'axios'
import { useToast } from "vue-toastification"

const userStore = useUserStore()
const router = useRouter()

const toast = useToast()

const logout = async () => {
  if (await userStore.logout()) {
    toast.success('User has logged out of the application.')
    router.push({name: 'home'})
  } else {
    toast.error('There was a problem logging out of the application!')
  }
}

</script>


<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark sticky-top flex-md-nowrap p-0 shadow">
    <div class="container-fluid">
      <button id="buttonSidebarExpandId" class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end">
        <ul class="navbar-nav">
          <li class="nav-item">
              <i class="bi bi-person-check-fill"></i>
              Register
          </li>
          <router-link to="/auth/login" class="nav-link">
          <li class="nav-item">
              <i class="bi bi-box-arrow-in-right"></i>
              Login
          </li>
          </router-link>
          <li class="nav-item dropdown" v-show="userStore.user">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
              data-bs-toggle="dropdown" aria-expanded="false">
              <span class="avatar-text">{{ userStore.userName }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
              <li>
                <a class="dropdown-item" @click.prevent="logout">
                  <i class="bi bi-arrow-right"></i>Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div  class="container-fluid">
    <div class="row">
      <nav v-if="userStore.user"  id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
        <div v-show="userStore.user" class="position-sticky pt-3">
          <ul class="nav flex-column" >
            <li class="nav-item" >
              <router-link to="/" class="nav-link">
                <i class="bi bi-house"></i>
                Home
              </router-link>
            </li>
            <li class="nav-item" >
                <i class="bi bi-files"></i>
                  Sensors
            </li>

           <router-link to="/orders" class="nav-link">
            <li class="nav-item" >
                  <i class="bi bi-files"></i>
                    Orders
            </li>
            </router-link>
            <router-link to="/products" class="nav-link">
              <li class="nav-item" >
                    <i class="bi bi-files"></i>
                      Products
              </li>
            </router-link>
            <router-link to="/catalogProducts" class="nav-link" v-if="userStore.userType == 'Client'">
            <li class="nav-item" >
                  <i class="bi bi-files"></i>
                  Catalog Products
            </li>
            </router-link>
            <router-link to="/manageCatalogProducts" class="nav-link" v-if="userStore.userType == 'Manufacturer'">
            <li class="nav-item" >
                  <i class="bi bi-files"></i>
                  Catalog Products
            </li>
            </router-link>
            <li class="nav-item"  >
                  <i class="bi bi-files"></i>
                    Packages
            </li>
            <router-link to="/transportPackages" class="nav-link">
            <li  class="nav-item">
                  <i class="bi bi-files"></i>
                    Transport Packages   
            </li>
            </router-link>
            <li class="nav-item" >
                <i class="bi bi-bar-chart-line"></i>
                Reports
            </li>
          </ul>
        </div>
      </nav>

      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<style>
@import "./assets/dashboard.css";
#image {
  max-width: 100px;
  height: fit-content;
  
}
.avatar-img {
  margin: -1.2rem 0.8rem -2rem 0.8rem;
  width: 3.3rem;
  height: 3.3rem;
}

.avatar-text {
  line-height: 2.2rem;
  margin: 1rem 0.5rem -2rem 0;
  padding-top: 1rem;
}

.dropdown-item {
  font-size: 0.875rem;
}

.btn:focus {
  outline: none;
  box-shadow: none;
}

#sidebarMenu {
  overflow-y: auto;
}
</style>
