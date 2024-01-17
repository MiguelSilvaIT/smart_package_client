<script setup>
import { ref, inject } from "vue";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
// import { useToast } from "vue-toastification";
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Card from 'primevue/card';

const toast = useToast();
const serverBaseUrl = inject("serverBaseUrl");

const props = defineProps({
  transportPackages: {
    type: Array,
    default: () => [],
  },
  showMaterial: {
    type: Boolean,
    default: true,
  },
  showType: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },
  showId: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["edit"]);

const editClick = (transportPackage) => {
  emit("edit", transportPackage);
};

const selectedTransportPackage = ref();

const onRowExpand = (event) => {
  toast.add({ severity: 'info', summary: 'Transport Package Expanded', detail: event.data.name, life: 3000 });
};
const onRowCollapse = (event) => {
  toast.add({ severity: 'info', summary: 'Transport Package Collapsed', detail: event.data.name, life: 3000 });
};

</script>

<template>
  <DataTable v-model:expandedRows="selectedTransportPackage" @rowSelect="onRowExpand" @rowUnselect="onRowCollapse"
     v-model:selection="selectedTransportPackage" :value="transportPackages" 
     selectionMode="multiple" dataKey="id"
     :metaKeySelection=false paginator sortField="id" :sortOrder="-1" :rows="30" stripedRows >
      <Column v-if="showId" field="id" header="Id"></Column>
      <Column v-if="showMaterial" field="material" header="Material"></Column>
      <Column v-if="showType" field="type" header="Type"></Column>
      <Column v-if="showEditButton" header="Edit">
          <template #body="slotProps">
              <button
                class="btn btn-xs btn-light"
                @click="editClick(slotProps.data)"
                v-if="showEditButton"
              >
                <i class="bi bi-xs bi-pencil"></i>
              </button>
          </template>
      </Column>
        <template #expansion="slotProps">
              <div class="expandedDiv">
                <h5 class="ms-3">Transport Packages #{{ slotProps.data.id }}</h5>
                <div class="contentContainer">
                  <div>
                    <p >
                      <strong>Material:</strong> {{ slotProps.data.material }}
                    </p>
                    <p >
                      <strong>Type:</strong> {{ slotProps.data.type }}
                    </p>
                  </div>
                  <div>
                    <p  >
                        <strong>Sensors:</strong>  {{ slotProps.data.sensors }}
                    </p>
                    <p >
                        <strong>Orders:</strong> {{ slotProps.data.orders }}
                    </p>
                  </div>                  
                </div>
              </div>
        </template>
    </DataTable>
  <Toast />
</template>

<style scoped>
button {
  margin-left: 3px;
  margin-right: 3px;
}

.credit_value{
  color: #007bff;
}

.expandedDiv {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  min-height: 100px;
  background-color: white;
  margin: 5px;
  border-radius: 4px;
  border-bottom: 1px solid darkgray;
  padding: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08), 0 6px 6px rgba(0, 0, 0, 0.1);
}
.contentContainer{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  
  /* align-items: center; */
  /* background-color: red; */
}

.catDescDetail{
  margin-right: 4px;
  max-width: 250px;
  min-width: 250px;
}
</style>