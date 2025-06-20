// CategoryDialog.vue
<template>
  <BaseDialog
    v-model="dialog"
    title="Categories"
    icon="mdi-shape-plus"
    maxWidth="400px"
  >
    <template #content>
      <v-alert v-if="error" v-model="alert" class="text-red" border="start" variant="tonal" closable>
        {{ error }}
      </v-alert>
      <v-text-field
        class="pa-2 ma-2"
        v-model="categoryData.name"
        label="Category"
        variant="outlined"
        @keyup.enter="createCategory"
      />
      <div class="text-center">
        <v-btn class="bg-grey-darken-2" prepend-icon="mdi-copyright" text="Create" variant="outlined" @click="createCategory" />
        <v-btn class="bg-grey-darken-2" prepend-icon="mdi-close-circle-outline" text="Close" variant="outlined" @click="() => dialog = false" />
      </div>
      <v-divider class="my-2" />
      <v-data-table
        :headers="categoryHeaders"
        :items="categoryItems"
        hide-default-footer
      >
        <template #item.number="{ index }">
          <td>{{ index + 1 }}</td>
        </template>
        <template #item.actions="{ item }">
          <div class="text-end">
            <v-icon size="small" @click="editCategories(item)">mdi-pencil-outline</v-icon>
            <v-icon size="small" @click="updateStatusCategory(item)">mdi-radioactive</v-icon>
          </div>
        </template>
        <template #item.active_flag="{ item }">
          <div class="text-center">
            <v-chip
              :color="item.active_flag ? 'green' : 'black'"
              :text="item.active_flag ? 'Active' : 'Inactive'"
              class="text-uppercase"
              size="small"
              label
            />
          </div>
        </template>
      </v-data-table>
    </template>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from './BaseDialog.vue';
const props = defineProps([
  'dialog', 'alert', 'error', 'categoryData', 'categoryHeaders', 'categoryItems',
  'createCategory', 'editCategories', 'updateStatusCategory'
]);
</script>