<script setup>
import { ref,inject } from "vue";
import avatarNoneUrl from '@/assets/avatar-none.png'

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import 'primeicons/primeicons.css'
import { FilterMatchMode } from 'primevue/api';
import InputText from 'primevue/inputtext';
import { format } from 'date-fns'

const serverBaseUrl = inject("serverBaseUrl");
const toast = useToast();
const props = defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
  showClientUsername: {
    type: Boolean,
    default: true,
  },
  showLogisticsOperator: {
    type: Boolean,
    default: true,
  },
  showProducts: {
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
  showTransportPackages: {
    type: Boolean,
    default: true,
  },
});
const showDialog = ref(false);
const editingOrder = ref();
const errors = ref(null);

const hideDialog = () => {
  showDialog.value = false
  errors.value = null
};

const selectedOrder = ref();

const onRowExpand = (event) => {
  toast.add({ severity: 'info', summary: 'Order Expanded', detail: event.data.name, life: 3000 });
};

const onRowCollapse = (event) => {
  toast.add({ severity: 'info', summary: 'Order Collapsed', detail: event.data.name, life: 3000 });
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const date = (timestamp) => {
  return format(new Date(timestamp), 'HH:mm dd/MM/yyyy')
}


</script>

<template>
  <DataTable v-model:expandedRows="selectedOrder" @rowSelect="onRowExpand" @rowUnselect="onRowCollapse"
     v-model:selection="selectedOrder" :value="orders" 
     selectionMode="multiple" dataKey="id"
     :metaKeySelection=false paginator sortField="id" :sortOrder="1" :rows="30" stripedRows >
     <template #header>
          <div class="flex justify-content-end">
              <span class="p-input-icon-left">
                  <i class="pi pi-search" />
                  <InputText v-model="filters['global'].value" placeholder="Keyword Search" />
              </span>
          </div>
      </template>
     <template #empty> No orders found. </template>
      <template #loading> Loading orders data. Please wait. </template>
      <Column v-if="showClientUsername" sortable  field="clientUsername" header="Username"></Column>
      <Column v-if="showLogisticsOperator" sortable field="logisticsOperatorUsername" header="Logistics Operator"></Column>
      <Column v-if="showStatus" sortable field="status" header="Status"></Column>
        <template #expansion="slotProps" >
          <div class="expandedDiv">
            <h5 class="ms-3">Order # {{ slotProps.data.id }}</h5>
            <div class="contentContainer">
              <div class="ms-1 mt-3">
                <p >
                    <strong>Username:</strong> {{ slotProps.data.clientUsername }}
                </p>
                <p >
                    <strong>Logistics Operator:</strong> {{ slotProps.data.logisticsOperatorUsername }}
                </p>
                <p>
                    <strong>Product:</strong> {{ slotProps.data.products }}
                </p>
                <p>
                  <strong> Transport Packages: </strong> {{ slotProps.data.transportPackages }}
                </p>
              </div>
              <div class="mt-3">
                <p >
                    <strong>Creation Date:</strong>  {{ date(slotProps.data.creation_date) }}
                </p>
                <p >
                    <strong>Status:</strong>  {{ slotProps.data.status }}
                </p>
              </div>
            </div>
          </div>
        </template>
    </DataTable>
  <Toast />
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
