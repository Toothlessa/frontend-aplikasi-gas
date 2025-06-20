// ConfirmDialog.vue
<template>
  <BaseDialog
    v-model="dialog"
    :title="title"
    :icon="icon"
    :maxWidth="width"
  >
    <template #actions>
      <v-spacer />
      <v-btn color="blue-darken-2" variant="text" @click="onCancel">
        <v-icon size="30">mdi-cancel</v-icon>
      </v-btn>
      <v-btn color="blue-darken-2" variant="text" @click="onConfirm">
        <v-icon size="30">mdi-check</v-icon>
      </v-btn>
      <v-spacer />
    </template>
  </BaseDialog>
</template>

<script setup>
import BaseDialog from './BaseDialog.vue';
const props = defineProps({
  dialog: Boolean,
  title: String,
  icon: String,
  width: {
    type: String,
    default: '500px'
  },
  onCancel: Function,
  onConfirm: Function
});
</script>

