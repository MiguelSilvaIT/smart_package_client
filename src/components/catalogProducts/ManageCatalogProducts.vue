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
    const packageMaterial = ref(null);
    const secPackageMaterial = ref(null);
    const tercPackageMaterial = ref(null);
    const volume = ref(0);
    const secVolume = ref(0);
    const tercVolume = ref(0);
    
    const catalogProductName = ref(null);
    const catalogProductDescription = ref(null);

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

    const addPackage = async (product, packMaterial, packVolume, secPackMaterial, secPackVolume,
                                                terciaryPackMaterial,terciaryPackVolume) => {
        try{
            const response = await axios.put(`catalog_products/${product.id}/packageDetails`, 
                    {"material":packMaterial, "volume":packVolume,"secPackageMaterial":secPackMaterial, "secPackageVolume":secPackVolume,"terciaryPackageMaterial":terciaryPackMaterial, "terciaryPackageVolume":terciaryPackVolume})
            toast.success('Package was added successfully.')
            loadProducts()
        }
        catch(error){
            console.log(error)
            if(error.response.status == 400)
                toast.error(error.response.data)
            else
                toast.error('Package was not added!')
        }
    }

    const registerCatalogProduct = async () => {
        try{
            const response = await axios.post('catalog_products',
                    {"name":catalogProductName.value, "manufacturerUsername":userStore.userUsername, "description":catalogProductDescription.value, 
                    "packageMaterial":packageMaterial.value, "packageVolume":volume.value,
                    "secPackageMaterial":secPackageMaterial.value, "secPackageVolume":secVolume.value,
                    "terciaryPackageMaterial":tercPackageMaterial.value, "terciaryPackageVolume":tercVolume.value})
            console.log(response.data)
            catalogProductName.value= null
            catalogProductDescription.value= null
            toast.success('Catalog was registered successfully.')
            products.value.push(response.data)
        }
        catch(error){
            toast.error(error)
            console.log(error)
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
    <form class="col needs-validation" @submit.prevent="registerCatalogProduct">
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
        <div style="margin-bottom: 2rem; margin-left: 8rem;">
            <h6 > Primary Package</h6>
        </div>
        <div class="g-3 mb-4 d-flex flex-start " style="margin-left: 6rem;">
            <div class = "mb-5" style="width: 40%;">
                <span class="p-float-label">
                <Dropdown v-model="packageMaterial" :options="materials" optionLabel="name" optionValue="name"/>
                
                <label> Package Material</label>
                </span>
            </div>
            
            <div class = "mb-5 ml-6" style=" width: 20%;">
                <span class="p-float-label">
                <InputNumber v-model="volume" :min="0" />
                            <label>Package Volume</label>
                </span>
            </div>
        </div>

        <div style="margin-bottom: 2rem; margin-left: 8rem;">
            <h6 > Secondary Package</h6>
        </div>
        <div class="g-3 mb-4 d-flex flex-start " style="margin-left: 6rem;">
            <div class = "mb-5" style="width: 40%;">
                <span class="p-float-label">
                <Dropdown v-model="secPackageMaterial" :options="materials" optionLabel="name" optionValue="name"/>
                
                <label> Package Material</label>
                </span>
            </div>
            
            <div class = "mb-5 ml-6" style=" width: 20%;">
                <span class="p-float-label">
                <InputNumber v-model="secVolume" :min="volume" />
                    <label>Package Volume</label>
                </span>
            </div>
        </div>

        <div style="margin-bottom: 2rem; margin-left: 8rem;">
            <h6 > Terciary Package </h6>
        </div>
        <div class="g-3 mb-4 d-flex flex-start " style="margin-left: 6rem;">
            <div class = "mb-5" style="width: 40%;">
                <span class="p-float-label">
                <Dropdown v-model="tercPackageMaterial" :options="materials" optionLabel="name" optionValue="name"/>
                
                <label> Package Material</label>
                </span>
            </div>
            
            <div class = "mb-5 ml-6" style=" width: 20%;">
                <span class="p-float-label">
                <InputNumber v-model="tercVolume" :min="secVolume" />
                            <label>Package Volume</label>
                </span>
            </div>
        </div>

          <div class="g-3 mb-4 d-flex justify-content-end ">
            <Button label="Criar produto de catálogo" type="submit" class="mr-5" ></Button>
        </div>
    </form>
    <catalog-products-table :catalogProducts="products" @edit="editProduct" @addPackage="addPackage"></catalog-products-table>
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