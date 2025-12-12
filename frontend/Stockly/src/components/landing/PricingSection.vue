<template>
  <section class="py-20 px-6 bg-background">
    <div class="max-w-4xl mx-auto text-on-surface">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p class="mt-4 text-lg text-on-surface-variant">
          Have questions? We've got answers. If you can't find what you're looking for, feel free
          to contact us.
        </p>
      </div>

      <!-- Composant Collapse Naive UI en mode accordion -->
      <n-collapse v-model:value="activeNames" accordion class="faq-collapse">
        <!-- Question 1 -->
        <n-collapse-item name="1" title="How can I manage multiple companies with Iventello?">
          <p class="text-on-surface-variant mt-2 leading-relaxed">
            Iventello is built for multi-business management. You can create and switch between
            multiple company profiles with a single login, keeping all data, inventory, and
            reporting strictly isolated for each entity.
          </p>
        </n-collapse-item>

        <!-- Question 2 -->
        <n-collapse-item name="2" title="Is real-time stock tracking available?">
          <p class="text-on-surface-variant mt-2 leading-relaxed">
            Absolutely. Iventello updates stock levels in real-time whenever products are added,
            sold, or adjusted. This ensures you always have an accurate view of your inventory
            across all locations.
          </p>
        </n-collapse-item>

        <!-- Question 3 -->
        <n-collapse-item name="3" title="Does iventello generates daily sales Analytics">
          <p class="text-on-surface-variant mt-2 leading-relaxed">
            Yes, our advanced analytics dashboard provides daily, weekly, and monthly sales
            reports. You can track top-selling products, analyze profitability, and monitor key
            performance indicators (KPIs) to make informed decisions.
          </p>
        </n-collapse-item>

        <!-- Question 4 -->
        <n-collapse-item name="4" title="Can I set different permission levels for my employees?">
          <p class="text-on-surface-variant mt-2 leading-relaxed">
            Yes. Iventello includes a role-based access control system. You can assign roles like
            'Admin' or 'Employee' to limit access to sensitive features and data, ensuring your
            staff can only see and do what's necessary for their job.
          </p>
        </n-collapse-item>

        <!-- Question 5 -->
        <n-collapse-item name="5" title="How secure is my business data?">
          <p class="text-on-surface-variant mt-2 leading-relaxed">
            We take security very seriously. Your data is protected with modern security standards,
            including JWT for authentication, bcrypt for password hashing, and strict data
            isolation between businesses.
          </p>
        </n-collapse-item>

        <!-- Question 6 -->
        <n-collapse-item name="6" title="Is a Point of Sale (POS) system included?">
          <p class="text-on-surface-variant mt-2 leading-relaxed">
            Yes, Iventello includes a built-in Point of Sale (POS) interface optimized for fast and
            efficient checkouts. It's fully integrated with your inventory and invoicing systems,
            automating the entire sales process.
          </p>
        </n-collapse-item>
      </n-collapse>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { NCollapse, NCollapseItem } from 'naive-ui'

const activeNames = ref([]) // Gère l'état des items ouverts
</script>

<style scoped>
/* Custom styles to align Naive UI with Material Design theme */
.faq-collapse {
  --n-title-text-color: var(--md-on-surface);
  --n-title-font-size: 1.125rem;
  --n-arrow-color: var(--md-primary);
  --n-item-margin: 1.25rem 0;
  --n-border-color: var(--md-outline-variant);
}

.faq-collapse :deep(.n-collapse-item__header) {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  transition: color 0.3s;
}

.faq-collapse :deep(.n-collapse-item__header.n-collapse-item__header--active) {
  --n-title-text-color: var(--md-primary);
}
</style>
