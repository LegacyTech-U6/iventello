<template>
  <div class="invoice-summary">
    <div class="summary-table">
      <div class="summary-row">
        <span class="label">Subtotal:</span>
        <span class="value">{{ format(subtotal) }}</span>
      </div>

      <div v-if="discount > 0" class="summary-row">
        <span class="label">Discount ({{ discount }}%):</span>
        <span class="value discount">-{{ format(discountAmount) }}</span>
      </div>

      <div class="summary-row">
        <span class="label">Tax ({{ taxRate }}%):</span>
        <span class="value">{{ format(taxAmount) }}</span>
      </div>

      <div class="summary-row total">
        <span class="label">TOTAL:</span>
        <span class="value total-amount">{{ format(total) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrency} from '@/composable/useCurrency'
const {format} = useCurrency()

const props = defineProps({
  items: { type: Array, default: () => [] },
  discount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },
})

const subtotal = computed(() =>
  props.items.reduce((sum, item) => sum + item.selling_price * item.quantity, 0),
)

const discountAmount = computed(() =>
  parseFloat(((subtotal.value * props.discount) / 100).toFixed(2)),
)

const taxAmount = computed(() =>
  parseFloat((((subtotal.value - discountAmount.value) * props.taxRate) / 100).toFixed(2)),
)

const total = computed(() =>
  parseFloat((subtotal.value - discountAmount.value + taxAmount.value).toFixed(2)),
)


</script>

<style scoped>
.invoice-summary {
  margin: 1.5rem 0;
}

.summary-table {
  width: 300px;
  margin-left: auto;
  border: 1px solid #ddd;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #eee;
}

.summary-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #333;
}

.value {
  font-weight: 500;
  color: #000;
  font-family: 'Courier New', monospace;
}

.discount {
  color: #d63031;
}

.total {
  background: #f5f5f5;
  font-weight: 700;
  border-top: 2px solid #000;
}

.total-amount {
  font-size: 1.125rem;
  color: #000;
}

@media (max-width: 768px) {
  .summary-table {
    width: 100%;
  }
}
</style>
