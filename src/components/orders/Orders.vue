<script setup>
  import axios from 'axios'
  import { ref, computed, onMounted } from 'vue'
  import OrderTable from './OrderTable.vue'
  import {useRouter} from 'vue-router';
  import { useToast } from "vue-toastification"

  const toast = useToast()
  const router = useRouter()

  const loadOrders = () => {
    // Change later when authentication is implemented
    axios.get('orders')
      .then((response) => {
        orders.value = response.data
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const orders = ref([])
  
  onMounted (() => {
    loadOrders()
  })
</script>

<template>
  <h3 class="mt-5 mb-3">Orders</h3>
  <hr>

  <order-table
    :orders="orders"
  ></order-table>
</template>


<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 0.35rem;
}
.btn-addtask {
  margin-top: 1.85rem;
}
</style>
