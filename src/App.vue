<script setup>
import { useRouter,RouterLink, RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'

import axios from 'axios'
import { useToast } from "vue-toastification"


const router = useRouter()

const toast = useToast()


/*
const logout = async () => {
  if (await userStore.logout()) {
    toast.success('User has logged out of the application.')
    clickMenuOption()
    router.push({name: 'home'})
  } else {
    toast.error('There was a problem logging out of the application!')
  }
}*/

const clickMenuOption = () => {
  const domReference = document.getElementById('buttonSidebarExpandId')
  if (domReference) {
    if (window.getComputedStyle(domReference).display !== "none") {
      domReference.click()
    }
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
            <router-link class="nav-link" :class="{ active: $route.name === 'NewVcard'}" :to="{ name: 'NewVcard' }" @click="clickMenuOption">
              <i class="bi bi-person-check-fill"></i>
              Register
            </router-link >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" :class="{ active: $route.name === 'Login' }" 
                        :to="{ name: 'Login' }" @click="clickMenuOption">
              <i class="bi bi-box-arrow-in-right"></i>
              Login
            </router-link>
          </li>
          <li class="nav-item dropdown" >
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button"
              data-bs-toggle="dropdown" aria-expanded="false">
              <img class="rounded-circle z-depth-0 avatar-img" alt="avatar image">
              <span class="avatar-text"> XXX </span>
            </a>  
            <!-- only show dropdown when userStore.userId != null -->
            
            <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
              <li >
                <router-link class="dropdown-item"></router-link>
                  <i class="bi bi-person-square"></i>
                  Profile
              </li>
              <li >
                <router-link class="dropdown-item"></router-link>
                            <i class="bi bi-person-square"></i>
                  Profile
              </li>
              <li>
                <router-link></router-link>
                  <i class="bi bi-key-fill"></i>
                  Change Password
              </li>
              <li >
                <router-link ></router-link>
                <i class="bi bi-123"></i>
                  Change Confirmation Code
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
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

  <div class="container-fluid">
    <div class="row">
      <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
        <div class="position-sticky pt-3">
          <ul class="nav flex-column" >
            <li class="nav-item" >
              <router-link class="nav-link" :class="{ active: $route.name === 'Dashboard' }" 
                          :to="{ name: 'Dashboard' }" @click="clickMenuOption"> 
                <i class="bi bi-house"></i>
                Dashboard
              </router-link>
            </li>
            <li class="nav-item" >
                <router-link ></router-link>
                  <i class="bi bi-files"></i>
                    Categories
            </li>

           
            <li class="nav-item" >
                <router-link ></router-link>
                  <i class="bi bi-files"></i>
                    Vcards
            </li>

            <li class="nav-item"  >
                <router-link ></router-link>
                  <i class="bi bi-files"></i>
                    Administrators
            </li>
            <li  class="nav-item">
                <router-link ></router-link>
                  <i class="bi bi-files"></i>
                    Transactions
            </li>
            <li class="nav-item">
                <router-link ></router-link>
                  <i class="bi bi-files"></i>
                    Transactions
               
            </li>
            <li class="nav-item" >
              <router-link ></router-link>
                <i class="bi bi-bar-chart-line"></i>
                Reports
            </li>
            
            <li class="nav-item" >
              <router-link ></router-link>
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
