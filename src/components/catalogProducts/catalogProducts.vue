<script setup>
    import axios from 'axios'
    import { useRouter } from 'vue-router'
    import { ref, computed, onMounted } from 'vue'
    import { useToast } from "vue-toastification"
    import { useUserStore } from '../../stores/user'
    import Dropdown from "primevue/dropdown";
    import Button from 'primevue/button'
    import CatalogProductsGrid from "./catalogProductsGrid.vue" 
    import 'primeicons/primeicons.css'

    const router = useRouter()
    const products = ref([])
    const toast = useToast()
    const userStore = useUserStore()

    
    const orderProducts = ref(null);
    const orderOperator = ref(null);
    const logisticOperators = ref(null);

    const loadProducts= async () => {
    
        const response = await axios.get('catalog_products')
        products.value = response.data
        console.log(products.value)
    }

    const loadLogistics= async () => {
    
        const response = await axios.get('users/logistic_operators')
        logisticOperators.value = response.data
        console.log(response.data)
    }

    onMounted(() => {
        loadProducts()
        loadLogistics()
    })

    const addToCart = (product) => {
        console.log(product)
        const quantity = product.quantity
        delete product.quantity

        if(orderProducts.value == null){
            orderProducts.value = []
        }
        orderProducts.value.push({ "catalogProduct": product , "quantity": quantity });
        console.log(orderProducts.value)
    }

    const registerOrder = async () => {
        try{
            const response = await axios.post('orders',{"orderProducts":orderProducts.value, "clientUsername":userStore.userUsername, "logisticsOperatorUsername":orderOperator.value})
            console.log(response.data)
            orderProducts.value = null
            toast.success('Order was registered successfully.')
        }
        catch(error){
            console.log(error.response)
            orderProducts.value = null
            if(error.response.status == 400)
                toast.error(error.response.data)
            else
                toast.error('Order was not registered!')
            
        }
    }

</script>

<template>
    <h3 class="mt-5 mb-3">Products</h3>
    <hr>
    <form class="col  needs-validation" @submit.prevent="registerOrder">
        <div class="row g-3">
        <div class="col mb-3 ms-xs-3">
            <span class="p-float-label">
            <Dropdown v-model="orderOperator" :options="logisticOperators" optionLabel="username" optionValue="username"/>
            <label for="birth_date">Logistic Operator</label>
            </span>
        </div>
        </div>
        <div class="g-3 mb-4 d-flex justify-content-end ">
            <Button label="Finalizar Encomenda" type="submit" class="mr-5" ></Button>
        </div>
    </form>
    <CatalogProductsGrid :catalogProducts="products" @addCart="addToCart" />
   <!-- <catalogProducts-grid :products="products" ></catalogProducts-grid>  -->
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