<template>
  <v-data-table-virtual
    :headers="headers"
    :items="items"
    :loading="loading"
    :v-model:search="search"
    :filter-keys="['item_name']"
    loading-text="Loading... Please wait"
    class="elevation-10 bg-cyan-lighten-5 text-black rounded-xl"
    density="comfortable"
    hover
    item-value="id"
  >
    <!-- In Stock -->
    <template v-slot:[`item.in_stock`]="{ item }">
      <v-chip
        :color="item.in_stock ? 'green-darken-1' : 'red-darken-1'"
        class="text-white text-uppercase"
        size="small"
        label
      >
        {{ item.in_stock ? 'In Stock' : 'Out of Stock' }}
      </v-chip>
    </template>

    <!-- Active Flag -->
    <template v-slot:[`item.active_flag`]="{ item }">
      <v-chip
        :color="item.active_flag ? 'cyan-darken-2' : 'grey-darken-3'"
        class="text-white"
        size="small"
        label
      >
        {{ item.active_flag ? 'Active' : 'Inactive' }}
      </v-chip>
    </template>

    <!-- Actions -->
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn
        icon
        size="small"
        color="primary"
        variant="text"
        class="mr-1"
        @click="$emit('edit', item)"
      >
        <v-icon size="18">mdi-pencil-outline</v-icon>
      </v-btn>
      <v-btn
        icon
        size="small"
        color="red-darken-1"
        variant="text"
        @click="$emit('deactivate', item)"
      >
        <v-icon size="18">mdi-radioactive</v-icon>
      </v-btn>
    </template>
  </v-data-table-virtual>
</template>

<script setup lang="ts">
import type { MasterItem } from '@/types/masteritem';
import type { Header } from '@/types/masteritem';

defineProps<{
  headers: Header[];
  items: MasterItem[];
  search: string;
  loading: boolean;
}>();

defineEmits(['edit', 'deactivate']);
</script>
