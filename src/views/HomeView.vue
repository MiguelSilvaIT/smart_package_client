<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();

</script>

<template>
  <div class="container">
    <div class="jumbotron mt-5">
      <h1 class="display-4">Bem-vindo ao SmartPackage!</h1>
      <p class="lead">Ajudamos você a gerenciar seus pacotes de forma inteligente e eficiente.</p>
      <hr class="my-4">
      <p>Explore nossos recursos e descubra como podemos facilitar sua vida.</p>
      <p v-if="!userStore.user" class="lead">
        <router-link to="/auth/login" class="btn btn-primary btn-lg">Explore agora</router-link>
      </p>
    </div>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
.jumbotron {
  background-color: #f8f9fa;
  text-align: center;
  padding: 30px;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15); /* Adiciona uma sombra */
}
.container {
  max-width: 960px;
  margin: 100px;
  padding: 10px;
} 
</style>
