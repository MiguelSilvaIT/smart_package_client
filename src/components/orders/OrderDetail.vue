<script setup>
  import { ref, watch, computed,onMounted } from 'vue'
  import Dropdown from 'primevue/dropdown';
  import axios from 'axios'
  import InputText from 'primevue/inputtext';
  import Listbox from 'primevue/listbox';

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

  const emit = defineEmits(['save', 'cancel', 'transportPackageDetail'])


  
  const observations = ref(props.observations)
  console.log("obs --> " , props.observations)



  const uniqueSensorNames = computed(() => [...new Set(props.observations.map(item => item.sensorName))]);

  const orderTitle = computed(() => {
    return  'Order ' + props.order.id
  })


  const detailClick = (packId) => {
      emit("transportPackageDetail", packId);

  }

  const cancel = () => {
    emit('cancel', editingOrder.value)
  }

  //onMounted LoadObservations

</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-2">{{ orderTitle }}</h3>
    <hr />
    <div class="d-flex flex-wrap mt-4 justify-content-between">
      <div class="w-75 pe-4">
        <div class="col mb-5 ms-xs-3">
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
        <!-- List of transport packages -->
        <div class="mb-5">
          <span class="p-float-label" v-if="order.transportPackages && order.transportPackages.length > 0">
            <InputText
              type="text"
              v-for = "transportPackage in order.transportPackages"
              v-model="transportPackage.id"
              :class="{ 'p-invalid': errors ? errors['transportPackages'] : false }"
              readonly
              @click="detailClick(transportPackage.id)"
            />
            <label for="number-input">Transport Packages(click for more details)</label>
            <field-error-message :errors="errors" fieldName="transportPackages"></field-error-message>
          </span>
          <div v-else>
            <p>No transport packages available.</p><br>
          </div>
        </div>

        <div class="mb-5" v-for="sensor in uniqueSensorNames" >
          <h2>{{sensor}}</h2>
          <table>
            <tr>
              <th>Value</th>
              <th>Time</th>
            </tr>
            <tr v-for="obs in props.observations" :key="obs.id" >
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
