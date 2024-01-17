<script setup>
import { ref, watch, computed, inject } from "vue";

import axios from "axios";
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { useToast } from "vue-toastification";


const toast = useToast()

const props = defineProps({
  transportPackage: {
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

const editingTransportPackage = ref(props.transportPackage)

watch(
  () => props.transportPackage,
  (newTransportPackage) => {
    editingTransportPackage.value = newTransportPackage
  },
  { immediate: true }
)

const showDialog = ref(false);

const hideDialog = () => {
  showDialog.value = false
  errors.value = null
};

const transportPackageTitle = computed( () => {
    if (!editingTransportPackage.value) {
      return ''
    }
    return props.operationType == 'insert' ? 'New Transport Package' : 'Transport Package #' + editingTransportPackage.value.id
})

const operation = computed( () => props.operationType == 'insert' ? 'insert' : 'update')

const save = () => {
  emit("save", editingTransportPackage.value);
}

const cancel = () => {
  emit("cancel", editingTransportPackage.value);
}
</script>

<template>
  <form class="row g-3 needs-validation" v-if = "operation == 'insert'" novalidate @submit.prevent="showDialog=true">
    <h3 class="mt-5 mb-2">{{transportPackageTitle}}</h3>
    <hr />
    <div class="d-flex flex-wrap mt-4 justify-content-between">
      <div class="w-75 pe-4">
        <div class="col mb-5 ms-xs-3">
          <span class="p-float-label">
            <InputText v-model="editingTransportPackage.material"
                        :class="{ 'p-invalid': errors ? errors['material'] : false }"/>
            <label>Material</label>
            <field-error-message :errors="errors" fieldName="material"></field-error-message>
          </span> 
        </div>
        <div class="col mb-5 ms-xs-3">
          <div class="p-float-label">
            <Dropdown v-model="editingTransportPackage.type" :options="type" optionLabel="type" 
                          :class="{ 'p-invalid': errors ? errors['type'] : false }"/>
            <label for="dd-paymentType">Type</label>
            <field-error-message :errors="errors" fieldName="type"></field-error-message>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-end">
      <button type="button" class="btn btn-primary px-5" @click="showDialog=true">Save</button>
      <button type="button" class="btn btn-light px-5" @click="cancel">Cancel</button>
    </div>
  </form>
</template>

<style scoped>
.total_hours {
  width: 26rem;
}
.formLabel {
  font-size: 12px;
    opacity: 0.7;
    margin-bottom: 6px;
    margin-left: 12px;
}
</style>
