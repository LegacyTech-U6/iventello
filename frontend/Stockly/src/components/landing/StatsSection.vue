<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import il3Image from '@/assets/image/il-3.png'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '40%', label: 'Reduction of storage costs' },
  { value: '3x', label: 'Faster order processing' },
  { value: '99.9%', label: 'Guaranteed availability' },
  { value: '24/7', label: 'Real-time updates' },
]

const sectionRef = ref(null)
const statsGridRef = ref(null)

onMounted(() => {
  if (!sectionRef.value || !statsGridRef.value) return

  ScrollTrigger.matchMedia({
    '(min-width: 768px)': () => {
      const gridWidth =
        statsGridRef.value.scrollWidth - statsGridRef.value.offsetWidth

      gsap.to(statsGridRef.value, {
        x: -gridWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: () => `+=${gridWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      })
    }
  })

  // Counter animation
  gsap.utils.toArray('.stat-value').forEach((stat: any) => {
    gsap.from(stat, {
      innerText: 0,
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: {
        trigger: stat,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    })
  })
})
</script>

<template>
  <section 
    ref="sectionRef"
    class="relative py-16 px-6 bg-primary text-on-primary overflow-hidden md:min-h-[50vh] md:flex md:items-center"
  >
    <div class="relative max-w-7xl mx-auto z-10 flex flex-col md:flex-row items-center gap-14 md:gap-20">

      <!-- Left Illustration -->
      <div class="flex-none relative md:w-1/2 lg:w-1/4 flex justify-center">
        <img 
          :src="il3Image" 
          alt="decorative"
          class="w-56 sm:w-64 md:w-full h-auto object-contain"
        />
      </div>

      <!-- Text + stats -->
      <div class="flex-1 relative z-10 w-full">
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-6">
          Measurable <span class="text-on-primary font-semibold">Results</span>
        </h2>

        <p class="text-base sm:text-lg md:text-xl font-light mb-8 sm:mb-10 text-on-primary/90">
          Join the companies that have 
          <span class="text-on-primary font-medium">transformed</span> 
          their management with 
          <span class="text-on-primary font-semibold">Iventello</span>.
        </p>

        <!-- Stats -->
        <div 
          ref="statsGridRef" 
          class="flex flex-row gap-4 sm:gap-6 overflow-x-auto scroll-smooth no-scrollbar pb-4"
        >
          <div 
            v-for="stat in stats" 
            :key="stat.label"
            class="card bg-surface text-on-surface p-4 sm:p-6 text-center flex-shrink-0 min-w-[130px] sm:min-w-[160px]"
          >
            <div class="stat-value text-2xl sm:text-3xl md:text-4xl font-light text-primary mb-1">
              {{ stat.value }}
            </div>
            <div class="text-xs sm:text-sm text-on-surface-variant">
              {{ stat.label }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.stat-value { will-change: transform; }
</style>
