<script setup>
import axios from 'axios'
import { ref, watch, computed, onMounted } from 'vue'
import { useToast } from "vue-toastification"
import { useRouter } from "vue-router"

const router = useRouter()

const toast = useToast()

const errors = ref({})

import OrderDetail from "./OrderDetail.vue"

const order = ref({})

const observations = ref([])

const notAssociatedTransportPackages = ref([])

const  loadOrder = async (id) => {

  await axios.get('orders/' + id)
    .then((response) => {
      console.log("orderis")
      order.value = response.data
    })
    .catch((error) => {
      console.log(error)
    })

  await axios.get('observations/order/' + id)
    .then((response) => {
      observations.value = response.data
    })
    .catch((error) => {
      console.log(error)
    })

  await axios.get('orders/'+id+'/' + 'not/' + 'transportPackages')
    .then((response) => {
      notAssociatedTransportPackages.value = response.data
    })
    .catch((error) => {
      console.log(error)
    })



}




const transportPackageDetailClick = (packId , order) => {
  // Replace this code to navigate to the transport package detail
  //debug orderId
  router.push({ name: 'TransportPackage', params: {  orderId : order , id: packId} })
}

const cancel = () => {
  // Replace this code to navigate back
  loadOrder(props.id)
  router.back()

}

const props = defineProps({
  id: {
    type: Number,
    default: null
  }

})



// beforeRouteUpdate was not fired correctly
// Used this watcher instead to update the ID
watch(
  () => props.id,
  (newValue) => {
    loadOrder(newValue)
  },
  { immediate: true }
)


</script>


<template>
  <order-detail :order="order" :errors=errors :observations = "observations" :notAssociatedTransportPackages = "notAssociatedTransportPackages" @transportPackageDetail="transportPackageDetailClick"></order-detail>
</template>