<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import flowerPot from '@/assets/image/d2.png'
import crown from '@/assets/image/3.png'
import img11 from '@/assets/image/11.png'
import img49 from '@/assets/image/2-2.png'

gsap.registerPlugin(TextPlugin)

const benefits = [

  'Multi-warehouse support – manage all locations',
  'Real-time inventory tracking – avoid stockouts',
  'Detailed sales analytics – make data-driven decisions'
]
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 80
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  const words = ['Multi Enterprise', 'Multi Stock', 'Multi Client', 'Multi User']
  const textEl = document.querySelector('.dynamic-word')
  if (!textEl) return

  let i = 0

  const typeWord = (word: string) => {
    return gsap.to(textEl, {
      duration: word.length * 0.08,
      text: word,
      ease: 'none',
      onComplete: () => {
        gsap.delayedCall(0.8, eraseWord)
      },
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

  typeWord(words[i])
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const router = useRouter()
const handleRegister = () => {
  router.push('/register')
}
import { CheckIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <section class="relative text-white min-h-90vh flex flex-col justify-center items-center overflow-hidden">
    <!-- 🌈 Fond fluide animé -->
    <div class="absolute inset-0 animated-bg"></div>

    <!-- ⚡ Zigzag animé en bas à gauche -->
    <svg class="absolute bottom-0 left-0 w-48 h-48 text-blue-400 opacity-40 animate-zigzag" viewBox="0 0 200 200"
      fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 100 C50 0, 150 200, 200 100" stroke="currentColor" stroke-width="3" fill="none" />
    </svg>

    <!-- 👑 Couronne -->
    <img :src="crown" alt="crown" class="absolute top-20 right-1/2 transform translate-x-1/2 w-28 opacity-90" />

    <!-- 🌿 Pot de fleur -->
    <img :src="flowerPot" alt="flower pot" class="absolute bottom-0 left-0 w-40 opacity-90" />

    <!-- 🖼️ Image 11 -->
    <img :src="img11" alt="decor" class="absolute top-40 left-10 w-32 opacity-80" />

    <!-- 🖼️ Image 49 -->
    <img :src="img49" alt="decor" class="absolute bottom-0 right-10 w-32 opacity-80" />

    <!-- 💬 Contenu du Hero -->
    <div class="relative z-10 text-center  pt-20 px-6 space-y-8">
      <h1 class="text-5xl md:text-7xl font-light leading-tight">
        Modern & Smart
        <span class="block font-medium mt-2 text-teal-400 dynamic-word">
          Inventory Management
        </span>
      </h1>

      <p class="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
        Automate your inventory, sales, and customer management with an all-in-one platform.
        Track stock levels in real-time, manage multiple warehouses, and streamline your order fulfillment process.
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button @click="handleRegister"
          class="px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all">
          Start Free Trial
        </button>
        <button class="px-8 py-4 border border-teal-600 rounded-lg hover:bg-teal-50 hover:text-teal-600 transition-all">
          Watch Demo
        </button>
      </div>

      <div class="flex flex-wrap items-center  justify-center h-100 gap-6 pt-4 text-gray-300">
        <div v-for="benefit in benefits" :key="benefit" class="flex items-center gap-2">
          <CheckIcon class="w-5 h-5 text-teal-400" />
          <span>{{ benefit }}</span>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* 🌈 Animation fluide du fond */
.animated-bg {
  background: linear-gradient(120deg, #0f172a, #0d9488, #1e293b, #0f766e);
  background-size: 400% 400%;
  animation: gradientFlow 12s ease infinite;
  z-index: 0;
}

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* ⚡ Animation du zigzag */
@keyframes zigzagMove {

  0%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }

  50% {
    transform: translateY(-10px);
    opacity: 0.7;
  }
}

.animate-zigzag {
  animation: zigzagMove 4s ease-in-out infinite;
}

.dynamic-word {
  height: 100px;
  min-width: 350px;
  white-space: nowrap;
}
</style>
