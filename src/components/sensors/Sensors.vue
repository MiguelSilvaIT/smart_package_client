<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import SensorTable from "./SensorTable.vue"
import { useToast } from "vue-toastification"

import Button from 'primevue/button'
import { add } from 'date-fns'

const router = useRouter()
const sensors = ref([])
const toast = useToast()

const loadSensors = async () => {
    try{
        const response = await axios.get('sensors')
        sensors.value = response.data
        console.log(response.data)
    }
    catch(error){
        clearSensors()
        throw error
    }
}

const editSensor = (sensor) => {
  router.push({ name: 'Sensor', params: { id: sensor.id } })
}

const addSensor = () => {
  router.push({ name: 'NewSensor' })
}

onMounted(() => {
  loadSensors()
})
const sensorType = ref(null)
const sensorName = ref(null)

const saveSensor = async () => {
  axios.post('sensors', {"name": sensorName.value,"sensorType": sensorType.value})
      .then((response) => {
        toast.success('Sensor Created')
        loadSensors()
      })
      .catch((error) => {
        if (error.response && error.response.status == 422) {
          errors.value = error.response.data.errors
          toast.error("Validation Error")
        }
      })
}

const sensorTypes = ([
  { name: 'Temperature', value: 'TEMPERATURE' },
  { name: 'Humidity ', value: 'HUMIDITY' },
  { name: 'Pressure', value: 'PRESSURE' },
  { name: 'Light', value: 'LIGHT' },
  { name: 'Motion', value: 'MOTION' },
  { name: 'Smoke', value: 'SMOKE' },
  { name: 'Gas', value: 'GAS' },
  { name: 'Vibration', value: 'VIBRATION' },
  { name: 'Magnetic', value: 'MAGNETIC' },
  { name: 'Weight', value: 'WEIGHT' },
  { name: 'Sound', value: 'SOUND' },
  { name: 'CO2', value: 'CO2' },
  { name: 'UV', value: 'UV' },
  { name: 'Location', value: 'LOCATION' },
  { name: 'Other', value: 'OTHER' },
  // Add more materials as needed
])

</script>

<template>
  <h3 class="mt-5 mb-3">Sensors</h3>
  <hr>
  <form class="col needs-validation" @submit.prevent="saveSensor">
      <div class="flex">
        <div class="mb-5" style="width: 45%;">
          <span class="p-float-label">
            <InputText type="text" v-model="sensorName"/>
            <label>Name</label>
          </span>
        </div>
        <div class = " ms-2 mb-5" style="width: 45%;">
            <span class="p-float-label">
            <Dropdown v-model="sensorType" :options="sensorTypes" optionLabel="name" optionValue="value"/>
            
            <label> Sensor Type</label>
            </span>
        </div>
      </div>  

          <div class="g-3 mb-4 d-flex justify-content-end ">
            <Button label="Create Sensor" type="submit" class="mr-5" ></Button>
        </div>
    </form>
  <sensor-table :sensors="sensors" @edit="editSensor"></sensor-table>
</template>

<style scoped>
.filter-div {
  min-width: 12rem;
}

.total-filtro {
  margin-top: 2.3rem;
}

.small-select {
  width: 200px; /* Ajuste este valor conforme necessário */
  
}
</style>

