<script setup>
import { ref, watch, computed, inject } from "vue";
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import axios from "axios";
import { useToast } from "vue-toastification";


const serverBaseUrl = inject("serverBaseUrl");


const props = defineProps({
  order: {
    type: Object,
    required: true,
  },

  errors: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["save", "cancel"]);

const editingOrder = ref(props.order)
const inputPhotoFile = ref(null)
const editingImageAsBase64 = ref(null)
const deletePhotoOnTheServer = ref(false)
const toast = useToast()
const password = ref('')

const showDialog = ref(false)

watch(
  () => props.order,
  (newOrder) => {
    editingOrder.value = newOrder
  },
  { immediate: true },
  
)


const save = () => {
  const orderToSave = editingOrder.value
  emit("save", orderToSave);
}

const cancel = () => {
  emit("cancel", editingOrder.value);
}
</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-3">{{ order.id }}</h3>
    <hr />
    <div class="d-flex flex-wrap justify-content-between">
      <div class="w-75 pe-4">
        <div class="mb-5">
          <span class="p-float-label">
            <InputText type="text" v-model="editingOrder.name" 
                    :class="{ 'is-invalid': errors ? errors['name'] : false }"/>
            <label for="number-input">Name</label>
            <field-error-message :errors="errors" fieldName="name"></field-error-message>
          </span>
        </div>
        <div class="mb-5">
          <span class="p-float-label">
            <InputText type="text" v-model="editingVcard.email" 
                    :class="{ 'is-invalid': errors ? errors['email'] : false }"/>
            <label for="number-input">Email</label>
            <field-error-message :errors="errors" fieldName="email"></field-error-message>
          </span>
        </div>
        <div class="mb-5" v-if="inserting">
          <span class="p-float-label">
            <InputText type="text" v-model="editingVcard.phone_number" 
                    :class="{ 'is-invalid': errors ? errors['phone_number'] : false }"/>
            <label for="number-input">Phone Number</label>
            <field-error-message :errors="errors" fieldName="phone_number"></field-error-message>
          </span>
        </div>
        <!-- <div class="mb-3 px-1" v-if="inserting">
          <label for="inputPhoneNumber" class="form-label">Número de telemóvel</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors ? errors['phone_number'] : false }"
            id="inputPhoneNumber"
            placeholder="Número de telemóvel"
            required
            v-model="editingVcard.phone_number"
          />
          <field-error-message :errors="errors" fieldName="phone_number"></field-error-message>
        </div> -->

        <div class="mb-5" v-if="inserting">
          <span class="p-float-label">
            <InputText type="password" v-model="editingVcard.password" 
                    :class="{ 'is-invalid': errors ? errors['password'] : false }"/>
            <label for="number-input">Password</label>
            <field-error-message :errors="errors" fieldName="password"></field-error-message>
          </span>
        </div>
        <div class="mb-5" v-if="inserting">
          <span class="p-float-label">
            <InputText type="password" v-model="editingVcard.password_confirmation" 
                    :class="{ 'is-invalid': errors ? errors['password_confirmation'] : false }"/>
            <label for="number-input">Password Confirmation</label>
            <field-error-message :errors="errors" fieldName="password_confirmation"></field-error-message>
          </span>
        </div>
        <div class="mb-5" v-if="inserting">
          <span class="p-float-label">
            <InputText type="password" v-model="editingVcard.confirmation_code" 
                    :class="{ 'is-invalid': errors ? errors['confirmation_code'] : false }"/>
            <label for="number-input">Confirmation Code</label>
            <field-error-message :errors="errors" fieldName="confirmation_code"></field-error-message>
          </span>
        </div>
      </div>
      <div class="w-25">
        <div class="d-flex flex-column">
          <div class="form-control text-center">
            <img :src="photoFullUrl" class="w-100" />
          </div>
          <div class="mt-3 d-flex justify-content-between flex-wrap">
            <label for="inputPhoto" class="btn btn-dark flex-grow-1 mx-1">Carregar</label>
            <button class="btn btn-secondary flex-grow-1 mx-1" @click.prevent="resetToOriginalPhoto" v-if="editingVcard.photo_url">Repor</button>
            <button class="btn btn-danger flex-grow-1 mx-1" @click.prevent="cleanPhoto" v-show="editingVcard.photo_url || editingImageAsBase64">Apagar</button>
          </div>
          <div>
            <field-error-message :errors="errors" fieldName="base64ImagePhoto"></field-error-message>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-end">
      <button type="button" class="btn btn-primary px-5" @click="save">Save</button>
      <button type="button" class="btn btn-light px-5" @click="cancel">Cancel</button>
      <!-- <button type="button" class="btn btn-danger px-5" @click="deleteVcard">Delete</button> -->
      <button type="button" class="btn btn-danger px-5" @click="showDialog = true">Delete</button>
      <Dialog header="Apagar vCard" v-model:visible="showDialog" :modal="true" :closable="false">
        <p>Please insert your confirmation code</p>
        <InputText v-model="confirmationCode" placeholder="Enter confirmation code" type="password"/>
        <p class="mt-4">Please insert your password </p>
        <InputText v-model="password" placeholder="Enter Password" type="password"/>
        <div class="p-d-flex p-jc-end p-mt-3 mt-4">
          <Button label="Confirm" class="p-button-danger m-3" @click="confirmDeletion" />
          <Button label="Cancel" class="p-button-secondary m-3" @click="showDialog = false" />
        </div>
      </Dialog>
    </div>
  </form>
  <input type="file" style="visibility:hidden;" id="inputPhoto" ref="inputPhotoFile" @change="changePhotoFile" />
</template>

<style scoped>

</style>
