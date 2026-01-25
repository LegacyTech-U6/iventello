<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MagnifyingGlassIcon as Scan, CalculatorIcon as Calculator, ClipboardDocumentCheckIcon as FileCheck, CircleStackIcon as Database, CheckCircleIcon as CheckCircle } from '@heroicons/vue/24/outline'
import img49 from '@/assets/image/49.png'
import imgD8 from '@/assets/image/d8.png'
import imgIl1 from '@/assets/image/il-1.png'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    icon: Scan,
    title: 'Sélection des produits',
    description: 'Scannez ou recherchez vos produits dans le catalogue',
    detail: 'Interface intuitive avec recherche instantanée et scan de code-barres pour une sélection rapide.',
  },
  {
    icon: Calculator,
    title: 'Calcul automatique',
    description: 'TVA, remises et totaux calculés instantanément',
    detail: 'Moteur de calcul intelligent qui gère automatiquement toutes les opérations mathématiques.',
  },
  {
    icon: FileCheck,
    title: 'Génération de facture',
    description: 'Facture professionnelle générée en un clic',
    detail: 'Créez des factures conformes aux normes avec un design professionnel personnalisable.',
  },
  {
    icon: Database,
    title: 'Mise à jour du stock',
    description: 'Inventaire et statistiques actualisés en temps réel',
    detail: 'Synchronisation automatique de votre inventaire avec historique complet des mouvements.',
  },
]

const sectionRef = ref<HTMLElement | null>(null)
const horizontalContainerRef = ref<HTMLElement | null>(null)
const leftContentRef = ref<HTMLElement | null>(null)
const activeStepIndex = ref(0)
const isMobile = ref(false)

const checkMobile = () => isMobile.value = window.innerWidth < 768

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  if (!isMobile.value) {
    setupDesktopAnimations()
  } else {
    setupMobileAnimations()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
})

let horizontalAnim: gsap.core.Tween | null = null

const setupDesktopAnimations = () => {
  const horizontalSection = horizontalContainerRef.value
  if (!horizontalSection) return

  const extraScroll = window.innerWidth * 0.3
  const scrollDistance = horizontalSection.scrollWidth - horizontalSection.parentElement.clientWidth + extraScroll

  horizontalAnim = gsap.to(horizontalSection, {
    x: () => -scrollDistance,
    ease: 'none',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top top',
      end: `+=${scrollDistance}`,
      scrub: 0.5,
      pin: true,
      anticipatePin: 1,
    },
  })

  const stepElements = gsap.utils.toArray('.workflow-step')
  stepElements.forEach((step: any, index) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: step,
        start: 'left 80%',
        end: 'left 40%',
        containerAnimation: horizontalAnim!, // <-- FIX ICI
        toggleActions: 'play none none reverse',
      },
    }).from(step.querySelector('.step-icon'), {
      scale: 0,
      rotation: -180,
      duration: 0.6,
      ease: 'back.out(1.7)',
    })
  })
}


const setupMobileAnimations = () => {
  const stepElements = gsap.utils.toArray('.workflow-step')
  stepElements.forEach((step: any) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: step,
        start: 'top 80%',
        end: 'top 40%',
        toggleActions: 'play none none reverse',
      },
    })
    const icon = step.querySelector('.step-icon')
    tl.from(icon, { scale: 0, rotation: -180, duration: 0.6, ease: 'back.out(1.7)' }, 0.2)
  })
}
</script>

<template>
  <section ref="sectionRef"
    class="workflow-section relative flex justify-center items-center overflow-hidden bg-white px-6 py-16 lg:py-24 min-h-[65vh]">

    <!-- Images décoratives -->
    <img :src="img49" alt="img-right" class="absolute right-0 top-1/4 w-1/4 pointer-events-none select-none" />
    <img :src="imgD8" alt="img-small" class="absolute left-1/4 bottom-8 w-16 pointer-events-none select-none" />
    <img :src="imgIl1" alt="img-back" class="absolute right-1/2 bottom-12 w-32 pointer-events-none select-none" />

    <div v-if="!isMobile" class="grid grid-cols-12 max-w-8xl w-full relative z-10 gap-3">
      <!-- Colonne gauche sticky -->
      <div class="col-span-3 h-full flex items-center px-6 lg:px-12">
        <div ref="leftContentRef" class="space-y-4 w-full">
          <div class="left-animated inline-block px-4 py-2 bg-green-500/10 rounded-full border border-green-400/30">
            <span class="text-green-700 text-sm font-medium">Étape {{ activeStepIndex + 1 }}/{{ steps.length }}</span>
          </div>
          <h2 :key="activeStepIndex" class="left-animated text-3xl md:text-4xl font-bold text-gray-900">
            {{ steps[activeStepIndex].title }}
          </h2>
          <p :key="activeStepIndex" class="left-animated text-gray-700 text-sm md:text-base leading-relaxed">
            {{ steps[activeStepIndex].detail }}
          </p>
        </div>
      </div>

      <!-- Scroll horizontal -->
      <div class="col-span-9 h-full overflow-hidden">
        <div ref="horizontalContainerRef" class="horizontal-container flex items-center h-full gap-16 px-8">
          <div v-for="(step, index) in steps" :key="index" class="workflow-step flex-shrink-0 w-[320px] md:w-[400px]">
            <div class="flex items-start gap-4 md:gap-6">
              <div class="flex flex-col items-center">
                <div
                  class="step-icon relative w-16 md:w-20 h-16 md:h-20 bg-green-800 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50">
                  <component :is="step.icon" :size="24" :stroke-width="2" class="text-white" />
                </div>
              </div>
              <div class="step-content flex-1 pt-1">
                <h3 class="text-lg md:text-xl font-bold text-black mb-1">{{ step.title }}</h3>
                <p class="text-gray-500 text-sm md:text-base leading-relaxed">{{ step.description }}</p>
              </div>
            </div>
          </div>
          <div
            class="flex-shrink-0 w-[320px] md:w-[400px] bg-white/20 rounded-2xl p-6 md:p-8 shadow-lg border border-white/30 text-center">
            <div
              class="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50">
              <CheckCircle :size="24" :stroke-width="2" class="text-white" />
            </div>
            <h3 class="text-lg md:text-xl font-bold text-black mb-2">Processus complet</h3>
            <p class="text-gray-500 text-sm md:text-base leading-relaxed">
              Un workflow optimisé de bout en bout pour maximiser votre productivité.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.workflow-section {
  position: relative;
  overflow: hidden;
}

.horizontal-container {
  will-change: transform;
  display: flex;
}

.workflow-step {
  will-change: transform, opacity;
}

.step-icon {
  will-change: transform;
}
</style>
