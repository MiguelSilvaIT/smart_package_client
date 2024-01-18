<script setup>
import { ref, inject } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';

import InputText from 'primevue/inputtext';
import 'primeicons/primeicons.css';    
const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  showId: {
    type: Boolean,
    default: true,
  },
  showCatalogId: {
    type: Boolean,
    default: true,
  },
  showManufacturerUsername: {
    type: Boolean,
    default: true,
  },
  showOrderId: {
    type: Boolean,
    default: true,
  },
  showProductPackages: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },

});

const toast = useToast();
const emit = defineEmits(["edit"]);
const selectedProduct = ref();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const onRowExpand = (event) => {
  toast.add({ severity: 'info', summary: 'Order Expanded', detail: event.data.name, life: 3000 });
};

const onRowCollapse = (event) => {
  toast.add({ severity: 'info', summary: 'Order Collapsed', detail: event.data.name, life: 3000 });
};

const editClick = (product) => {
  emit("edit", product);
};
</script>

<template>
  <DataTable v-model:expandedRows="selectedProduct" @rowSelect="onRowExpand" @rowUnselect="onRowCollapse"
     v-model:selection="selectedProduct" :value="products"
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
      <template #empty> No products found. </template>
      <Column v-if="showId" sortable field="catalogProductId" header="Id"></Column>
      <Column v-if="showManufacturerUsername" sortable field="manufacturerUsername" header="Manufacturer Username"></Column>
      <Column v-if="showOrderId" sortable field="orderId" header="Order Associated">
        <template #body="slotProps">
          <span v-if="slotProps.data.orderId === -1">None</span>
          <span v-else>{{ slotProps.data.orderId }}</span>
        </template>
      </Column>      
      <Column v-if="showEditButton" header="Edit">
          <template #body="slotProps">
              <button
                class="btn btn-xs btn-light"
                @click="editClick(slotProps.data)"
                v-if="showEditButton"
              >
                <i class="bi bi-xs bi-pencil"></i>
              </button>
          </template>
      </Column>
      <template #expansion="slotProps" >
          <div class="expandedDiv">
            <h5 class="ms-3">Product Catalog # {{ slotProps.data.catalogProductId }}</h5>
            <div class="contentContainer">
              <div class="ms-1 mt-3">
                <p >
                  <strong> Product Id:</strong> {{ slotProps.data.id }}
                </p>
                <p >
                  <strong> Manufacturer Username:</strong> {{ slotProps.data.manufacturerUsername }}
                </p>
                <p>
                  <strong> Order Id:</strong> 
                    <span v-if="slotProps.data.orderId === -1">None</span>
                    <span v-else>{{ slotProps.data.orderId }}</span>
                </p>
              </div>
              <div class=" ms-1 mt-3">
                <p v-for="(productPackage, index) in (slotProps.data.productPackages || [])" :key="index">
                  <strong > Product Packages:</strong> {{ productPackage.material }}
                </p>
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
</style>
