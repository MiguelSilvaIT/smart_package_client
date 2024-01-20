<script setup>
import { ref, onMounted,watch } from "vue";
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
const catalogProducts = ref([]);
const primaryPackage = ref([]);
const secondaryPackage = ref([]);
const terciaryPackage = ref([]);

watch(props.products, (val) => {
  terciaryPackage.value = Array.from({ length: val.length }, () => ({}));
  console.log(terciaryPackage.value)
});

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const onRowExpand = async (event) => {
  console.log(event)
  loadProductsCatalog(event.data.catalogProductId);
  loadProduct(event.data.id,event.index);
  
};

const onRowCollapse = (event) => {
};

const loadProduct = async (id,index) => {
  const response = await axios.get('products/' + id)
  console.log("Product",response.data)
  primaryPackage.value[index] = response.data.productPackages[0]
  secondaryPackage.value[index] = response.data.productPackages[1] 
  terciaryPackage.value[index] = response.data.productPackages[2]
}

const loadProductsCatalog = async (id) => {
  const response = await axios.get('catalog_products/' + id)
  catalogProducts.value = response.data
  
  console.log("Catalog",response.data)
}

const getPackage = (product,packType) => {
  // console.log(product)
  for (let i = 0; i < product.productPackages.length; i++) {
    if (product.productPackages[i].type == packType) {

      return product.productPackages[i];
    }
  }
  return null;
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
                <p >
                  <strong> Catalog Product Id:</strong> {{ slotProps.data.catalogProductId }}
                </p>
                <p >
                  <strong> Name:</strong> {{ catalogProducts.name }}
                </p>
                <p >
                  <strong> Description:</strong> {{ catalogProducts.description }}
                </p>
                
              </div>
              <div class=" ms-1 mt-3">
                <p >
                  <strong> Package Id:</strong> {{ primaryPackage[slotProps.index] != null ? primaryPackage[slotProps.index].id : "None" }}
                </p>
                <p >
                  <strong> Package Material:</strong> {{ primaryPackage[slotProps.index] != null ? primaryPackage[slotProps.index].material : "None" }}
                </p>
                <p >
                  <strong> Package Volume:</strong> {{ primaryPackage[slotProps.index] != null ? primaryPackage[slotProps.index].volume : "None" }}
                </p>
              </div>
              <div class=" ms-1 mt-3">
                <p >
                  <strong> Package Id:</strong> {{ secondaryPackage[slotProps.index] != null ? secondaryPackage[slotProps.index].id : "None" }}
                </p>
                <p>
                  <strong> Package Material:</strong> {{ secondaryPackage[slotProps.index] != null ? secondaryPackage[slotProps.index].material : "None" }}
                </p>
                <p >
                  <strong> Package Volume:</strong> {{ secondaryPackage[slotProps.index] != null ? secondaryPackage[slotProps.index].volume : "None" }}
                </p>
              </div>
              <div class=" ms-1 mt-3 me-4">
                <p >
                  <strong> Package Id:</strong> {{ terciaryPackage[slotProps.index] != null ? terciaryPackage[slotProps.index].id : "None"}}
                </p>
                <p >
                  <strong> Package Material:</strong> {{ terciaryPackage[slotProps.index] != null ? terciaryPackage[slotProps.index].material : "None" }}
                </p>
                <p >
                  <strong> Package Volume:</strong> {{ terciaryPackage[slotProps.index] != null ? terciaryPackage[slotProps.index].volume : "None"}}
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
