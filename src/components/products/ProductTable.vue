<script setup>
import { ref, onMounted } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import axios from 'axios'; 

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
const selectedProduct = ref();
const catalogProducts = ref([])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const onRowExpand = (event) => {
  loadProductsCatalog(event.data.catalogProductId);
  toast.add({ severity: 'info', summary: 'Order Expanded', detail: event.data.name, life: 3000 });
};

const onRowCollapse = (event) => {
  toast.add({ severity: 'info', summary: 'Order Collapsed', detail: event.data.name, life: 3000 });
};

console.log(props.products)

const loadProductsCatalog = async (id) => {
  const response = await axios.get('catalog_products/' + id)
  catalogProducts.value = response.data
  console.log(response.data)
}

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
      <Column v-if="showId" sortable field="id" header="Id"></Column>
      <Column v-if="showManufacturerUsername" sortable field="manufacturerUsername" header="Manufacturer Username"></Column>
      <Column v-if="showOrderId" sortable field="orderId" header="Order Associated">
        <template #body="slotProps">
          <span v-if="slotProps.data.orderId === -1">None</span>
          <span v-else>{{ slotProps.data.orderId }}</span>
        </template>
      </Column>      
      <template #expansion="slotProps" >
          <div class="expandedDiv">
            <h5 class="ms-3">Product # {{ slotProps.data.id }}</h5>
            <div class="contentContainer">
              <div class="ms-1 mt-3">
                <p >
                  <strong> Product Catalog Id:</strong> {{ slotProps.data.catalogProductId }}
                </p>
                <p >
                  <strong> Product:</strong> {{ catalogProducts.name }}
                </p>
                <p >
                  <strong> Product Description:</strong> {{ catalogProducts.description }}
                </p>
                
              </div>
              <div class=" ms-1 mt-3">
                <p>
                  <strong> Order Id:</strong> 
                    <span v-if="slotProps.data.orderId === -1"> None</span>
                    <span v-else>{{ slotProps.data.orderId }}</span>
                </p>
                <p >
                  <strong> Manufacturer Username:</strong> {{ slotProps.data.manufacturerUsername }}
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
