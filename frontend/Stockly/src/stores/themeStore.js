import { defineStore } from 'pinia'
import { darkTheme } from 'naive-ui'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore(
  'theme',
  () => {
    const isDark = ref(false)

    // Compute Naive UI theme object (null for light, darkTheme for dark)
    const naiveTheme = computed(() => (isDark.value ? darkTheme : null))

    function toggleTheme() {
      isDark.value = !isDark.value
      applyTheme()
    }

    function setDark(value) {
      isDark.value = value
      applyTheme()
    }

    function applyTheme() {
      if (isDark.value) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    // Initialize: Check local storage or system preference if not persisted
    // (Persistence plugin handles state hydration, but we need to apply class on load)
    function initTheme() {
      applyTheme()
    }

    return { isDark, naiveTheme, toggleTheme, setDark, initTheme }
  },
  {
    persist: true,
  },
)
