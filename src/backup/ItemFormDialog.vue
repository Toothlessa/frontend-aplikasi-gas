// ItemFormDialog.vue
<template>
  <BaseDialog
    v-model="localDialog"
    title="Item Form"
    icon="mdi-new-box"
  >
    <template #content>
      <v-alert v-if="error" v-model="alert" class="text-teal" border="start" variant="tonal" closable>
        {{ error }}
      </v-alert>
      <v-container>
        <v-text-field v-model="editedItem.item_name" label="Item Name" variant="outlined" />
        <v-row>
          <v-col cols="12" md="6" v-for="field in autocompleteFields" :key="field.model">
            <v-autocomplete
              :label="field.label"
              v-model="editedItem[field.model]"
              :items="field.items"
              :item-title="field.itemTitle"
              :item-value="field.itemValue"
              variant="outlined"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" md="6" v-for="field in numericFields" :key="field.model">
            <v-text-field
              :label="field.label"
              v-model="editedItem[field.model]"
              variant="outlined"
              @keyup.enter="field.enterSave ? save() : null"
            />
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template #actions>
      <v-btn prepend-icon="mdi-shape-plus" color="grey-darken-2" variant="outlined" @click="dialogCategory = true">Add Category</v-btn>
      <v-btn color="grey-darken-2" variant="outlined" @click="close">
        <v-icon size="30">mdi-cancel</v-icon>
      </v-btn>
      <v-btn color="grey-darken-2" variant="outlined" @click.prevent="save">
        <v-icon size="30">mdi-content-save</v-icon>
      </v-btn>
    </template>
  </BaseDialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseDialog from './BaseDialog.vue';

const props = defineProps({
  dialog: Boolean,
  editedItem: Object,
  autocompleteFields: Array,
  numericFields: Array,
  error: String,
  alert: Boolean,
  dialogCategory: Boolean
});

const emit = defineEmits(['update:dialog', 'close', 'save']);

const localDialog = ref(props.dialog);

watch(() => props.dialog, (val) => {
  localDialog.value = val;
});

watch(localDialog, (val) => {
  emit('update:dialog', val);
});

function close() {
  emit('close');
}

function save() {
  emit('save');
}
</script>
