<script setup lang="ts">
import { RouterView } from 'vue-router'
import { NConfigProvider, NGlobalStyle, NMessageProvider, NDialogProvider, NNotificationProvider } from 'naive-ui'
</script>

<template>
  <n-config-provider>
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