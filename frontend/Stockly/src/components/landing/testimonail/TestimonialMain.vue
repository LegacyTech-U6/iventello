<template>
  <section ref="sectionRef" class="bg-indigo-50 py-20 overflow-hidden relative">
    <!-- Gradient overlays for blurred top and bottom borders -->
    <div
      class="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-50 to-transparent z-10 pointer-events-none"
    ></div>
    <div
      class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-50 to-transparent z-10 pointer-events-none"
    ></div>

    <div class="text-center mb-12 relative z-20">
      <h2 class="text-3xl font-bold text-indigo-900 mb-3">Témoignages</h2>
      <p class="text-gray-600 max-w-2xl mx-auto">
        Découvrez ce que nos utilisateurs pensent de
        <span class="font-semibold text-indigo-700">Iventello</span>.
      </p>
    </div>

    <!-- Desktop version with infinite scroll and parallax -->
    <div class="hidden md:flex justify-center gap-6 h-[600px] overflow-hidden relative">
      <div
        v-for="(col, index) in columns"
        :key="index"
        class="w-200 overflow-hidden"
        :style="{
          transform: `translateY(${columnOffsets[index]}px)`,
          transition: 'transform 0.1s ease-out',
        }"
      >
        <div
          class="flex flex-col gap-6 animate-scroll-column"
          :style="{
            animationDuration: `${scrollDurations[index]}s`,
            animationDirection: index % 2 === 0 ? 'normal' : 'reverse',
          }"
          @mouseenter="pauseAnimation(index)"
          @mouseleave="resumeAnimation(index)"
        >
          <!-- Original content -->
          <TestimonialCard v-for="(t, i) in col" :key="`original-${i}`" :testimonial="t" />
          <!-- Duplicated content for seamless loop -->
          <TestimonialCard v-for="(t, i) in col" :key="`duplicate-${i}`" :testimonial="t" />
        </div>
      </div>
    </div>

    <!-- Mobile version -->
    <div class="md:hidden flex overflow-x-auto gap-4 px-4 scrollbar-hide snap-x snap-mandatory">
      <TestimonialCard
        v-for="(t, i) in testimonials"
        :key="i"
        :testimonial="t"
        class="snap-center shrink-0"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TestimonialCard from './TestimonialCard.vue'

const testimonials = [
  {
    name: 'Marie Dupont',
    message: 'Factgen a simplifié la création de mes factures. Intuitif et rapide !',
    avatar: 'https://i.pravatar.cc/100?img=1',
    rating: 5,
  },
  {
    name: 'Ahmed N.',
    message: 'Une interface fluide et un gain de temps énorme dans ma gestion.',
    avatar: 'https://i.pravatar.cc/100?img=2',
    rating: 4,
  },
  {
    name: 'Lucie T.',
    message: "Le meilleur outil que j'ai utilisé pour mes factures clients.",
    avatar: 'https://i.pravatar.cc/100?img=3',
    rating: 5,
  },
  {
    name: 'Jean-Pierre R.',
    message: 'Très pratique, surtout la génération PDF automatique.',
    avatar: 'https://i.pravatar.cc/100?img=4',
    rating: 5,
  },
  {
    name: 'Nadia K.',
    message: 'Support client réactif et interface propre, bravo !',
    avatar: 'https://i.pravatar.cc/100?img=5',
    rating: 4,
  },
  {
    name: 'Aline F.',
    message: 'Un vrai gain de productivité pour mon entreprise.',
    avatar: 'https://i.pravatar.cc/100?img=6',
    rating: 5,
  },
  {
    name: 'Romain D.',
    message: 'Simple, élégant et efficace. Je recommande !',
    avatar: 'https://i.pravatar.cc/100?img=7',
    rating: 5,
  },
  {
    name: 'Sophie M.',
    message: 'Génération de factures en quelques clics seulement.',
    avatar: 'https://i.pravatar.cc/100?img=8',
    rating: 5,
  },
  {
    name: 'Thomas L.',
    message: 'Parfait pour les freelances comme moi.',
    avatar: 'https://i.pravatar.cc/100?img=9',
    rating: 4,
  },
  {
    name: 'Isabelle P.',
    message: 'Service client exceptionnel et outil très complet.',
    avatar: 'https://i.pravatar.cc/100?img=10',
    rating: 5,
  },
  {
    name: 'David C.',
    message: "J'ai réduit mon temps de gestion administrative de moitié.",
    avatar: 'https://i.pravatar.cc/100?img=11',
    rating: 5,
  },
  {
    name: 'Emma B.',
    message: 'Interface moderne et très facile à prendre en main.',
    avatar: 'https://i.pravatar.cc/100?img=12',
    rating: 5,
  },
]

