<script setup>
import { ref, inject } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import { useToast } from "vue-toastification";
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import { FilterMatchMode } from 'primevue/api';
import InputText from 'primevue/inputtext';

const toast = useToast();
const serverBaseUrl = inject("serverBaseUrl");

const props = defineProps({
  transportPackages: {
    type: Array,
    default: () => [],
  },
  showMaterial: {
    type: Boolean,
    default: true,
  },
  showType: {
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

const packageTypes = ref([
  { name: 'Tertiary' , value: 'TERTIARY'},
  { name: 'Secondary', value: 'SECONDARY'},
  { name: 'Primary' , value: 'PRIMARY'},
]);

const materials = ref([
  { name: 'Cardboard', value: 'cardboard' },
  { name: 'Plastic', value: 'plastic' },
  { name: 'Wood', value: 'wood' },
  { name: 'Metal', value: 'metal' },
  { name: 'Glass', value: 'glass' },
  { name: 'Paper', value: 'paper' },
  { name: 'Ceramic', value: 'ceramic' },
  { name: 'Textile', value: 'textile' },
  { name: 'Leather', value: 'leather' },
  { name: 'Rubber', value: 'rubber' },
  { name: 'Foil', value: 'foil' },
  { name: 'Wax', value: 'wax' },
  { name: 'Resin', value: 'resin' },
  { name: 'Bamboo', value: 'bamboo' },
  { name: 'Cork', value: 'cork' },
  // Add more materials as needed
]);

const emit = defineEmits(["edit"]);

const editClick = (transportPackage) => {
  emit("edit", transportPackage);
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const selectedTransportPackage = ref();

const onRowExpand = (event) => {
  toast.add({ severity: 'info', summary: 'Transport Package Expanded', detail: event.data.name, life: 3000 });
};
const onRowCollapse = (event) => {
  toast.add({ severity: 'info', summary: 'Transport Package Collapsed', detail: event.data.name, life: 3000 });
};

const editingPackage = ref(null);
const editingPackageType = ref(null);
const editingPackageMaterial = ref(null);
const showDialog = ref(false);

const showEdit = (transportPackage,visible) => {
  editingPackage.value = transportPackage
  editingPackageType.value = transportPackage.type
  editingPackageMaterial.value = transportPackage.material
  showDialog.value = visible
    
};

const hideDialog = () => {
  showDialog.value = false
}; 

const editPackage = () => {
  editingPackage.value.type = editingPackageType.value
  editingPackage.value.material = editingPackageMaterial.value

    emit("edit", editingPackage.value);
    hideDialog()
};



</script>

<template>
  <DataTable v-model:expandedRows="selectedTransportPackage" @rowSelect="onRowExpand" @rowUnselect="onRowCollapse"
     v-model:selection="selectedTransportPackage" :value="transportPackages" 
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
     <template #empty> No Transport Packages found. </template>
      <template #loading> Loading Transport Package data. Please wait. </template>
      <Column v-if="showId" sortable field="id" header="Id"></Column>
      <Column v-if="showMaterial" sortable field="material" header="Material"></Column>
      <Column v-if="showType" sortable field="type" header="Type"></Column>      
      <Column v-if="showEditButton" header="Edit">
          <template #body="slotProps">
              <button
                class="btn btn-xs btn-light"
                @click="showEdit(slotProps.data,true)"
                v-if="showEditButton"
              >
                <i class="bi bi-xs bi-pencil"></i>
              </button>
          </template>
      </Column>
      <template #expansion="slotProps" >
          <div class="expandedDiv">
            <h5 class="ms-3">Transport Package # {{ slotProps.data.id }}</h5>
            <div class="contentContainer">
              <div class="ms-1 mt-3">
                <p >
                  <strong>Id:</strong> {{ slotProps.data.id }}
                </p>
                <p >
                  <strong> Material:</strong> {{ slotProps.data.material }}
                </p>
                <p>
                  <strong> Type:</strong> {{ slotProps.data.type }}
                </p>
        
              </div>
              <div class=" ms-1 mt-3">
                <p v-for="(transportPackage, index) in (slotProps.data.orders || [])" :key="index">
                  <strong > Orders:</strong> {{ transportPackage.orders }}
                </p>
                <p v-for="(transportPackage, index) in (slotProps.data.products || [])" :key="index">
                  <strong > Sensors:</strong> {{ transportPackage.sensors }}
                </p>
              </div>
            </div>
          </div>
        </template>
    </DataTable>
    <Dialog header="Change Transport Package" v-model:visible="showDialog" :modal="true" :closable="false">
      <div class="mb-5 mt-4">
          <span class="p-float-label">
            <Dropdown v-model="editingPackageType" :options="packageTypes" optionLabel="name" optionValue="value"/>
            <!-- //<InputText type="text" v-model="packageType"/> -->
            <label>Type</label>
          </span>
        </div>
        <div class="mb-5">
          <span class="p-float-label">
            <Dropdown v-model="editingPackageMaterial" :options="materials" optionLabel="name" optionValue="name"/>
           <!-- <InputText type="text" v-model="packageMaterial" /> -->
            <label>Material</label>
          </span>
        </div>
      <div class="p-d-flex p-jc-end p-mt-3 mt-4">
        <Button label="Confirm" class="m-3" @click="editPackage" />
        <Button label="Cancel" class="p-button-secondary m-3" @click="hideDialog" />
      </div>
    </Dialog>
</template>

<style scoped>
button {
  margin-left: 3px;
  margin-right: 3px;
}

.credit_value{
  color: #007bff;
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

.catDescDetail{
  margin-right: 4px;
  max-width: 250px;
  min-width: 250px;
}
</style>