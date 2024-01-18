<script setup>
import { ref, inject,watch } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';


import InputText from 'primevue/inputtext';
import 'primeicons/primeicons.css';    
const props = defineProps({
  catalogProducts: {
    type: Array,
    default: () => [],
  },
  showId: {
    type: Boolean,
    default: true,
  },
  showName:{
    type: Boolean,
    default: true,
  },
    showDescription:{
        type: Boolean,
        default: true,
    }
});

const toast = useToast();
const emit = defineEmits(["edit"]);
const selectedProduct = ref();
const editingProductDescription = ref();
const editingProductName = ref();
const editingProduct = ref();
const showDialog = ref(false);

watch(() => props.catalogProducts, (val) => {
    editingProduct.value = val[0]
});
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const showEdit = (product,visible) => {
    editingProduct.value = product
    editingProductName.value = product.name
    editingProductDescription.value = product.description
    showDialog.value = visible
    
};

const editProduct = () => {
    editingProduct.value.name = editingProductName.value
    editingProduct.value.description = editingProductDescription.value

    emit("edit", editingProduct.value);
    hideDialog()
};

const hideDialog = () => {
  showDialog.value = false
};

</script>

<template>
  <DataTable 
        v-model:filters="filters"
     :value="catalogProducts" 
     :metaKeySelection=false paginator sortField="id" :sortOrder="1" :rows="30" stripedRows
     :globalFilterFields="['id','name', 'description']">
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
      <Column v-if="showName" sortable field="name" header="Name"></Column>
      <Column v-if="showDescription" sortable field="description" header="Description"></Column>      
      <Column header="Edit">
          <template #body="slotProps">
              <button
                class="btn btn-xs btn-light"
                @click="showEdit(slotProps.data,true)">
                <i class="bi bi-xs bi-pencil"></i>
              </button>
          </template>
      </Column>
    </DataTable>
    <Dialog header="Change Catalog Product" v-model:visible="showDialog" :modal="true" :closable="false">
      <div class="mb-5 mt-4">
        <span class="p-float-label">
        <InputText type="text" required v-model="editingProductName"/>
        <label>Name</label>
        </span>
      </div>
      <div class="mb-5">
        <span class="p-float-label">
        <InputText type="text" required v-model="editingProductDescription"/>
        <label>Description</label>
        </span>
      </div>
      <div class="p-d-flex p-jc-end p-mt-3 mt-4">
        <Button label="Confirm" class="m-3" @click="editProduct" />
        <Button label="Cancel" class="p-button-secondary m-3" @click="hideDialog" />
      </div>
    </Dialog>
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
