<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import TransportPackageTable from "./TransportPackageTable.vue"
import { useToast } from "vue-toastification"

import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';

const toast = useToast()
const router = useRouter()

const transportPackages = ref([])
const packageMaterial = ref(null);
const packageType = ref(null);

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
const loadTransportPackages = async () => {
  try {
      const response = await axios.get('transport_packages')
      transportPackages.value = response.data

  } catch (error) {
    console.log(error)
    clearTransportPackages()
  }
}

const clearTransportPackages = () => {
  transportPackages.value = []
}

const editTransportPackages = (transportPackages) => {
  router.push({ name: 'TransportPackage', params: { id: transportPackages.id } })
}

const addTransportPackages = () => {
  router.push({ name: 'NewTransportPackage' })
}

onMounted(() => {
  loadTransportPackages()
})

const editPackage = (transportPackage) => {
        try{
            axios.put(`transport_packages/${transportPackage.id}`, transportPackage)
            toast.success('Transport Package #' + transportPackage.id + ' was edited successfully.')
        }
        catch(error){
            console.log(error.response)
            if(error.response.status == 400)
                toast.error(error.response.data)
            else
                toast.error('Catalog Product was not edited!')
        }
    }

    const registerPackage = async () => {
      if(packageType.value == null || packageMaterial.value == null){
            toast.error('Please fill all the fields!')
            return;
          }  
      try{
          
            const response = await axios.post('transport_packages',
                    {"type":packageType.value, "material":packageMaterial.value})
            console.log(response.data)
            packageType.value= null
            packageMaterial.value= null
            toast.success('Transport package was registered successfully.')
            loadTransportPackages()
        }
        catch(error){
            console.log(error.response)
            packageType.value= null
            packageMaterial.value= null
            if(error.response.status == 400)
                toast.error(error.response.data)
            else
                toast.error('Transport package was not registered!')
        }
    }

</script>

<template>
  <h3 class="mt-5 mb-3">Transport Packages</h3>
  <hr>
  <!-- <div class="mx-2 mt-2 mb-5 d-flex justify-content-between">
    <Button type="button" @click="addTransportPackages">
      <i class="bi bi-xs bi-plus-circle"></i>&nbsp;
      Add New Transport Package
    </Button>
  </div> -->
  <form class="col  needs-validation" @submit.prevent="registerPackage">
        <div class="mb-5">
          <span class="p-float-label">
            <Dropdown v-model="packageType" :options="packageTypes" optionLabel="name" optionValue="value"/>
            <!-- //<InputText type="text" v-model="packageType"/> -->
            <label>Type</label>
          </span>
        </div>
        <div class="mb-5">
          <span class="p-float-label">
            <Dropdown v-model="packageMaterial" :options="materials" optionLabel="name" optionValue="name"/>
           <!-- <InputText type="text" v-model="packageMaterial" /> -->
            <label>Material</label>
          </span>
        </div>
        <div class="g-3 mb-4 d-flex justify-content-end ">
            <Button label="Create Package" type="submit" class="mr-5" ></Button>
        </div>
    </form>
  <transportPackage-table :transportPackages="transportPackages" @edit="editPackage"></transportPackage-table>
</template>

<style scoped>
  .filter-div {
    min-width: 12rem;
  }

  .total-filtro {
    margin-top: 2.3rem;
  }

  .small-select {
    width: 200px; /* Ajuste este valor conforme necessário */
    
  }

  .filterButton{
    margin-bottom: 2.3rem;
    margin-right: 2.3rem; 
    position: absolute;
  }
</style>