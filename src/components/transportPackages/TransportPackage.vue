<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { ref, watch , computed, inject} from 'vue'
import TransportPackageDetail from "./TransportPackageDetail.vue"
import { useRouter, onBeforeRouteLeave } from 'vue-router'

const toast = useToast()
const router = useRouter()
const socket = inject('socket')

const props = defineProps({
    id: {
      type: Number,
      default: null
    }
})

const NewTransportPackage = () => {
    return {
        id: null,
        material: '', 
        orders: [],
        sensors: [],
        type: '',
    }
}


const transportPackage = ref(NewTransportPackage())

const errors = ref(null)
const confirmationLeaveDialog = ref(null)
// String with the JSON representation after loading the project (new or edit)
let originalValueStr = ''

const loadTransportPackages = async (id) => {
  originalValueStr = ''
  errors.value = null
  if (!id || (id < 0)) {
    transportPackage.value = NewTransportPackage()
    originalValueStr = JSON.stringify(transportPackage.value)
  } else {
      try {
        const response = await axios.get('transport_packages/' + id)
        transportPackage.value = response.data.data
        originalValueStr = JSON.stringify(transportPackage.value)
      } catch (error) {
        console.log(error)
      }
  }
}

const operation = computed( () => (!props.id || props.id < 0) ? 'insert' : 'update')

const save =  async () => {
  if (operation.value == 'insert') 
  {
    try{
      const response = await axios.post('transport_packages', transportPackage.value)
      console.dir(response.data)
      if(response.data.success){
        toast.success('Transport Package Created')
        console.dir(response.data)
        originalValueStr=JSON.stringify(transportPackage.value)
        router.push({name: 'TransportPackages'})
      }
      else{
        toast.error(response.data.message)
      }
    }
    catch(error){
      errors.value = error.response.data.errors
      toast.error("Validation Error")
    }
  } else {
    axios.put('transport_packages/' + props.id, transportPackage.value)
      .then((response) => {
        toast.success('Transport Package Updated')
        console.dir(response.data)
        originalValueStr=JSON.stringify(transaction.value)
        router.push({name: 'TransportPackages'})
      })
      .catch((error) => {
      if (error.response && error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error("Validation Error")
      }
        console.dir(error)
      })
  }
}

const cancel =  () => {
  router.back()
}

watch(
  () => props.id,
  (newValue) => {
    loadTransportPackages(newValue)
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
  let newValueStr = JSON.stringify(transportPackage.value)
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
  
  <transportPackage-detail
    :operationType="operation"
    :transportPackage="transportPackage"
    :errors="errors"
    @save="save"
    @cancel="cancel"
  ></transportPackage-detail>
</template>
