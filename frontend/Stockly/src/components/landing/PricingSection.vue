<template>
  <section class="py-12 px-6 bg-gray-50">
    <div class="max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>

      <!-- Composant Collapse Naive UI en mode accordion -->
      <n-collapse v-model:value="activeNames" accordion>
        <!-- Question 1 -->
        <n-collapse-item name="1" title="How can I manage multiple companies with Iventello?">
          <p class="text-gray-700 mt-2">
            Iventello allows you to create and switch between multiple company profiles, track inventory separately, and generate reports for each company individually.
          </p>
        </n-collapse-item>

        <!-- Question 2 -->
        <n-collapse-item name="2" title="Is real-time stock tracking available?">
          <p class="text-gray-700 mt-2">
            Yes! Iventello updates stock levels in real-time whenever products are added, sold, or transferred, ensuring accurate inventory management at all times.
          </p>
        </n-collapse-item>
        <n-collapse-item name="3" title="Does iventello generates daily sales Analytics">
           <p class="text-gray-700 mt-2">
            Yes Iventello generate both daily,weekly 
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
/* Tu peux ajouter des effets hover ou icônes si tu veux */
</style>
