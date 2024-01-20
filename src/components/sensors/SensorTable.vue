<script setup>
import { ref, onMounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import axios from 'axios'; 
import InputText from 'primevue/inputtext';
import 'primeicons/primeicons.css';    
import { format } from 'date-fns'
import Chart from 'primevue/chart';

const props = defineProps({
  sensors: {
    type: Array,
    default: () => [],
  },
  showName: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },
  showId: {
    type: Boolean,
    default: true,
  },

});

const toast = useToast();
const selectedSensor = ref();
const observations = ref([])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const onRowExpand = (event) => {
  loadObservations(event.data.id);
  toast.add({ severity: 'info', summary: 'Sensor Expanded', detail: event.data.name, life: 3000 });
};

const onRowCollapse = (event) => {
  toast.add({ severity: 'info', summary: 'Sensor Collapsed', detail: event.data.name, life: 3000 });
};

const loadObservations = async (sensorId) => {
  console.log("Loading observations for sensorId: ", sensorId);
  const response = await axios.get('observations')
  const filteredObservations = response.data.filter(obs => obs.sensorId === sensorId)
  console.log("Filtered observations: ", filteredObservations);
  observations.value = filteredObservations
}

const date = (timestamp) => {
  return format(new Date(timestamp), 'dd/MM/yyyy HH:mm')
}


const chartData = (observations) => {
  return {
    labels: observations.map(obs => date(obs.date)),
    datasets: [
      {
        label: 'Sensor Value',
        data: observations.map(obs => obs.value),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  }
}

</script>

<template>
  <DataTable v-model:expandedRows="selectedSensor" @rowSelect="onRowExpand" @rowUnselect="onRowCollapse"
     v-model:selection="selectedSensor" :value="sensors"
     selectionMode="multiple" dataKey="id" 
     :metaKeySelection=false paginator sortField="id" :sortOrder="1" :rows="30" >
     <template #header>
          <div class="flex justify-content-end">
              <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
              </span>
          </div>
      </template>
      <template #empty> No sensors found. </template>
      <Column v-if="showId" sortable field="id" header="Id"></Column>
      <Column v-if="showName" sortable field="name" header="Sensor Name"></Column>      
      <template #expansion="slotProps" >
        <div class="expandedDiv">
          <h5 class="ms-3">Sensor # {{ slotProps.data.id }}</h5>
          <div class="contentContainer">
            <div class="ms-1 mt-3">
              <p>
                <strong> Sensor Name:</strong> {{ slotProps.data.name }}
              </p>
              <div v-if="slotProps.data.name === 'GPS'">
                <DataTable :value="slotProps.data.observations" paginator :rows="5" tableStyle="min-width: 50rem" stripedRows >
                  <Column field="value" header="Value"></Column>
                  <Column field="date" header="Date" >
                    <template #body="{ data }">{{ new Date(data.date).toLocaleString() }}</template>
                  </Column>
                </DataTable>
              </div>
              <Chart v-else type="line" :data="chartData(slotProps.data.observations)" />
            </div>
          </div>
        </div>
      </template>
    </DataTable>
</template>

<style scoped>
button {
  margin-left: 3px;
  margin-right: 3px;
}

.img_photo {
  width: 3.2rem;
  height: 3.2rem;
}

.expandedDiv {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  min-height: 100px;
  background-color: white;
  margin: 5px;
  border-radius: 4px;
  border-bottom: 1px solid darkgray;
  padding: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08), 0 6px 6px rgba(0, 0, 0, 0.1);
}

.contentContainer{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
  /* align-items: center; */
  /* background-color: red; */
}
</style>
