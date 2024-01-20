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
      console.log("teste" + response.data)
      observations.value = response.data
    })
    .catch((error) => {
      console.log(error)
    })



}


const transportPackageDetailClick = (packId) => {
  // Replace this code to navigate to the transport package detail
  router.push({ name: 'TransportPackage', params: { id: packId } })
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
  <order-detail :order="order" :errors=errors :observations = "observations"  @transportPackageDetail="transportPackageDetailClick"></order-detail>
</template>