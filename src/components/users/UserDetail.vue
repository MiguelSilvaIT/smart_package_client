<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  errors: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["save", "cancel"]);

const editingUser = ref(props.user)

watch(
  () => props.user,
  (newUser) => {
    editingUser.value = newUser
  },
  { immediate: true }
)

const userTitle = computed(()=>{
  if (!editingUser.value) {
    return ''
  }
  return props.inserting ? 'Register a new user' : 'User #' + editingUser.value.id
})



const save = () => {
  const userToSave = editingUser.value
  emit("save", editingUser.value);
}

const cancel = () => {
  emit("cancel", editingUser.value);
}

</script>

<template>
  <form class="row g-3 needs-validation" novalidate @submit.prevent="save">
    <h3 class="mt-5 mb-3">User #{{ userTitle }}</h3>
    <hr />
    <div class="d-flex flex-wrap justify-content-between">
      <div class="w-75 pe-4">
        <div class="mb-3">
          <label  class="form-label">Name</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors ? errors['name'] : false }"
            id="inputName"
            placeholder="Name"
            required
            v-model="editingUser.name"
          />
          <field-error-message :errors="errors" fieldName="name"></field-error-message>
        </div>
        <div class="mb-3">
          <label class="form-label">Username</label>
          <input
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors ? errors['username'] : false }"
            id="inputName"
            placeholder="UserName"
            required
            v-model="editingUser.username"
          />
          <field-error-message :errors="errors" fieldName="username"></field-error-message>
        </div>

        <div class="mb-3 px-1">
          <label class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors ? errors['email'] : false }"
            id="inputEmail"
            placeholder="Email"
            required
            v-model="editingUser.email"
          />
          <field-error-message :errors="errors" fieldName="email"></field-error-message>
        </div>
        <div class="mb-3">
          <label class="form-label">Role</label>
          <select
            class="form-control"
            :class="{ 'is-invalid': errors ? errors['role'] : false }"
            id="inputType"
            required
            v-model="editingUser.role"
          >
            <option value="">Select a role</option>
            <option value="LogisticsOperator">Logistic Operator</option>
            <option value="Manufacturer">Manufacturer</option>
            <option value="Client">Client</option>
          </select>
          <field-error-message :errors="errors" fieldName="role"></field-error-message>
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
