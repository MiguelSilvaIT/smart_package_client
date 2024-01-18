<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { ref, watch} from 'vue'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import OrderDetail from "./OrderDetail.vue"


const toast = useToast()
const router = useRouter()

const props = defineProps({
   
})

const newOrder = () => {
    return {
      ckientUsername: '',
      logisticsOperatorUsername: '',
      phone_number: '',
      status: '',
      products: '',
      transportPackages: '',
      creation_date: Date.now(),
    }
}


//const order = ref(newOrder())


const errors = ref(null)
const confirmationLeaveDialog = ref(null)
// String with the JSON representation after loading the project (new or edit)
let originalValueStr = ''

const loadOrder = async (id) => {
  originalValueStr = ''
  errors.value = null
  if (!id || (id < 0)) {
    order.value = newOrder()
  } else {
      try {
        const response = await axios.get('orders/' + id)

        order.value = response.data.data
        originalValueStr = JSON.stringify(order.value)
      } catch (error) {
        console.log(error)
      }
  }
}

//const inserting = (phone_number) => !phone_number || (phone_number < 0)
 
/*
const save = async (orderToSave) => {
  errors.value = null
  if (inserting(props.phone_number)) {
    try {
      const response = await axios.post('/orders', orderToSave)
      console.dir(response.data)
      order.value = response.data.data
      originalValueStr = JSON.stringify(order.value)
      toast.success('Order was registered successfully.')
      socket.emit('insertedUser', order.value)
      
      router.push({name: 'Login'})
    } catch (error) {
      console.log(error)
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('vCard was not registered due to validation errors!')
      } else {
        toast.error('vCard was not registered due to unknown server error!')
      }
    }
  } else {
    try {
      const response = await axios.put('orders/' + props.phone_number, orderToSave)
      order.value = response.data.data
      originalValueStr = JSON.stringify(order.value)
      toast.success('order ' + order.value.phone_number + ' was updated successfully.')
      router.push({name: 'Dashboard'})
      if (userStore.userType == 'V') {
        await userStore.loadUser()
      }
      socket.emit('updatedUser', order.value)
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('order ' + props.phone_number + ' was not updated due to validation errors!')
      } else {
        toast.error('order ' + props.phone_number + ' was not updated due to unknown server error!')
      }
    }
  }
}*/

const cancel =  () => {
  router.back()
}


watch(
  () => props.id,
  (newValue) => {
      loadOrder(newValue)
    },
  {immediate: true}  
)

let nextCallBack = null
const leaveConfirmed = () => {
  if (nextCallBack) {
    nextCallBack()
  }
}

onBeforeRouteLeave((to, from, next) => {
  nextCallBack = null
  let newValueStr = JSON.stringify(vcard.value)
  if (originalValueStr != newValueStr) {
    // Some value has changed - only leave after confirmation
    nextCallBack = next
    confirmationLeaveDialog.value.show()
  } else {
    // No value has changed, so we can leave the component without confirming
    next()
  }
})


</script>

<template>
  <confirmation-dialog
    ref="confirmationLeaveDialog"
    confirmationBtn="Discard changes and leave"
    msg="Do you really want to leave? You have unsaved changes!"
    @confirmed="leaveConfirmed"
  >
  </confirmation-dialog>
  

  <order-detail
    :order="order"
    :errors="errors"
    @save="save"
    @cancel="cancel"
  ></order-detail>
</template>
