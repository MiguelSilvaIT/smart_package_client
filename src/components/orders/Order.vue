<script setup>
  import axios from 'axios'
  import { ref, watch, computed, onMounted } from 'vue'
  import { useToast } from "vue-toastification"
  import {useRouter} from "vue-router"

  const router = useRouter()

  const toast = useToast()

  const errors = ref({})

  import OrderDetail from "./OrderDetail.vue"

const order = ref({})

  const loadOrder = (id) => {
   
        axios.get('orders/' + id)
          .then((response) => {
            console.log("teste" + response.data)
            order.value = response.data
          })
          .catch((error) => {
            console.log(error)
          })
      
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
    { immediate: true}
  )


</script>


<template>
  <order-detail
    :order="order"

    :errors = errors
  ></order-detail>
</template>