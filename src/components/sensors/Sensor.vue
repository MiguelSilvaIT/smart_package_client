<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { ref, watch , computed} from 'vue'
import SensorDetail from "./SensorDetail.vue"
import { useRouter, onBeforeRouteLeave } from 'vue-router'

const toast = useToast()
const router = useRouter()

const props = defineProps({
    id: {
      type: Number,
      default: null
    }
})

const newSensor = () => {
    return {
      id: null,
      name: '',
      observations: [],
    }
}

const sensor = ref(newSensor())

const errors = ref(null)
const confirmationLeaveDialog = ref(null)
// String with the JSON representation after loading the project (new or edit)
let originalValueStr = ''

const loadSensor = async (id) => {
  originalValueStr = ''
  errors.value = null
  if (!id || (id < 0)) {
    sensor.value = newSensor()
    originalValueStr = JSON.stringify(sensor.value)
  } else {
      try {
        const response = await axios.get('sensors/' + id)
        sensor.value = response.data
        originalValueStr = JSON.stringify(sensor.value)
      } catch (error) {
        console.log(error)
      }
  }
}

const operation = computed( () => (!props.id || props.id < 0) ? 'insert' : 'update')


const save =  (name) => {
  if (operation.value == 'insert') {
    axios.post('sensors', {"name": name})
      .then((response) => {
        toast.success('Sensor Created')
        console.dir(response.data.data)
        originalValueStr = JSON.stringify(sensor.value)
        router.push({name:'Sensors'})
      })
      .catch((error) => {
        if (error.response && error.response.status == 422) {
          errors.value = error.response.data.errors
          toast.error("Validation Error")
        }
      })
  } else {
    axios.put('sensors/' + id, sensor.value)
      .then((response) => {
        toast.success('Sensor Updated')
        console.dir(response.data.data)
      })
      .catch((error) => {
        if (error.response && error.response.status == 422) {
          errors.value = error.response.data.errors
          toast.error("Validation Error")
        }
      })
  }
}

const cancel =  () => {
  router.back()
}

watch(
  () => props.id,
  (newValue) => {
      loadSensor(newValue)
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
  let newValueStr = JSON.stringify(sensor.value)
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

  <sensor-detail
    :operationType="operation"
    :sensor="sensor"
    :errors="errors"
    @save="save"
    @cancel="cancel"
  ></sensor-detail>
</template>