// Create more testimonials to fill 7 columns
const extendedTestimonials = [...testimonials, ...testimonials, ...testimonials]

// Distribute across 7 columns
const columns = [
  extendedTestimonials.slice(0, 4),
  extendedTestimonials.slice(4, 8),
  extendedTestimonials.slice(8, 12),
  extendedTestimonials.slice(12, 16),
  extendedTestimonials.slice(16, 20),
  extendedTestimonials.slice(20, 24),
  extendedTestimonials.slice(24, 28),
]

// Different scroll speeds for internal animation
const scrollDurations = [25, 30, 35, 40, 35, 30, 25]
const isPaused = ref(Array(columns.length).fill(false))

// Parallax effect on page scroll
const sectionRef = ref(null)
const columnOffsets = ref(Array(columns.length).fill(0))
const parallaxFactors = [0.1, 0.05, 0.02, 0, -0.02, -0.05, -0.1] // Different factors for each column

function handleScroll() {
  if (!sectionRef.value) return

  const section = sectionRef.value
  const rect = section.getBoundingClientRect()
  const windowHeight = window.innerHeight

  // Calculate how much of the section is visible
  const sectionTop = rect.top
  const sectionHeight = rect.height

  // Calculate progress through the section (0 to 1)
  const progress = Math.max(
    0,
    Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)),
  )

  // Apply parallax effect to each column
  columns.forEach((_, index) => {
    const maxOffset = 50 // Maximum parallax movement in pixels
    columnOffsets.value[index] = progress * maxOffset * parallaxFactors[index]
  })
}

function pauseAnimation(index) {
  isPaused.value[index] = true
  const elements = document.querySelectorAll('.animate-scroll-column')
  if (elements[index]) {
    elements[index].style.animationPlayState = 'paused'
  }
}

function resumeAnimation(index) {
  isPaused.value[index] = false
  const elements = document.querySelectorAll('.animate-scroll-column')
  if (elements[index]) {
    elements[index].style.animationPlayState = 'running'
  }
}

onMounted(() => {
  // Add smooth initialization
  setTimeout(() => {
    const elements = document.querySelectorAll('.animate-scroll-column')
    elements.forEach((el) => {
      el.style.animationPlayState = 'running'
    })
  }, 100)

  // Add scroll listener for parallax effect
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Initial calculation
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes scrollColumn {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(calc(-50% - 24px)); /* Account for gap */
  }
}

.animate-scroll-column {
  animation: scrollColumn linear infinite;
  animation-play-state: paused; /* Start paused, will be enabled in mounted */
}

/* Enhanced blur effect for top and bottom */
.absolute.top-0 {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.absolute.bottom-0 {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Subtle depth effect for columns */
.hidden.md\:flex > div:nth-child(1),
.hidden.md\:flex > div:nth-child(7) {
  transform: scale(0.95);
  opacity: 0.9;
  filter: blur(0.5px);
}

.hidden.md\:flex > div:nth-child(2),
.hidden.md\:flex > div:nth-child(6) {
  transform: scale(0.98);
  opacity: 0.95;
  filter: blur(0.3px);
}

.hidden.md\:flex > div:nth-child(3),
.hidden.md\:flex > div:nth-child(5) {
  transform: scale(1);
  opacity: 1;
  filter: blur(0.1px);
}

.hidden.md\:flex > div:nth-child(4) {
  transform: scale(1.02);
  opacity: 1;
  filter: drop-shadow(0 8px 15px rgba(0, 0, 0, 0.1)) blur(0px);
}

/* Smooth transitions for parallax */
.hidden.md\:flex > div {
  transition:
    transform 0.2s ease-out,
    filter 0.2s ease-out;
}
</style>
