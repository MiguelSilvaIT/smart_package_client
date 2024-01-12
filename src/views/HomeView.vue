<script setup>
  import WebSocketTester from '/src/components/WebSocketTester.vue';
</script>

<template>
  <div class="container">
    <h1> DAE 2023/24</h1>
    <WebSocketTester />
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
</style>
