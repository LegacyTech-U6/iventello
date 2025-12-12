<template>
  <n-button
    class="rounded-xl border-0"
    :block="block"
    :disabled="loading || disabled"
    :size="size"
    @click="handleClick"
    v-bind="$attrs"
    :type="isNaiveType ? colorType : 'default'"
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
  customTextColor: { type: String, default: 'white' },
  icon: { type: [Object, Function], default: null },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  asyncClick: { type: Function, default: null },
  loading: { type: Boolean, default: false },
  width: { type: String, default: null }
})

const internalLoading = ref(false)
const loading = computed(() => props.loading || internalLoading.value)

const naiveTypes = ['primary','success','warning','error','info']
const isNaiveType = computed(() => naiveTypes.includes(props.color))

const isCssColor = computed(() => {
  if (!props.color) return false
  return (
    props.color.startsWith('#') ||
    props.color.startsWith('rgb') ||
    props.color.startsWith('hsl') ||
    props.color.startsWith('var(') ||
    /^([a-z]+)$/i.test(props.color) // e.g. 'red', 'blue', etc.
  ) && !isNaiveType.value
})

const colorType = computed(() => isNaiveType.value ? props.color : 'default')

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

// computedStyle pour toutes les couleurs CSS valides et width
const computedStyle = computed(() => {
  const style = {}
  if (isCssColor.value) {
    style.background = props.color
    style.color = props.customTextColor
    style.border = 'none'
  } else if (props.color === 'default') {
    // Special handling for 'default' to match MD3 text/outlined button style
    style.background = 'transparent'
    style.color = 'var(--md-on-surface-variant)'
    style.border = '1px solid var(--md-outline)'
  }
  if (props.width) style.width = props.width
  return style
})
</script>
