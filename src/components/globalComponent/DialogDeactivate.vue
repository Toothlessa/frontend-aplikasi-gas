<template>
  <v-dialog v-model="localDialog" max-width="450px" persistent>
    <v-card rounded="xl" elevation="12">
      <v-card-title class="dialog-header bg-red-darken-2 text-white">
        <v-icon start>mdi-alert-circle-outline</v-icon>
        {{ title }}
      </v-card-title>
      <v-card-text class="text-body-1 text-center py-6 px-6">
        {{ message }}
      </v-card-text>
      <v-card-actions class="dialog-actions pa-4">
        <v-spacer />
        <v-btn text @click="handleCancel" rounded="lg">No</v-btn>
        <v-btn color="red-darken-2" class="text-white" @click="handleConfirm" rounded="lg">Yes</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  dialog: boolean;
  title: string;
  message: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'update:dialog', val: boolean): void;
}>();

const localDialog = ref(props.dialog);

watch(() => props.dialog, (val) => {
  localDialog.value = val;
  emit('update:dialog', val);
});

const handleConfirm = () => {
  emit('confirm');
  localDialog.value = false;
};

const handleCancel = () => {
  emit('cancel');
  localDialog.value = false;
};
</script>

<style scoped>
.dialog-header {
  font-size: 1.25rem;
  font-weight: 600;
  padding: 16px 24px;
}

.dialog-actions {
  justify-content: flex-end;
}
</style>
