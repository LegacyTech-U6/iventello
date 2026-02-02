<template>
  <div class="flex justify-center">
    <n-upload list-type="image-card" :max="1" :default-file-list="fileList" @change="handleFileChange"
      @before-upload="onBeforeUpload" accept="image/*">
      <div class="flex flex-col items-center justify-center gap-1 text-gray-500">
        <span class="text-2xl">+</span>
        <span class="text-xs">Upload</span>
      </div>
    </n-upload>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NUpload, type UploadFileInfo } from 'naive-ui'

interface Props {
  modelValue?: File | string | null
  maxSize?: number // en Mo
  accept?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  maxSize: 5,
  accept: 'image/*',
})

const emit = defineEmits(['update:modelValue'])

const fileList = ref<UploadFileInfo[]>([])

// 🔄 Sync external model with internal list
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      fileList.value = []
    } else if (typeof newVal === 'string') {
      fileList.value = [{
        id: 'existing',
        name: 'Logo',
        status: 'finished',
        url: newVal
      }]
    }
    // If it's a File object, we assume it came from the uploader internally, 
    // so we don't need to force update the list to avoid loops, 
    // unless we want to support external File setting.
  },
  { immediate: true }
)

// 📂 Handle File Change
function handleFileChange(data: { fileList: UploadFileInfo[] }) {
  // Update local list state
  fileList.value = data.fileList

  const fileObj = data.fileList[0]?.file
  if (fileObj) {
    emit('update:modelValue', fileObj)
  } else {
    // If we removed the file, emit null
    emit('update:modelValue', null)
  }
}

// ✅ Validation
async function onBeforeUpload(data: { file: UploadFileInfo; fileList: UploadFileInfo[] }) {
  if (data.file.file && data.file.file.size > props.maxSize * 1024 * 1024) {
    alert(`Fichier trop volumineux (max ${props.maxSize} Mo)`)
    return false
  }
  return true
}
</script>
