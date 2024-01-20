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

</script>

<template>
  <h3 class="mt-5 mb-3">Sensors</h3>
  <hr>
  <div class="mx-2 mt-2  mb-4 d-flex justify-content-between">
    <Button type="button" class="border-round-xs"  @click="addSensor">
      <i class="bi bi-xs bi-plus-circle"></i>&nbsp;
      Add Sensor
    </Button>
  </div>
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

