<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NConfigProvider, NGlobalStyle, NMessageProvider, NDialogProvider, NNotificationProvider, type GlobalThemeOverrides } from 'naive-ui'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
themeStore.initTheme()

const themeOverrides: GlobalThemeOverrides = {
  common: {
    fontFamily: "'Poppins', sans-serif"
  }
}
</script>

<template>
  <n-config-provider :theme="themeStore.naiveTheme" :theme-overrides="themeOverrides">
    <n-global-style />
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <RouterView />
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>