<script setup>
  import { ref, watch, computed,onMounted } from 'vue'
  import Dropdown from 'primevue/dropdown';
  import axios from 'axios'
  import InputText from 'primevue/inputtext';
  import Listbox from 'primevue/listbox';
import { roundToNearestMinutes } from 'date-fns';
import {useRouter} from 'vue-router';
import {useUserStore} from '../../stores/user'

  const props = defineProps({
    order: {
      type: Object,
      required: true
    },
    observations: {
      type: Array,
      default: () => [],
    },
    errors: {
      type: Object,
      default: null
    }

  })

  const emit = defineEmits(['save', 'transportPackageDetail'])
  const router = useRouter()
  const userStore = useUserStore()

  const selectedTransportPackage = ref();

  const observationBySensor = computed(() => {
    const result = {};
    props.observations.forEach(item => {
      if (!result[item.sensorType]) {
        result[item.sensorType] = [];
      }
      result[item.sensorType].push(item);
    });
    console.log(result)
    return result;
  });

  const orderTitle = computed(() => {
    console.log(props.order)
    return  'Order ' + props.order.id
  })


  const detailClick = (event) => {
    console.log(event)
    emit("transportPackageDetail", event.data.id , props.order.id);
  }

  const cancel = () => {
    router.push({ name: 'orders' })
  }

  const formatDate = (timestamp) => {
  console.log(props.observations)
    const date = new Date(timestamp);
    const options = { hour: 'numeric',
        minute: 'numeric',  month: 'short', day: 'numeric',year: 'numeric' };
    return new Intl.DateTimeFormat('pt-PT', options).format(date);
  }

  const areValuesFloat =(observations) =>{
      // Check if values can be converted to float
    const floatValues = observations.every(observation => !isNaN(parseFloat(observation.value)) &&  !observation.value.includes(','));

    console.log(floatValues)
    return floatValues
  }

  const chartData = (observations) => {
  return {
    labels: observations.map(obs => formatDate(obs.date)),
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
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-2">{{ orderTitle }}</h3>
    <hr />
    <div class="d-flex flex-wrap mt-4 justify-content-between">
      <div class="w-75 pe-4">
        <div class="flex">
            <div class="p-float-label">
              <InputText
                type="text"
                v-model="order.clientUsername"
                :class="{ 'p-invalid': errors ? errors['clientUsername'] : false }"
                readonly
              />
              <label for="dd-paymentType">Client Username</label>
              <field-error-message :errors="errors" fieldName="name"></field-error-message>
            </div>
          <div class="mb-5">
            <span class="p-float-label">
              <InputText
                type="text"
                v-model="order.creation_date"
                :class="{ 'p-invalid': errors ? errors['creation_date'] : false }"
                readonly
              />
              <label for="number-input">Creation Date</label>
              <field-error-message :errors="errors" fieldName="creation_date"></field-error-message>
            </span>
          </div>
          <div class="mb-5">
            <span class="p-float-label">
              <InputText
                type="text"
                v-model="order.status"
                :class="{ 'p-invalid': errors ? errors['status'] : false }"
                readonly
              />
              <label for="number-input">Status</label>
              <field-error-message :errors="errors" fieldName="status"></field-error-message>
            </span>
          </div>
          <div class="mb-5">
            <span class="p-float-label">
              <InputText
                type="text"
                v-model="order.logisticsOperatorUsername"
                :class="{ 'p-invalid': errors ? errors['logistic_operator_name'] : false }"
                readonly
              />
              <label for="number-input">Logistic Operator</label>
              <field-error-message :errors="errors" fieldName="logistic_operator_name"></field-error-message>
            </span>
          </div>
        </div>
         <!-- List of products -->
        <div class="mb-5" v-if="order.products && order.products.length > 0">
          <label for="number-input">Products</label>
          <span class="p-float-label" v-for="product in order.products" :key="product.id">
            <InputText
              type="text"
              v-model="product.id"
              :class="{ 'p-invalid': errors ? errors['products'] : false }"
              readonly
            />
            <field-error-message :errors="errors" fieldName="products"></field-error-message>
          </span>
        </div>
        <div v-else>
          <p>No products available.</p><br>
        </div>
        
        <div v-if="userStore.userType == 'LogisticsOperator'"> 
          <h4 class="ms-3"> Transport Packages</h4>
          <DataTable v-model:expandedRows="selectedTransportPackage" @rowSelect="detailClick"
              v-model:selection="selectedTransportPackage" :value="order.transportPackages"
              selectionMode="single" dataKey="id" v-if="userStore.userType == 'LogisticsOperator'"
              :metaKeySelection=false paginator sortField="id" :sortOrder="1" :rows="5" stripedRows>
            <template #empty> No transport packages found. </template>
            <Column sortable field="id" header="Id"></Column>
            <Column sortable field="material" header="Material"></Column>
            <Column sortable field="type" header="Package Type"></Column>
            <Column sortable field="volume" header="Max Volume"></Column>
          </DataTable>
        </div>

        <div class="mt-4" v-for="(observations, sensorType) in observationBySensor" :key="sensorType">
          <h5 class="ms-5">{{ sensorType }} Sensor</h5>
          <DataTable :value="observations" v-if="!areValuesFloat(observations)" :paginator="true" :rows="5"  :paginatorTemplate="paginatorTemplate" stripedRows>
            <Column v-if="userStore.userType == 'LogisticsOperator'" field="sensorId" header="Sensor Id" :sortable="true" ></Column>
            <Column field="value" header="Value" :sortable="true"></Column>
            <Column field="date" header="Date" :sortable="true">                
              <template #body="slotProps">{{ formatDate(slotProps.data.date) }}</template>
            </Column>
          </DataTable>
          <Chart v-else type="line" :data="chartData(observations)" />
        </div>
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-end">
      <button type="button" class="btn btn-light px-5" @click="cancel">Cancel</button>
    </div>
  </form>
</template>






<style scoped>
.total_hours {
  width: 26rem;
}
.checkCompleted {
  min-height: 2.375rem;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>
