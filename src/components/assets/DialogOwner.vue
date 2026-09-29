<template>
  <v-dialog v-model="localDialog" max-width="600px" persistent>
    <v-card class="dialog-card" rounded="xl" :class="isDark ? 'dialog-card-dark' : 'dialog-card-light'">
      <!-- Header -->
      <v-card-title class="dialog-header" :class="isDark ? 'dialog-header-dark' : 'dialog-header-light'">
        <v-icon size="26" class="mr-3">{{ 'mdi-account-plus-outline' }}</v-icon>
        <span class="text-h6 font-weight-medium">
             Add New Owner
        </span>
      </v-card-title>

      <!-- Form Fields -->
      <v-card-text class="pa-6">
        <v-text-field
          v-model="localOwner.name"
          label="Owner Name"
          variant="outlined"
          density="comfortable"
          class="form-field"
          rounded="lg"
        />
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="dialog-actions" :class="isDark ? 'dialog-actions-dark' : 'dialog-actions-light'">
        <v-btn
          variant="text"
          class="cancel-btn"
          @click="handleClose"
          rounded="pill"
        >
          Cancel
        </v-btn>
        <v-btn
          variant="elevated"
          class="save-btn"
          @click="handleSave"
          rounded="pill"
          :loading="loadingButtonOwner"
        >
          Save        
        </v-btn>
      </v-card-actions>

      <!-- Search Bar -->
      <v-toolbar flat :class="isDark ? 'search-toolbar-dark pa-2' : 'bg-grey-lighten-4 pa-2'" density="comfortable">
        <v-text-field
          v-model="search"
          label="Search Owners"
          variant="solo-filled"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          clearable
          class="flex-grow-1"
          rounded="lg"
          hide-details
        />
      </v-toolbar>

      <!-- Table -->
      <v-data-table-virtual
        :headers="headers"
        :items="filteredItems"
        :class="isDark ? 'modern-table-dark' : 'modern-table-light'"
        :loading="loadingOwner"
        loading-text="Loading owners..."
        density="comfortable"
        item-value="id"
        hover
        height="300"
      >
        <template v-slot:[`item.active_flag`]="{ item }">
          <v-chip
            :color="item.active_flag ? 'teal' : 'red-lighten-1'"
            class="text-white font-weight-bold"
            size="small"
            label
            rounded="md"
          >
            {{ item.active_flag ? 'Active' : 'Inactive' }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            icon="mdi-pencil-outline"
            size="small"
            variant="text"
            class="mr-1 text-primary"
            @click="handleEdit(item)"
          />
          <v-btn
            icon="mdi-radioactive"
            size="small"
            variant="text"
            class="text-red-lighten-1"
            @click="openDeactivateDialog(item)"
          />
        </template>
      </v-data-table-virtual>
    </v-card>
  </v-dialog>
  <DialogDeactivate
    :dialog="dialogDeactivate"
    title="Confirm Deactivation"
    message="Are you sure you want to deactivate this owner?"
    @confirm="onDeactivateConfirm"
    @cancel="dialogDeactivate = false"
  />

  <!-- Snackbar for errors -->
  <v-snackbar
    v-model="validationShowError"
    color="error"
    location="top right"
    rounded="xl"
    elevation="12"
  >
    <div class="d-flex align-start ga-2">
      <v-icon
        size="20"
      >
        mdi-alert-circle-outline
      </v-icon>

      <div class="d-flex flex-column">
        <span
          v-for="(msg, i) in validationErrorMessages"
          :key="i"
          class="text-body-2"
        >
          {{ msg }}
        </span>
      </div>
    </div>

    <template v-slot:actions>
      <v-btn
        color="white"
        variant="text"
        icon="mdi-close"
        @click="validationShowError = false"
      />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useOwner } from '@/composables/useOwner';
import { watch, computed, reactive, ref } from "vue";
import type { Owner, HeaderOwner } from '@/types/Asset';
import DialogDeactivate from '@/components/globalComponent/DialogDeactivate.vue';
import { useGlobal } from '@/composables/useGlobal';

  /*------------------------------------------------------*
  * PROPS                                                 *
  *-------------------------------------------------------*/
