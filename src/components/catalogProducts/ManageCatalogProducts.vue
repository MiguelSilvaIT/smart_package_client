<script setup>
    import axios from 'axios'
    import { useRouter } from 'vue-router'
    import { ref, computed, onMounted } from 'vue'
    import { useToast } from "vue-toastification"
    import { useUserStore } from '../../stores/user'
    import Button from 'primevue/button'
    import InputText from 'primevue/inputtext'
    import CatalogProductsTable from "./catalogProductsTable.vue"

    import 'primeicons/primeicons.css'

    const router = useRouter()
    const products = ref([])
    const toast = useToast()
    const userStore = useUserStore()

    
    const catalogProductName = ref(null);
    const catalogProductDescription = ref(null);

    const loadProducts= async () => {
        const response = await axios.get('catalog_products')
        products.value = response.data
        console.log(products.value)
    }

    onMounted(() => {
        loadProducts()
    })

    const editProduct = (product) => {
        try{
            axios.put(`catalog_products/${product.id}`, product)
            toast.success('Catalog Product #' + product.id + ' was edited successfully.')
        }
        catch(error){
            console.log(error.response)
            if(error.response.status == 400)
                toast.error(error.response.data)
            else
                toast.error('Catalog Product was not edited!')
        }
    }

    const registerCatalogProduct = async () => {
        try{
            const response = await axios.post('catalog_products',
                    {"name":catalogProductName.value, "manufacturerUsername":userStore.userUsername, "description":catalogProductDescription.value})
            console.log(response.data)
            catalogProductName.value= null
            catalogProductDescription.value= null
            toast.success('Catalog was registered successfully.')
        }
        catch(error){
            console.log(error.response)
            ocatalogProductName.value= null
            catalogProductDescription.value= null
            if(error.response.status == 400)
                toast.error(error.response.data)
            else
                toast.error('Catalog was not registered!')
        }
    }
</script>

<template>
    <h3 class="mt-5 mb-3">Products</h3>
    <hr>
    <form class="col  needs-validation" @submit.prevent="registerCatalogProduct">
        <div class="mb-5">
          <span class="p-float-label">
            <InputText type="text" v-model="catalogProductName"/>
            <label>Name</label>
          </span>
        </div>
        <div class="mb-5">
          <span class="p-float-label">
            <InputText type="text" v-model="catalogProductDescription" />
            <label>Description</label>
          </span>
        </div>
        <div class="g-3 mb-4 d-flex justify-content-end ">
            <Button label="Criar produto de catálogo" type="submit" class="mr-5" ></Button>
        </div>
    </form>
    <catalog-products-table :catalogProducts="products" @edit="editProduct"></catalog-products-table>
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