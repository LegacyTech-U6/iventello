<template>
  <div class="invoice-items">
    <table class="items-table">
      <thead>
        <tr>
          <th class="text-left">#</th>
          <th class="text-left">Description</th>
          <th class="text-center">Qty</th>
          <th class="text-right">Unit Price</th>
          <th class="text-right">Discount</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="item.id">
          <td class="index">{{ index + 1 }}</td>
          <td class="description">
            <div class="item-name">{{ item.Prod_name || item.product?.Prod_name || 'Product' }}</div>
            <div v-if="item.description" class="item-desc">{{ item.description }}</div>
          </td>
          <td class="quantity">{{ item.quantity }}</td>
          <td class="unit-price text-right">{{ format(Number(item.selling_price || item.unit_price || 0)) }}</td>
          <td class="discount text-right">{{ format(Number(item.discount || 0)) }}</td>
          <td class="amount text-right">{{ format(Number(item.quantity) * Number(item.selling_price || item.unit_price || 0) - Number(item.discount || 0)) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useCurrency } from '@/composable/useCurrency';
const { format } = useCurrency()
defineProps({
  items: Array,
})
</script>

<style scoped>
.invoice-items {
  margin: 0;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.items-table th {
  background: #f5f5f5;
  padding: 0.75rem 0.5rem;
  font-weight: 700;
  color: #000;
  border: 1px solid #ddd;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.75rem;
}

.items-table td {
  padding: 0.75rem 0.5rem;
  border: 1px solid #ddd;
}

.items-table tr:nth-child(even) {
  background: #fafafa;
}

.index {
  font-weight: 500;
  color: #666;
  width: 40px;
  text-align: center;
}

.description {
  min-width: 200px;
}

.item-name {
  font-weight: 500;
  color: #000;
}

.item-desc {
  color: #666;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.quantity {
  text-align: center;
  width: 60px;
}

.unit-price,
.discount,
.amount {
  text-align: right;
  width: 100px;
  font-family: 'Courier New', monospace;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

@media (max-width: 768px) {
  .invoice-items {
    overflow-x: auto;
  }

  .items-table {
    min-width: 500px;
  }
}
</style>