const props = defineProps<{
  dialog: boolean;
  owners: Owner[];
  headers: HeaderOwner[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

  /*------------------------------------------------------*
  * COMPOSABLE                                              *
  *-------------------------------------------------------*/
const {
  theme,
  validationError,
  validationErrorMessages,
  validationShowError,
} = useGlobal();

const isDark = computed(() => theme.global.current.value.dark);

const {
  loadingOwner,
  loadingButtonOwner,
  loadOwners,
  createOwner,
  updateOwner,
  deactivateOwner,
} = useOwner();


  /*------------------------------------------------------*
  * LOCAL VARIABLES                                       *
  *-------------------------------------------------------*/
  const dialogDeactivate = ref(false);
  const localDialog = ref(props.dialog);
  const search = ref('');

  const selectedItem = ref<Owner | null>(null);
  const localOwner = reactive<Partial<Owner>>({});

  const defaultOwner: Partial<Owner> = {
    name: '',
    active_flag: true,
    inactive_date: '',
  };

  /*------------------------------------------------------*
  * WATCHERS                                              *
  *-------------------------------------------------------*/
watch(
  () => props.dialog,
  (val) => {
    localDialog.value = val;
    if (val) {
      loadOwners();
      Object.assign(localOwner, defaultOwner);
      delete localOwner.id;
    }
  },
  { immediate: true }
);


  /*------------------------------------------------------*
  * FUNCTIONS                                             *
  *-------------------------------------------------------*/
 const filteredItems = computed(() => {
  if (!search.value) return props.owners;

  const keyword = search.value.toLowerCase();
  return props.owners.filter(item =>
    item.name?.toLowerCase().includes(keyword)
  );
});

 const handleEdit = (item: Owner) => {
    Object.assign(localOwner, item);
  };

  const openDeactivateDialog = (item: Owner) => {
    selectedItem.value = item;
    dialogDeactivate.value = true;
  };

  const handleClose = () => {
    emit('close');
    Object.assign(localOwner, defaultOwner);
    delete localOwner.id; 
  };

  const handleSave = async () => {
    try {
      if (localOwner.id) {
        await updateOwner(localOwner as Owner);
      } else {
        await createOwner(localOwner);
      }
      setTimeout(() => {
        handleClose();
      }, 300);
    } catch (e) {
      validationError(e);
      }
  };

  const onDeactivateConfirm = async () => {
    if (selectedItem.value) {
      try {
        await deactivateOwner(selectedItem.value.id);
        dialogDeactivate.value = false;
      } catch (e) {
        validationError(e);
      }
    }
  };

</script>

<style scoped>
.dialog-card-light {
  box-shadow: 0 10px 30px -5px rgba(0,0,0,0.2) !important;
  background: #FFFFFF !important;
}

.dialog-card-dark {
  box-shadow: 0 10px 30px -5px rgba(0,0,0,0.5) !important;
  background: #1e1e24 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.dialog-header-light {
  background: linear-gradient(135deg, #009688 0%, #26A69A 100%);
  color: white;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.dialog-header-dark {
  background: linear-gradient(135deg, #00695C 0%, #00897B 100%);
  color: white;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.form-field {
  margin-bottom: 16px;
}

.dialog-actions-light {
  padding: 16px 24px;
  background-color: #f7f9fa;
  border-top: 1px solid #e0e0e0;
  justify-content: flex-end;
}

.dialog-actions-dark {
  padding: 16px 24px;
  background-color: #1a1a20;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  justify-content: flex-end;
}

.search-toolbar-dark {
  background-color: #1a1a20 !important;
}

.cancel-btn {
  margin-right: 8px;
}

.save-btn {
  background-color: #009688;
  color: white;
  font-weight: 500;
}

/* Table Light */
.modern-table-light {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}
.modern-table-light :deep(.v-table__wrapper) {
  background-color: transparent !important;
}
.modern-table-light :deep(thead) {
  background-color: #f8fafc;
}
.modern-table-light :deep(th) {
  color: #475569 !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0 !important;
}
.modern-table-light :deep(td) {
  color: #1e293b !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

/* Table Dark */
.modern-table-dark {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.modern-table-dark :deep(.v-table__wrapper) {
  background-color: transparent !important;
}
.modern-table-dark :deep(thead) {
  background-color: rgba(255, 255, 255, 0.04);
}
.modern-table-dark :deep(th) {
  color: #cbd5e1 !important;
  font-weight: 600 !important;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.modern-table-dark :deep(td) {
  color: #f1f5f9 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
.modern-table-dark :deep(tbody tr:hover td) {
  background-color: rgba(0, 150, 136, 0.12) !important;
}
</style>