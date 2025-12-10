<template>
  <teleport to="body">
    <div class="fixed bottom-6 right-6 z-[9999]">
      <!-- Floating Action Button -->
      <button
        @click="toggleMenu"
        class="w-14 h-14 rounded-full bg-[#006879] text-white flex items-center justify-center shadow-lg hover:bg-[#004E5B] "
      >
        <span
          class="text-3xl transform transition-transform duration-300"
          :class="{ 'rotate-45': isOpen }"
        >
          +
        </span>
      </button>

      <!-- Quick Action Menu -->
      <transition name="slide-up">
        <div
          v-if="isOpen"
          class="absolute bottom-16 right-0 mb-2 bg-white shadow-xl rounded-xl p-2 w-48 animate-fade-in"
        >
          <ul class="flex flex-col space-y-2">
            <li
              v-for="(item, index) in actions"
              :key="index"
              @click="handleAction(item)"
              class="px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              <component :is="item.icon" class="w-4 h-4 text-gray-600" />
              <span>{{ item.label }}</span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Package, Users, Tag, ShoppingBagIcon } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isOpen = ref(false)
const toggleMenu = () => (isOpen.value = !isOpen.value)

// UUID dynamique depuis le route
const currentUuid = computed(() => route.params.uuid)

// Actions
const actions = [
  { label: 'Add Product', icon: Package, value: 'product' },
  { label: 'Add Category', icon: Tag, value: 'category' },
  { label: 'New Sales', icon: ShoppingBagIcon, value: 'sales' },
  { label: 'Add Client', icon: Users, value: 'client' },

]

// Navigation dynamique
const handleAction = (item) => {
  isOpen.value = false

  if (!currentUuid.value) {
    console.warn('UUID non défini, impossible de naviguer')
    return
  }

  let targetRoute = ''
  switch (item.value) {
    case 'product':
      targetRoute = `/${currentUuid.value}/stepper`
      break
    case 'category':
      targetRoute = `/${currentUuid.value}/categories`
      break
    case 'client':
      targetRoute = `/${currentUuid.value}/clients`
      break
    case 'sales':
      targetRoute = `/${currentUuid.value}/sales`
      break
    default:
      console.log('Action selected:', item.value)
      return
  }

  router.push(targetRoute)
}

</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.3s ease forwards;
}
</style>
