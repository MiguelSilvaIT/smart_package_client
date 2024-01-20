<script setup>
import { ref, inject,watch,onMounted} from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import axios from 'axios'


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
const emit = defineEmits(["edit","addPackage"]);
const selectedProduct = ref();
const editingProductDescription = ref();
const editingProductName = ref();
const editingProduct = ref();
const showDialog = ref(false);
const showPackageDialog = ref(false);
// const availableProductPackages = ref([])
  const productPackage = ref()
  const packageMaterial = ref(null);
  const secPackageMaterial = ref(null);
  const tercPackageMaterial = ref(null);
  const volume = ref(0);
  const secVolume = ref(0);
  const tercVolume = ref(0);

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

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

watch(() => props.catalogProducts, (val) => {
    editingProduct.value = val[0]
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

const showAddPackage = (prodPackage,visible) => {
  productPackage.value = prodPackage
  packageMaterial.value = productPackage.value.catalogPackage.material;
  volume.value = productPackage.value.catalogPackage.volume;
  secPackageMaterial.value = productPackage.value.catalogPackage.secPackageMaterial;
  secVolume.value = productPackage.value.catalogPackage.secPackageVolume;
  tercPackageMaterial.value = productPackage.value.catalogPackage.terciaryPackageMaterial;
  tercVolume.value = productPackage.value.catalogPackage.terciaryPackageVolume;
  
  showPackageDialog.value = visible
};

const addPackage = async() => {
  
    emit("addPackage", productPackage.value, packageMaterial.value, volume.value, 
                    secPackageMaterial.value, secVolume.value, tercPackageMaterial.value, tercVolume.value);
    hidePackageDialog()
}

const hidePackageDialog = () => {
  showPackageDialog.value = false
};

// const loadProductPackages = async () => {
//   const response = await axios.get('product_packages')
//   availableProductPackages.value = response.data
//   console.log(availableProductPackages.value)
// }

const customLabel = (slotProps) => {
  return slotProps.id + ' : ' + slotProps.type + ' - ' + slotProps.material
}

// onMounted(() => {
//   loadProductPackages()
// })


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
              <button
                class="btn btn-xs btn-light"
                @click="showAddPackage(slotProps.data,true)">
                <i class="pi pi-box"></i>
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
    <Dialog header="Change package details" v-model:visible="showPackageDialog" :modal="true" :closable="false">
          <!-- package material && pacakge volume                           -->
          <!-- sempre q um produto fosse criado, criava se um package primario, 
          com os detalhes do packageDetails do catalogProduct associado     -->
          <div style="margin-bottom: 2rem; margin-left: 3rem;">
            <h6 > Primary Package</h6>
        </div>
        <div class="g-3 mb-4 d-flex flex-start " style="margin-left: 1rem;">
            <div class = "mb-5" style="width: 40%;">
                <span class="p-float-label">
                <Dropdown v-model="packageMaterial" :options="materials" optionLabel="name" optionValue="name"/>
                
                <label> Package Material</label>
                </span>
            </div>
            
            <div class = "mb-5 ml-6" style=" width: 30%;">
                <span class="p-float-label">
                <InputNumber v-model="volume" :min="0" />
                            <label>Package Volume</label>
                </span>
            </div>
        </div>

        <div style="margin-bottom: 2rem; margin-left: 3rem;">
            <h6 > Secondary Package</h6>
        </div>
        <div class="g-3 mb-4 d-flex flex-start " style="margin-left: 1rem;">
            <div class = "mb-5" style="width: 40%;">
                <span class="p-float-label">
                <Dropdown v-model="secPackageMaterial" :options="materials" optionLabel="name" optionValue="name"/>
                
                <label> Package Material</label>
                </span>
            </div>
            
            <div class = "mb-5 ml-6" style=" width: 30%;">
                <span class="p-float-label">
                <InputNumber v-model="secVolume" :min="volume" />
                    <label>Package Volume</label>
                </span>
            </div>
        </div>

        <div style="margin-bottom: 2rem; margin-left: 3rem;">
            <h6 > Terciary Package </h6>
        </div>
        <div class="g-3 mb-4 d-flex flex-start " style="margin-left: 1rem;">
            <div class = "mb-5" style="width: 40%;">
                <span class="p-float-label">
                <Dropdown v-model="tercPackageMaterial" :options="materials" optionLabel="name" optionValue="name"/>
                <label> Package Material</label>
                </span>
            </div>
            
            <div class = "mb-5 ml-6" style=" width: 30%;">
                <span class="p-float-label">
                <InputNumber v-model="tercVolume" :min="secVolume" />
                            <label>Package Volume</label>
                </span>
            </div>
        </div>
      <div class="p-d-flex p-jc-end p-mt-3 mt-4">
        <Button label="Confirm" class="m-3" @click="addPackage" />
        <Button label="Cancel" class="p-button-secondary m-3" @click="hidePackageDialog" />
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
