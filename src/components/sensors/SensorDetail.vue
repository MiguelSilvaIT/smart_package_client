<script setup>

import { ref, watch, computed, onMounted } from "vue";

import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import axios from 'axios'; 


const props = defineProps({
  sensor: {
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

const editingSensor = ref(props.sensor)
const name = ref('')
const catalogProducts = ref([])

watch(
  () => props.sensor,
  (newSensor) => {
    editingSensor.value = newSensor
  },
  { immediate: true }
)

const sensorTitle = computed( () => {
    if (!editingSensor.value) {
        return ''
      }
      return props.operationType == 'insert' ? 'New Sensor' : 'Sensor #' + editingSensor.value.id
  })

const save = () => {
  emit("save", name.value);
}

const cancel = () => {
  emit("cancel", editingSensor.value);
}

onMounted(
  () => {
  }
);
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-2">{{sensorTitle}}</h3>
    <hr />
    <div class="d-flex flex-wrap mt-4 justify-content-between">
      <div class="w-75 pe-4">
        <div class="mb-5 ">
          <span class="p-float-label">
            <InputText type="text" v-model="name" 
                    :class="{ 'is-invalid': errors ? errors['name'] : false }"/>
            <label for="number-input">Name</label>
            <field-error-message :errors="errors" fieldName="name"></field-error-message>
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
