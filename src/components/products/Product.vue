<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { ref, watch , computed} from 'vue'
import ProductDetail from "./ProductDetail.vue"
import { useRouter, onBeforeRouteLeave } from 'vue-router'


const toast = useToast()
const router = useRouter()

const props = defineProps({
    id: {
      type: Number,
      default: null
    }
})

const newProduct = () => {
    return {
      id: null,
      catalogProductId: '',
      manufacturerUsername: '',
      orderId: '',
      productPackages: '',
    }
}

const product = ref(newProduct())

const errors = ref(null)
const confirmationLeaveDialog = ref(null)
// String with the JSON representation after loading the project (new or edit)
let originalValueStr = ''

const loadProduct = async (id) => {
  originalValueStr = ''
  errors.value = null
  if (!id || (id < 0)) {
    product.value = newProduct()
    originalValueStr = JSON.stringify(product.value)
  } else {
      try {
        const response = await axios.get('products/' + id)
        product.value = response.data.data
        originalValueStr = JSON.stringify(product.value)
      } catch (error) {
        console.log(error)
      }
  }
}

const operation = computed( () => (!props.id || props.id < 0) ? 'insert' : 'update')


const save =  () => {
  if (!product.value) {
    toast.error("Product is not defined");
    return;
  }

  if (operation.value == 'insert') {
    axios.post('products', product.value)
      .then((response) => {
        toast.success('Product Created')
        console.dir(response.data.data)
        originalValueStr = JSON.stringify(product.value)
        router.push({name:'Products'})
      })
      .catch((error) => {
        if (error.response && error.response.status == 422) {
          errors.value = error.response.data.errors
          toast.error("Validation Error")
        }
      })
  } else {
    axios.put('products/' + id, product.value)
      .then((response) => {
        toast.success('Product Updated')
        console.dir(response.data.data)
      })
      .catch((error) => {
        if (error.response && error.response.status == 422) {
          errors.value = error.response.data.errors
          toast.error("Validation Error")
        }
      })
  }
}

const cancel =  () => {
  router.back()
}

watch(
  () => props.id,
  (newValue) => {
      loadProduct(newValue)
    },
  {immediate: true}  
)

let nextCallBack = null
const leaveConfirmed = () => {
  if (nextCallBack) {
    nextCallBack()
  }
}

onBeforeRouteLeave((to, from, next) => {
  nextCallBack = null
  let newValueStr = JSON.stringify(product.value)
  if (originalValueStr != newValueStr) {
    // Some value has changed - only leave after confirmation
    nextCallBack = next
    confirmationLeaveDialog.value.show()
  } else {
    // No value has changed, so we can leave the component without confirming
    next()
  }
})

</script>

<template>
  <confirmation-dialog
    ref="confirmationLeaveDialog"
    confirmationBtn="Discard changes and leave"
    msg="Do you really want to leave? You have unsaved changes!"
    @confirmed="leaveConfirmed"
  >
  </confirmation-dialog>  

  <product-detail
    :operationType="operation"
    :product="product"
    :errors="errors"
    @save="save"
    @cancel="cancel"
  ></product-detail>
</template>
