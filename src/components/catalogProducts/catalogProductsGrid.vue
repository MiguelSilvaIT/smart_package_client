<script setup>
import { ref, inject,watch } from "vue";
import { useToast } from 'primevue/usetoast';

import 'primeicons/primeicons.css'; 
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';


const props = defineProps({
  catalogProducts: {
    type: Array, // or the correct type for your data
    required: true,
  },


}); 

// const catalogProducts = ref(Object.assign({}, props.catalogProducts))


const emit = defineEmits(["addCart"]);
const toast = useToast();
const sortOrder = ref(null);
const sortField = ref(null);

const addCart = (product) => {
  emit("addCart", product);
};
</script>

<template>
    <div class="flex flex-wrap">
        <div class="col-12 md:col-4" style="height: 20rem; width:24rem" v-for="product in props.catalogProducts" :key="product.id">
            <div class="card m-3 border-1 surface-border">
                <div class="flex align-items-center justify-content-between">
                    <div class="flex align-items-center">
                        <i class="pi pi-tag mr-2"></i>
                        <!-- <span class="font-semibold">{{ product.category }}</span> -->
                    </div>
                    <span v-show="product.availableProducts > 10" :class="'product-badge status-' + 'instock'">INSTOCK</span>
                    <span v-show="product.availableProducts < 6 && product.availableProducts > 0" :class="'product-badge status-' + 'instock'">LOWSTOCK</span>
                    <span v-show="product.availableProducts == 0" :class="'product-badge status-' + 'instock'">OUTOFSTOCK</span>
                </div>
                <div class="text-center">
                    <br>
                    <div class="text-2xl font-bold">{{ product.name }}</div>
                    <div class="mb-3">{{ product.description }}</div>
                </div>
                <div class="flex align-items-center justify-content-between">
                    
                    <InputNumber v-model="product.quantity" :min="0" :max="100"  showButtons buttonLayout="horizontal" style="height: 3rem; width:8rem" decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary">
                        <template #incrementbuttonicon v-if="!product.inCart">
                            <span class="pi pi-plus" />
                        </template>
                        <template #decrementbuttonicon v-if="!product.inCart">
                            <span class="pi pi-minus" />
                        </template>
                    </InputNumber>
                    <Button class=" pi pi-shopping-cart ms-3" style="height: 3rem" 
                    @click="addCart(product)" > Add cart</Button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .square-button {
    width: 35px;
    height: 35px;
    }

    .flex-center {
    padding-left: 10px;
    display: flex;
    }
</style>