<template>
  <v-data-table-virtual
    :headers="tableHeaders as any"
    :items="filteredItems"
    :loading="loading"
    loading-text="Fetching item data..."
    class="modern-table-item"
    density="comfortable"
    hover
    item-value="id"
  >

    <!-- In Stock -->
    <template #[`item.in_stock`]="{ item }">
      <v-chip
        :color="(item as any).raw?.in_stock || item.in_stock ? '#4CAF50' : '#F44336'" 
        class="status-chip"
        label
        size="small"
      >
        {{ (item as any).raw?.in_stock || item.in_stock ? 'In Stock' : 'Out of Stock' }}
      </v-chip>
    </template>

    <!-- Active Flag -->
    <template #[`item.active_flag`]="{ item }">
      <v-chip
        :color="(item as any).raw?.active_flag || item.active_flag ? '#00BCD4' : '#9E9E9E'" 
        class="status-chip"
        label
        size="small"
      >
        {{ (item as any).raw?.active_flag || item.active_flag ? 'Active' : 'Inactive' }}
      </v-chip>
    </template>

    <!-- Actions -->
    <template #[`item.actions`]="{ item }">
      <div class="action-buttons">
        <v-tooltip text="Edit Item" location="top">
          <template #activator="{ props }">
            <v-btn 
              v-bind="props" 
              icon 
              variant="text" 
              :loading="loadingEditItem === String(item.id || (item as any).raw?.id)"
              @click="$emit('edit', (item as any).raw || item)"
            >
              <v-icon size="22">mdi-pencil-outline</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip :text="item.active_flag || (item as any).raw?.active_flag ? 'Deactivate Item' : 'Activate Item'" location="top">
          <template #activator="{ props }">
            <v-btn 
              v-bind="props" 
              icon 
              variant="text" 
              :loading="loadingDeactivateItem === String(item.id || (item as any).raw?.id)"
              @click="$emit('deactivate', (item as any).raw || item)"
            >
              <v-icon size="22">{{ item.active_flag || (item as any).raw?.active_flag ? 'mdi-toggle-switch-off-outline' : 'mdi-toggle-switch-outline' }}</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </div>
    </template>

    <!-- No Data State -->
    <template #no-data>
      <v-alert icon="mdi-alert-circle-outline" class="ma-4" color="info" variant="tonal">
        No items found. Try adjusting your search.
      </v-alert>
    </template>

  </v-data-table-virtual>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MasterItem, Header } from '@/types/MasterItem';

/* -----------------------------------------------------*
 * PROPS                                                *
 * ---------------------------------------------------- */
const props = defineProps<{
  headers: Header<MasterItem>[];
  items: MasterItem[];
  search: string;
  loading: boolean;
  loadingEditItem: string | null;
  loadingDeactivateItem: string | null;
}>();

/* -----------------------------------------------------*
 * EMITS                                                *
 * ---------------------------------------------------- */
defineEmits(['edit', 'deactivate']);

/* -----------------------------------------------------*
 * COMPUTED                                             *
 * ---------------------------------------------------- */
const tableHeaders = computed(() => {
  // Casting to strict any to satisfy Vuetify's complex header types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return props.headers as any[];
});

const filteredItems = computed(() => {
  if (!props.search) return props.items;

  const keyword = props.search.toLowerCase();
  return props.items.filter(item =>
    item.item_name?.toLowerCase().includes(keyword)
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

.modern-table-item thead th {
  text-transform: uppercase;
  font-weight: bold;
  padding: 12px 16px;
}

</style>