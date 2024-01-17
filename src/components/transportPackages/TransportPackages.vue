<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import TransportPackageTable from "./TransportPackageTable.vue"

import Button from 'primevue/button';
import Dropdown from 'primevue/dropdown';


const router = useRouter()

const transportPackages = ref([])

const loadTransportPackages = async () => {
  try {
      const response = await axios.get('transport_packages')
      transportPackages.value = response.data.data
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

</script>

<template>
  <h3 class="mt-5 mb-3">Transport Packages</h3>
  <hr>
  <div class="mx-2 mt-2 mb-5 d-flex justify-content-between">
    <Button type="button" @click="addTransportPackages">
      <i class="bi bi-xs bi-plus-circle"></i>&nbsp;
      Add New Transport Package
    </Button>
  </div>
  <transportPackage-table :transportPackages="transportPackages" @edit="editTransportPackages"></transportPackage-table>
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