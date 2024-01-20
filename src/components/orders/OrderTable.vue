<script setup>
import axios from 'axios'
import { ref, watch, watchEffect } from "vue";

import { FilterMatchMode } from 'primevue/api';

const props = defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
  showId: {
    type: Boolean,
    default: true,
  },
  showClient: {
    type: Boolean,
    default: true,
  },
  showCreationDate: {
    type: Boolean,
    default: true,
  },
  showStatus: {
    type: Boolean,
    default: true,
  },
  showLogisticOperatorName: {
    type: Boolean,
    default: true,
  },
  showDetailsButton: {
    type: Boolean,
    default: true,
  },
  showDeleteButton: {
    type: Boolean,
    default: true,
  },
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const emit = defineEmits(["detail"]);

const editingOrders = ref(props.orders);

watch(
  () => props.orders,
  (newOrders) => {
    editingOrders.value = newOrders;
  }
);

// Alternative to previous watch
// watchEffect(() => {
//   editingOrders.value = props.orders
// })


const detailClick = (order) => {
  emit("detail", order);
};

</script>

<template>
  <DataTable v-model:filters="filters" stripedRows :value="orders"
     selectionMode="multiple" dataKey="id" 
     :metaKeySelection=false paginator sortField="id" :sortOrder="1" :rows="30" 
     :globalFilterFields="['id','clientUsername', 'creation_date','status','logisticsOperatorUsername']">
     <template #header>
          <div class="flex justify-content-end">
              <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
              </span>
          </div>
      </template>
      <template #empty> No products found. </template>
    <Column v-if="showId" field="id" header="Id" :sortable="true"></Column>
    <Column v-if="showClient" field="clientUsername" header="Client" :sortable="true"></Column>
    <Column v-if="showCreationDate" field="creation_date" header="Creation Date" :sortable="true"></Column>
    <Column v-if="showStatus" field="status" header="Status" :sortable="true"></Column>
    <Column v-if="showLogisticOperatorName" field="logisticsOperatorUsername" header="Logistic Operator" :sortable="true" ></Column>
    <Column v-if="showDetailsButton" header="Details">
          <template #body="slotProps">
              <button
                class="btn btn-xs btn-light"
                @click="detailClick(slotProps.data,true)">
                <i class="bi bi-eye"></i>
              </button>
          </template>
      </Column>
    <template #expansion="slotProps" >
          <div class="expandedDiv">
            <div class ="flex justify-content-between">
              <div class="ms-1 mt-3">
                <h5 class="ms-3">Product # {{ slotProps.data.id }}</h5>
              </div>
              <div class="ms-5 mt-3">
                <h5 > Primary Package</h5>
              </div>
              <div class="ms-4 mt-3 ">
                <h5> Secondary Package</h5>
              </div>
              <div class="mt-3 me-5">
                <h5> Tertiary Package</h5>
              </div>
            </div>
            <div class="contentContainer">
              <div class="ms-1 mt-3">
               
              </div>
              <div class=" ms-1 mt-3">
                
              </div>
              <div class=" ms-1 mt-3">
                
              </div>
              <div class=" ms-1 mt-3 me-4">
                
              </div>
            </div>
          </div>
        </template>
  </DataTable>

  <!-- <table class="table">
    <thead>
      <tr>
        <th v-if="showId">#</th>
        <th class="text-center" v-if="showClient">Client</th>
        <th v-if="showCreationDate">Creation Date</th>
        <th v-if="showStatus">Status</th>
        <th v-if="showLogisticOperatorName">Logistic Operator</th>
        <th v-if="showDetailsButton">Details</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td v-if="showId">{{ order.id }}</td>
        <td class="text-center" v-if="showClient">{{ order.clientUsername }}</td>
        <td v-if="showCreationDate">{{ order.creation_date }}</td>
        <td v-if="showStatus">{{ order.status }}</td>
        <td v-if="showLogisticOperatorName">
          {{ order.logisticsOperatorUsername }}
        </td>
        <td class="text-end" v-if="showDetailsButton">
          <button class="btn btn-xs btn-light" @click="detailClick(order)" v-if="showDetailsButton">
            <i class="bi bi-eye"></i>
          </button>
        </td>
      </tr>
    </tbody> 
  </table>-->
</template>

<style scoped>
.completed {
  text-decoration: line-through;
}

button {
  margin-left: 3px;
  margin-right: 3px;
}
</style>
