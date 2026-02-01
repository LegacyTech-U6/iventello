<template>
  <n-modal v-model:show="show" preset="dialog" :title="title" :content="message" :positive-text="confirmText"
    :negative-text="cancelText" :positive-button-props="{ loading: loading }" @positive-click="handleConfirm"
    @negative-click="handleCancel" />
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue'

const props = defineProps({
  title: { type: String, default: 'Confirm Action' },
  message: { type: String, default: 'Are you sure you want to proceed?' },
  confirmText: { type: String, default: 'Yes' },
  cancelText: { type: String, default: 'Cancel' },
  modelValue: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const show = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => (show.value = val),
)
watch(show, (val) => emit('update:modelValue', val))

const handleConfirm = (e) => {
  e.preventDefault()
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
  show.value = false
}
</script>
