<template>
  <v-container fluid>

    <!-- Toolbar Actions -->
    <v-toolbar 
      class="bg-cyan text-white"  
      rounded="lg"
    >
      <v-btn 
        style="color: white;"
        rounded="xl" 
        icon
        @click="openCreateDialog = true, editedItem = {}, error = '', editedIndex = -1;"
      >
          <v-icon>mdi-new-box</v-icon>
      </v-btn>

      <v-btn
        style="color: white;" 
        rounded="xl" 
        icon
        @click="dialogUploadCustomer = true, this.error = ''"
      >
        <v-icon>mdi-cloud-upload</v-icon>
      </v-btn>

      <v-spacer />

      <v-text-field
        v-model="search"
        label="Search by customer name"
        variant="solo-filled"
        class="mr-4"
        style="max-width: 500px;"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        flat
      />
    </v-toolbar>

    <!-- Error Snackbar -->
     <v-snackbar
        v-model="showError"
        :timeout="5000"
        color="red-darken-2"
        location="top center"
        multi-line
        elevation="6"
      >
        <ul class="pl-4 list-disc">
          <li v-for="(e, i) in error" :key="i">{{ e }}</li>
        </ul>
        <template #actions>
          <v-btn variant="text" icon @click="showError = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="hasSaved"
      :timeout="5000"
      color="green-accent-3"
      location="top center"
      multi-line
      elevation="6"
    >
      Data saved successfully!
    </v-snackbar>

    <!-- Customers Data Table -->
    <v-data-table-virtual
      :headers="localHeaders"
      :items="mItems"
      class="elevation-12 bg-cyan-lighten-5 text-black"
      v-model:search="search" 
      :filter-keys="['item_name']" 
      :loading="loading"
      loading-text="Loading... Please wait"
    >
      <template v-slot:[`item.in_stock`]="{ item }">
        <v-chip :color="item.in_stock ? 'green' : 'red'" :text="item.in_stock ? 'In stock' : 'Out of stock'" class="text-uppercase" size="small" label />
      </template>
      <template v-slot:[`item.active_flag`]="{ item }">
        <v-chip :color="item.active_flag ? 'green' : 'black'" size="small" label>
          {{ item.active_flag ? 'Active' : 'Inactive' }}
        </v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-icon size="small" class="mr-2" @click="editItem(item)">mdi-pencil-outline</v-icon>
        <v-icon size="small" @click="updateStatusCustomer(item)">mdi-radioactive</v-icon>
      </template>
    </v-data-table-virtual>

    <!-- Create/Edit Customer Dialog -->
    <v-dialog v-model="openCreateDialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 font-weight-regular bg-cyan">
          <v-icon size="40">{{ formIcon }}</v-icon> {{ formTitle }}
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col v-for="field in fields" :key="field.model" cols="12" sm="6">
              <v-text-field
                v-model="editedItem[field.model]"
                :label="field.label"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="cyan" variant="elevated" @click="openCreateDialog = false">Cancel</v-btn>
          <v-btn color="cyan" variant="elevated" @click="onCreateCustomer">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete/Deactivate Customer Dialog -->
    <v-dialog v-model="dialogDeactivate" max-width="500px">
      <v-card class="elevation-12" variant="elevated">
        <v-card-title class="bg-cyan text-h5 text-center">
          Change Customer Status?
        </v-card-title>

        <v-card-actions class="justify-center">
          <v-btn icon color="cyan" variant="text" @click="close">
            <v-icon size="30">mdi-cancel</v-icon>
          </v-btn>

          <v-btn icon color="cyan" variant="text" @click="onDeactivateCustomer">
            <v-icon size="30">mdi-pokeball</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">

import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { LOAD_MASTER_ITEM } from '@/store/storeconstant';

import type { MasterItem } from '@/types/masteritem'; // ✅ type-only
import { headers } from '@/types/masteritem';         // ✅ runtime value

const store = useStore();

const search = ref<string>('');
const error = ref<string | string[]>('');
const showError = ref<boolean>(false);
const openCreateDialog = ref<boolean>(false);
const dialogUploadCustomer = ref<boolean>(false);
const dialogDeactivate = ref<boolean>(false);

const localHeaders = headers; // Use the imported headers directly
const editedIndex = ref(-1);

const editedItem = reactive<Partial<MasterItem>>({
  item_name: '',
  item_type: '',
  category: '',
  cost_of_goods_sold: '',
  selling_price: '',
});

const fields = reactive([
  { model: 'item_name', label: 'Customer Name' },
  { model: 'item_type', label: 'Type' },
  { model: 'category', label: 'NIK' },
  { model: 'cost_of_goods', label: 'E-mail' },
  { model: 'selling_price', label: 'Address' },
]);

const hasSaved = computed<boolean>(() => store.state.masteritem.hasSaved);
const mItems = computed<MasterItem[]>(() => store.state.masteritem.mItems);
const loading = computed<boolean>(() => store.state.masteritem.loading);

onMounted(() => {
  loadMasterItem();
});

const loadMasterItem = () =>
  store.dispatch(`masteritem/${LOAD_MASTER_ITEM}`);

</script>