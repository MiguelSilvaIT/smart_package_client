<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import Dropdown from 'primevue/dropdown';
import axios from 'axios'
import InputText from 'primevue/inputtext';
import Listbox from 'primevue/listbox';
import { useRouter } from "vue-router"

const router = useRouter()



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
  notAssociatedTransportPackages: {
    type: Array,
    default: () => [],
  },
  errors: {
    type: Object,
    default: null
  }

})

const emit = defineEmits(['save', 'cancel', 'transportPackageDetail'])



console.log("not associated transport packages --> ", props.notAssociatedTransportPackages)


const allTransportPackages = ref([])

const newStatus = ref('')

const addTransportPackageToOrder = async (pkId, orderId) => {
  await axios.get("transport_packages/" + pkId + "/orders/" + orderId)
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })

    window.location.reload()
}

//array with status options
const statusOptions = computed(() => {
  return ['PENDING', 'PROCESSING', 'ON_GOING' , 'DELIVERED' , 'CANCELED']
})



const uniqueSensorNames = computed(() => [...new Set(props.observations.map(item => item.sensorName))]);
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
  return 'Order ' + props.order.id
})


const detailClick = (packId, orderId) => {
  emit("transportPackageDetail", packId, orderId);

}
  const detailClick = (event) => {
    console.log(event)
    emit("transportPackageDetail", event.data.id , props.order.id);
  }

const cancel = () => {
  emit('cancel', editingOrder.value)
}

const alterStatus = async () => {

  console.log("new status --> ", newStatus.value)
  await axios.patch("orders/" + props.order.id , {status : newStatus.value})
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
    window.location.reload()

}

//ao alterar a seleção do dropdown, fazer um post request

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
        <div class="col mb-5 ms-xs-3">
          <div class="p-float-label">
            <InputText type="text" v-model="order.clientUsername"
              :class="{ 'p-invalid': errors ? errors['clientUsername'] : false }" readonly />
            <label for="dd-paymentType">Client Username</label>
            <field-error-message :errors="errors" fieldName="name"></field-error-message>
          </div>
        </div>
        <div class="mb-5">
          <span class="p-float-label">
            <InputText type="text" v-model="order.creation_date"
              :class="{ 'p-invalid': errors ? errors['creation_date'] : false }" readonly />
            <label for="number-input">Creation Date</label>
            <field-error-message :errors="errors" fieldName="creation_date"></field-error-message>
          </span>
        </div>
        <div class="mb-5">
          <span class="p-float-label">
            <InputText type="text" v-model="order.status" :class="{ 'p-invalid': errors ? errors['status'] : false }"
              readonly />
            <label for="number-input">Actual Status</label>
            <field-error-message :errors="errors" fieldName="status"></field-error-message>
          </span>
        </div>
        <!-- Select dropdown box with status -->
        <div class="mb-5">
          <label for="dd-status">Select <b>NEW</b> Status</label>
          <Dropdown v-model="newStatus" :options="statusOptions"
            :class="{ 'p-invalid': errors ? errors['status'] : false }" />
            <button type="button" class="btn btn-light px-5" @click="alterStatus()">Update Status</button>
          <field-error-message :errors="errors" fieldName="status"></field-error-message>
          
        </div>        
        <div class="mb-5">
          <span class="p-float-label">
            <InputText type="text" v-model="order.logisticsOperatorUsername"
              :class="{ 'p-invalid': errors ? errors['logistic_operator_name'] : false }" readonly />
            <label for="number-input">Logistic Operator</label>
            <field-error-message :errors="errors" fieldName="logistic_operator_name"></field-error-message>
          </span>
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
            <InputText type="text" v-model="product.id" :class="{ 'p-invalid': errors ? errors['products'] : false }"
              readonly />
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
        <!-- List of transport packages -->
        <div class="mb-5">
          <span class="p-float-label" v-if="order.transportPackages && order.transportPackages.length > 0">
            <InputText type="text" v-for="transportPackage in order.transportPackages" v-model="transportPackage.id"
              :class="{ 'p-invalid': errors ? errors['transportPackages'] : false }" readonly
              @click="detailClick(transportPackage.id, props.order.id)" />
            <label for="number-input">Transport Packages(click for more details)</label>
            <field-error-message :errors="errors" fieldName="transportPackages"></field-error-message>
          </span>
          <div v-else>
            <p>No transport packages available.</p><br>
          </div>
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
        <!-- Table with all transport packages not associated-->
        <h2>Transport Packages Not Associated</h2>
        <div class="mb-5" >
          <table>
            <tr>
              <th>Id</th>
              <th>Type</th>
              <th>Material</th>
              <th>Volume</th>
              <th>Add</th>
            </tr>
            {{ console.log("notAssociatedTransportPackages ii --> ", notAssociatedTransportPackages)   }}
            <tr v-for="tp in notAssociatedTransportPackages" :key="tp.id">
              {{ console.log("tp --> ", tp)  }}
                <td>{{ tp.id }}</td>
                <td>{{ tp.type }}</td>
                <td>{{ tp.material }}</td>
                <td>{{ tp.volume }}</td>
                <td><button type="button" class="btn btn-light px-5" @click="addTransportPackageToOrder(tp.id , props.order.id)">Add</button></td>
            </tr>
          </table>
        </div>






        <div class="mb-5" v-for="sensor in uniqueSensorNames">
          <h2>{{ sensor }}</h2>
          <table>
            <tr>
              <th>Value</th>
              <th>Time</th>
            </tr>
            <tr v-for="obs in props.observations" :key="obs.id">
              <template v-if="obs.sensorName == sensor">
                <td>{{ obs.value }}</td>
                <td>{{ obs.date }}</td>
              </template>
            </tr>
          </table>
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
