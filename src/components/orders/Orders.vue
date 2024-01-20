<script setup>
  import axios from 'axios'
  import { ref, computed, onMounted } from 'vue'
  import OrderTable from "./OrderTable.vue"

  import {useRouter} from 'vue-router';
  import {useUserStore} from '../../stores/user'

const router = useRouter()


  const orders = ref([])
  const userStore = useUserStore()

  const loadOrders = async() => {
    // Change later when authentication is implemented
    if(userStore.userType == 'Client'){
      await axios.post('orders/my', userStore.user)
      .then((response) => { 
        orders.value = response.data
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
      return;
    }
    await axios.get('orders/')
      .then((response) => {
        orders.value = response.data
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  
  const props = defineProps({
    ordersTitle: {
      type: String,
      default: 'Orders'
    },
    onlyCurrentOrders: {
      type: Boolean,
      default: false
    }
  })


  const showDetails = (order) => {
    
    router.push({ name: 'Order', params: { id: order.id } })
}



  
  onMounted (() => {
    loadOrders()
  })
</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">{{ ordersTitle }}</h3>
    </div>
  </div>
  <hr>

  <div class="mx-2 mt-2">
    <button
      type="button"
      class="btn btn-success px-4 btn-addorder"
      @click="addOrder"
    >
      <i class="bi bi-xs bi-plus-circle"></i>&nbsp; Add Order
    </button>
  </div>

  <order-table
    :orders="orders"
    :showId="true"
    :showClient="true"
    :showCreationDate="true"
    :showStatus="true"
    :showLogisticOperatorName="true"
    :showDetailsButton="true"
    @detail="showDetails"
  ></order-table>
</template>


<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 0.35rem;
}
.btn-addorder {
  margin-top: 1.85rem;
}
</style>
