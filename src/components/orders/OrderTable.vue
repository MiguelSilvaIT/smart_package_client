<script setup>
import axios from 'axios'
import { ref, watch, watchEffect } from "vue";

const props = defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
  showId: {
    type: Boolean,
    default: true,
  },
  showClient: {
    type: Boolean,
    default: true,
  },
  showCreationDate: {
    type: Boolean,
    default: true,
  },
  showStatus: {
    type: Boolean,
    default: true,
  },
  showLogisticOperatorName: {
    type: Boolean,
    default: true,
  },
  showDetailsButton: {
    type: Boolean,
    default: true,
  },
  showDeleteButton: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["detail"]);

const editingOrders = ref(props.orders);

watch(
  () => props.orders,
  (newOrders) => {
    editingOrders.value = newOrders;
  }
);

// Alternative to previous watch
// watchEffect(() => {
//   editingOrders.value = props.orders
// })


const detailClick = (order) => {
  emit("detail", order);
};

</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th v-if="showId">#</th>
        <th class="text-center" v-if="showClient">Client</th>
        <th v-if="showCreationDate">Creation Date</th>
        <th v-if="showStatus">Status</th>
        <th v-if="showLogisticOperatorName">Logistic Operator</th>
        <th v-if="showDetailsButton">Details</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td v-if="showId">{{ order.id }}</td>
        <td class="text-center" v-if="showClient">{{ order.clientUsername }}</td>
        <td v-if="showCreationDate">{{ order.creation_date }}</td>
        <td v-if="showStatus">{{ order.status }}</td>
        <td v-if="showLogisticOperatorName">
          {{ order.logisticsOperatorUsername }}
        </td>
        <td class="text-end" v-if="showDetailsButton">
          <button class="btn btn-xs btn-light" @click="detailClick(order)" v-if="showDetailsButton">
            <i class="bi bi-eye"></i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.completed {
  text-decoration: line-through;
}

button {
  margin-left: 3px;
  margin-right: 3px;
}
</style>
