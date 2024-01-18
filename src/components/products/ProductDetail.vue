<script setup>

import { ref, watch, computed, onMounted } from "vue";

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
const productManufacturer = ref(null)
const catalogProductId = ref(null)
const quantity = ref(0)
const catalogProducts = ref([])

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
  emit("save", catalogProductId.value, productManufacturer.value, quantity.value);
}

const cancel = () => {
  emit("cancel", editingProduct.value);
}

const loadProductsCatalog = async () => {
  const response = await axios.get('catalog_products')
  catalogProducts.value = response.data
  console.log(response.data)
}

onMounted(
  () => {
    loadProductsCatalog()
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
          <div class="col mb-3 ms-xs-3">
            <span class="p-float-label">
            <Dropdown v-model="catalogProductId" :options="catalogProducts" optionLabel="name" optionValue="id"/>
            <label>Product Catalog Id</label>
            </span>
          </div>
        </div>    
        <div class="mb-5 ">
          <span class="p-float-label">
            <InputNumber v-model="quantity" :min="0" :max="100"  showButtons buttonLayout="horizontal" style="height: 3rem; width:8rem" decrementButtonClassName="p-button-secondary" incrementButtonClassName="p-button-secondary">
              <template #incrementbuttonicon>
                  <span class="pi pi-plus" />
              </template>
              <template #decrementbuttonicon>
                  <span class="pi pi-minus" />
              </template>
          </InputNumber>
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
