<template>
  <Transaction />
</template>

<script>
import { defineComponent } from 'vue'

// Components
import Transaction from '@/components/transactions/Transaction.vue'

export default defineComponent({
  name: 'TransactionView',

  components: {
    Transaction,
  },
})
</script>
