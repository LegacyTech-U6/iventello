<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { CheckIcon } from '@heroicons/vue/24/outline'

// Images (Assurez-vous que les chemins sont corrects)
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

  // Animation du texte dynamique
  const words = ['Multi Enterprise', 'Multi Stock', 'Multi Client', 'Multi User']
  const textEl = document.querySelector('.dynamic-word')
  
  if (textEl) {
    let i = 0
    const typeWord = (word: string) => {
      gsap.to(textEl, {
        duration: word.length * 0.08,
        text: word,
        ease: 'none',
        onComplete: () => { gsap.delayedCall(0.8, eraseWord) },
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
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const router = useRouter()
const handleRegister = () => {
  router.push('/register')
}
</script>

<template>
  <section class="relative text-white min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-[#020617]">
    
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-lime-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
        <div class="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-green-800 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animation-delay-4000"></div>
        
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    </div>

    <svg class="absolute bottom-10 left-10 w-48 h-48 text-emerald-400/30 animate-float-slow" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 100 C50 0, 150 200, 200 100" stroke="currentColor" stroke-width="2" fill="none" />
    </svg>

    <img :src="crown" alt="crown" class="absolute top-24 right-[20%] w-24 opacity-60 animate-float" />
    <img :src="flowerPot" alt="flower pot" class="absolute bottom-10 left-5 w-32 opacity-70 blur-[1px]" />
    <img :src="img11" alt="decor" class="absolute top-32 left-10 w-28 opacity-50 animate-float-delayed" />
    <img :src="img49" alt="decor" class="absolute bottom-20 right-10 w-28 opacity-60 animate-float" />

    <div class="relative z-10 text-center pt-20 px-6 space-y-8 max-w-5xl mx-auto">
      
      <h1 class="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Modern & Smart
        </span>
        <span class="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400 dynamic-word min-h-[1.2em]">
          Inventory Management
        </span>
      </h1>

      <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
        Automate your inventory, sales, and customer management with an all-in-one platform.
        Track stock levels in real-time.
      </p>

      <div class="flex flex-col sm:flex-row gap-5 justify-center pt-4">
        <button @click="handleRegister"
          class="group relative px-8 py-4 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-500 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
          Start Free Trial
          <span class="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
        </button>
        
       
      </div>

      <div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-8 text-gray-400 text-sm md:text-base">
        <div v-for="benefit in benefits" :key="benefit" class="flex items-center gap-2">
          <div class="p-1 rounded-full bg-emerald-500/10">
            <CheckIcon class="w-4 h-4 text-emerald-400" />
          </div>
          <span>{{ benefit }}</span>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* 🎨 Animation des blobs */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* ☁️ Animation flottante */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(2deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 6s ease-in-out infinite;
  animation-delay: 3s;
}

.animate-float-slow {
  animation: float-slow 10s ease-in-out infinite;
}

.dynamic-word {
  display: block;
}
</style>