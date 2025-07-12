<template>
  <v-dialog v-model="localDialog" max-width="450px" persistent>
    <v-card class="rounded-xl elevation-12" rounded="xl">
      <v-card-title class="dialog-header-deactivate">
        <v-icon class="mr-2" size="28">mdi-alert-circle-outline</v-icon>
        <span class="text-h6 font-weight-medium">{{ title }}</span>
      </v-card-title>

      <v-card-text class="text-center text-body-1 pt-6 px-6">
        {{ message }}
      </v-card-text>

      <v-card-actions class="justify-end px-6 pb-4">
        <v-btn
          color="grey-darken-1"
          variant="outlined"
          class="rounded-pill"
          @click="$emit('cancel')"
        >
          <v-icon start>mdi-cancel</v-icon>
          Cancel
        </v-btn>

        <v-btn
          color="cyan-darken-1"
          variant="elevated"
          class="text-white rounded-pill"
          @click="$emit('confirm')"
        >
          <v-icon start>mdi-check-circle-outline</v-icon>
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';

const props = defineProps<{
  dialog: boolean;
  title?: string;
  message?: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'update:dialog', val: boolean): void;
}>();

const localDialog = ref(props.dialog);

// Watch for changes from parent
watch(() => props.dialog, (val) => {
  localDialog.value = val;
});

// Emit changes to parent when closed
watch(localDialog, (val) => {
  emit('update:dialog', val);
});

</script>

<style scoped>
.dialog-header-deactivate {
  background: linear-gradient(to right, #00BCD4, #4DD0E1);
  color: white;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>