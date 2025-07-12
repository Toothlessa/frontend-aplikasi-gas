<template>
  <v-data-table
    :headers="headers"
    :items="filteredItems"
    :loading="loading"
    loading-text="Fetching customer data..."
    class="modern-table"
    density="comfortable"
    hover
    item-value="id"
  >
    <!-- Custom Header -->
    <template #header="{ props: headerProps }">
      <thead class="table-header">
        <tr>
          <th 
            v-for="header in headerProps.headers"
            :key="header.key"
            class="text-left px-4 py-3 font-weight-bold text-uppercase"
          >
            {{ header.title }}
          </th>
        </tr>
      </thead>
    </template>

    <!-- Active Flag -->
    <template #[`item.active_flag`]="{ item }">
      <v-chip
        :color="item.active_flag ? '#00BCD4' : '#9E9E9E'" 
        class="status-chip"
        label
        size="small"
      >
        {{ item.active_flag ? 'Active' : 'Inactive' }}
      </v-chip>
    </template>

    <!-- Actions -->
    <template #[`item.actions`]="{ item }">
      <div class="action-buttons">
        <v-tooltip text="Edit Customer" location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="text" @click="$emit('edit', item)">
              <v-icon size="22">mdi-pencil-outline</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip :text="item.active_flag ? 'Deactivate Customer' : 'Activate Customer'" location="top">
          <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="text" @click="$emit('deactivate', item)">
              <v-icon size="22">{{ item.active_flag ? 'mdi-toggle-switch-off-outline' : 'mdi-toggle-switch-outline' }}</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </div>
    </template>

    <!-- No Data State -->
    <template #no-data>
      <v-alert icon="mdi-alert-circle-outline" class="ma-4" color="info" variant="tonal">
        No customers found. Try adjusting your search.
      </v-alert>
    </template>

  </v-data-table>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Customer, Header } from '@/types/Customer';

const props = defineProps<{
  headers: Header[];
  items: Customer[];
  search: string;
  loading: boolean;
}>();

defineEmits(['edit', 'deactivate']);

// Manual filtering logic
const filteredItems = computed(() => {
  if (!props.search) return props.items;

  const keyword = props.search.toLowerCase();
  return props.items.filter(item =>
    item.customer_name?.toLowerCase().includes(keyword)
  );
});
</script>

<style scoped>
.modern-table {
  border-radius: 12px;
  overflow: hidden; /* Ensures rounded corners are applied to content */
}

.modern-table .v-data-table-header {
  background-color: #f5f5f5; /* Light grey header */
  color: #333;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-table .v-data-table__tr:hover {
  background-color: #e0f7fa !important; /* Light cyan on hover */
}

/* General table cell padding */
.modern-table .v-data-table-header th,
.modern-table .v-data-table__td {
  padding: 12px 16px;
}

.modern-table .v-data-table__tr {
  border-bottom: 1px solid #eee; /* Subtle row divider */
}

.modern-table .v-data-table__tr:last-child {
  border-bottom: none; /* No border on the last row */
}

.status-chip {
  font-weight: bold;
  border-radius: 6px;
}

.action-buttons .v-btn {
  color: #757575; /* Grey for actions */
  transition: color 0.2s ease, transform 0.2s ease;
}

.action-buttons .v-btn:hover {
  color: #00ACC1; /* Cyan on hover */
  transform: scale(1.1);
}
</style>
