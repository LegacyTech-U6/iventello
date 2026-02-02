<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { useI18n } from 'vue-i18n'
import { NButton } from 'naive-ui'
// Suppression des imports d'images 3D inutiles pour le style "Clean"

gsap.registerPlugin(TextPlugin)

const { t } = useI18n()
const router = useRouter()

const benefits = computed(() => [
  t('landing.hero.benefits[0]'),
  t('landing.hero.benefits[1]'),
  t('landing.hero.benefits[2]')
])

onMounted(() => {
  // Animation du texte (conservée mais stylisée pour le fond blanc)
  const words = [
    t('landing.hero.dynamic_words[0]'),
    t('landing.hero.dynamic_words[1]'),
    t('landing.hero.dynamic_words[2]')
  ]
  const textEl = document.querySelector('.dynamic-word')

  if (textEl) {
    let i = 0
    const typeWord = (word: string) => {
      gsap.to(textEl, {
        duration: word.length * 0.1,
        text: word,
        ease: 'none',
        onComplete: () => { gsap.delayedCall(1.5, eraseWord) },
      })
    }

    const eraseWord = () => {
      const current = textEl.textContent || ''
      gsap.to(textEl, {
        duration: current.length * 0.05,
        text: '',
        ease: 'none',
        onComplete: () => {
          i = (i + 1) % words.length
          typeWord(words[i])
        },
      })
    }
    // Démarrer
    if (words.length > 0) typeWord(words[0])
  }
})

const handleRegister = () => {
  router.push('/register')
}
</script>

<template>
  <section class="relative bg-white pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">

    <div class="max-w-7xl mx-auto px-6 flex flex-col items-center text-center z-10 relative">

      <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 max-w-5xl leading-[1.15]">
        <span class="text-emerald-600 inline-block">
          {{ $t('landing.hero.title_prefix') }}
        </span>

        <br class="hidden md:block" />
        <span>
          {{ $t('landing.hero.title_suffix') }}
        </span>
      </h1>

      <p class="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
        {{ $t('landing.hero.subtitle') }}
      </p>

      <div class="flex flex-col sm:flex-row items-center gap-6 justify-center w-full">
        <n-button type="primary" size="large" @click="handleRegister" class="px-10 py-6 text-lg font-bold shadow-lg">
          {{ $t('landing.hero.cta') }}
        </n-button>
      </div>

      <div class="mt-12 pt-8 w-full flex flex-wrap justify-center gap-x-8 gap-y-3">
        <div v-for="benefit in benefits" :key="benefit"
          class="flex items-center gap-2 text-sm font-medium text-gray-500">
          <svg class="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          {{ benefit }}
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Animation douce d'apparition à l'arrivée */
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Curseur de frappe discret pour l'animation texte */
.dynamic-word::after {
  content: '|';
  color: #10b981;
  /* Emerald */
  animation: blink 1s infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}
</style>