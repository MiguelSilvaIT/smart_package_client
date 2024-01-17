<script setup>

import { ref, watch, computed, inject, onMounted } from "vue";

import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import axios from 'axios'; 

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },

  operationType: {
      type: String,
      default: 'insert'  // insert / update
  },

  errors: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["save", "cancel"]);

const editingProduct = ref(props.product)
//console.log("editingCategory -->" , editingCategory.value)
const catalogProducts = ref([]); // Esta será a nossa lista de produtos do catálogo

const fetchCatalogProducts = async () => {
  try {
    const response = await axios.get('products');
    let products = response.data;
    let uniqueProducts = products.filter((product, index, self) =>
      index === self.findIndex((p) => p.catalogProductId === product.catalogProductId)
    );
    catalogProducts.value = uniqueProducts.map(product => ({ catalogProductId: product.catalogProductId }));
    console.log('Produtos do catálogo carregados:', catalogProducts.value);
  } catch (error) {
    console.error('Erro ao buscar produtos do catálogo:', error);
  }
};

const fetchProduct = async () => {
  try {
    const response = await axios.get('products/' + props.id);
    product.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
  }
};

watch(
  () => props.product,
  (newProduct) => {
    editingProduct.value = newProduct
  },
  { immediate: true }
)

const productTitle = computed( () => {
    if (!editingProduct.value) {
        return ''
      }
      return props.operationType == 'insert' ? 'New Product' : 'Product #' + editingProduct.value.catalogProductId
  })

const save = () => {
  if (editingProduct.value) {
    editingProduct.value.product = editingProduct.value.catalogProductId;
  }
  emit("save", editingProduct.value);
}

const cancel = () => {
  emit("cancel", editingProduct.value);
}
/*
const deleteProduct =  () => {
  emit("deleteProduct", editingProduct.value);
}*/

onMounted(
  () => {
    fetchCatalogProducts();
    fetchProduct();
  }
);
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-2">{{productTitle}}</h3>
    <hr />
    <div class="d-flex flex-wrap mt-4 justify-content-between">
      <div class="w-75 pe-4">
        <div class="col mb-5 ms-xs-3">
          <div class="p-float-label">
            <InputText type="text" v-model="editingProduct.manufacturerUsername" :class="{ 'p-invalid': errors ? errors['manufacturerUsername'] : false }"/>
            <label for="dd-paymentType">Manufacturer Username</label>
            <field-error-message :errors="errors" fieldName="manufacturerUsername"></field-error-message>
          </div>
        </div>    
        <div class="mb-5 ">
          <span class="p-float-label">
            <Dropdown v-model="editingProduct.catalogProductId" 
              :options="catalogProducts" 
              optionLabel="catalogProductId" 
              :class="{ 'p-invalid': errors ? errors['catalogProductId'] : false }"/>
            <label for="number-input">Catalog Product</label>
            <field-error-message :errors="errors" fieldName="catalogProductId"></field-error-message>
          </span>
        </div>
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-end">
      <button type="button" class="btn btn-primary px-5" @click="save">Save</button>
      <button type="button" class="btn btn-light px-5" @click="cancel">Cancel</button>
    </div>
  </form>
</template>

<style scoped>
.total_hours {
  width: 26rem;
}
</style>
