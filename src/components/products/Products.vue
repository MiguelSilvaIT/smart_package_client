<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import ProductTable from "./ProductTable.vue"
import { useToast } from "vue-toastification"

import Button from 'primevue/button'

const router = useRouter()
const products = ref([])
const toast = useToast()

const loadProducts= async () => {
    try{
        const response = await axios.get('products')
        products.value = response.data
        console.log(response.data)
    }
    catch(error){
        clearProducts()
        throw error
    }
}
/*
const deleteCategory = (category) => {
  try {
    if(userStore.userType == 'V')
      axios.delete(`categories/${category.id}`)
    else{
      axios.delete(`default_categories/${category.id}`)
    }
      let idx = categories.value.findIndex((t) => t.id === category.id)
      if (idx >= 0) {
          categories.value.splice(idx, 1)
      }
      toast.success('Category #' + category.id + ' was deleted successfully.')
    } catch (error) {
      console.log(error)
      toast.error('Category was not deleted!')      
    }
}
*/

const editProduct = (product) => {
  router.push({ name: 'Product', params: { id: product.id } })
}

const addProduct = () => {
  router.push({ name: 'NewProduct' })
}

onMounted(() => {
  loadProducts()
})

</script>

<template>
  <h3 class="mt-5 mb-3">Products</h3>
  <hr>
  <div class="mx-2 mt-2  mb-4 d-flex justify-content-between">
    <Button type="button" class="border-round-xs"  @click="addProduct">
      <i class="bi bi-xs bi-plus-circle"></i>&nbsp;
      Add Stock
    </Button>
  </div>
  <product-table :products="products" @edit="editProduct"></product-table>
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
</style>

