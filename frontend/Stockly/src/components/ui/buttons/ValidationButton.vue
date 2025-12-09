<template>
  <n-button
  class="rounded-xl border-0"
    :block="block"
    :disabled="loading || disabled"
    :size="size"
    @click="handleClick"
    v-bind="$attrs"
    :type="!isHexColor ? colorType : 'default'"
    :style="computedStyle"
  >
    <!-- Icône gauche si définie et pas en loading -->
    <template #icon>
      <n-icon v-if="icon && !loading">
        <component :is="icon" />
      </n-icon>
    </template>

    <!-- Texte et spinner -->
    <span class="flex items-center justify-center gap-2 text-[0.7em]">
      <span>{{ loading ? loadingText : text }}</span>
      <n-spin v-if="loading" size="small" />
    </span>
  </n-button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NButton, NIcon, NSpin } from 'naive-ui'

const props = defineProps({
  text: { type: String, default: 'Submit' },
  loadingText: { type: String, default: 'Chargement...' },
  color: { type: String, default: 'primary' }, 
  size: { type: String, default: 'medium' },   
  icon: { type: [Object, Function], default: null },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  asyncClick: { type: Function, default: null },
  loading: { type: Boolean, default: false },  
  width: { type: String, default: null }       
})

const internalLoading = ref(false)
const loading = computed(() => props.loading || internalLoading.value)
const isHexColor = computed(() => props.color.startsWith('#'))
const colorType = computed(() => {
  return ['primary','success','warning','error','info'].includes(props.color) ? props.color : 'default'
})

const handleClick = async () => {
  if (!props.asyncClick) return
  try {
    internalLoading.value = true
    await props.asyncClick()
  } catch (err) {
    console.error(err)
  } finally {
    internalLoading.value = false
  }
}

// computedStyle uniquement pour hex et width
const computedStyle = computed(() => {
  const style = {}
  if (isHexColor.value) style.backgroundColor = props.color, style.color = 'white'  , style.border = 'none' 
  if (props.width) style.width = props.width
  return style
})
</script>
