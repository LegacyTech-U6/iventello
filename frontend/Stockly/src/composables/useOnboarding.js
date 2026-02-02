import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted, watch } from 'vue'

export function useOnboarding() {
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  const driverObj = driver({
    showProgress: true,
    animate: true,
    doneBtnText: 'Finish',
    nextBtnText: 'Next',
    prevBtnText: 'Previous',
    allowClose: true,
  })

  // Start the appropriate tour based on context
  const startTour = () => {
    if (authStore.user?.onboarding_completed) return

    // Admin Tour (Part 1)
    if (route.path.includes('/ad/')) {
      startAdminTour()
    }
    // Enterprise Tour (Part 2)
    else if (route.params.uuid) {
      startEnterpriseTour()
    }
  }

  const startAdminTour = () => {
    driverObj.setSteps([
      {
        element: 'body',
        popover: {
          title: 'Welcome to Iventello! 👋',
          description: "Let's get you set up. This is your Admin Dashboard.",
          side: 'left',
          align: 'start',
        },
      },
      {
        element: 'a[href="/ad/admin"]', // Selector for Companies link
        popover: {
          title: 'Create Your Enterprise',
          description: 'Click here to create or manage your enterprise. This is the first step.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: 'a[href="/ad/settings"]',
        popover: {
          title: 'Settings',
          description: 'Configure your profile and global preferences here.',
          side: 'right',
          align: 'start',
        },
      },
    ])
    driverObj.drive()
  }

  const startEnterpriseTour = () => {
    driverObj.setSteps([
      {
        element: 'body',
        popover: {
          title: 'Enterprise Dashboard 🚀',
          description: 'Welcome to your enterprise workspace! Here you can manage everything.',
          side: 'left',
          align: 'start',
        },
      },
      {
        element: 'a[href*="/products"]', // Heuristic for Products link
        popover: {
          title: 'Manage Inventory',
          description: 'This is where you manage your products and stock levels.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: 'a[href*="/sales"]',
        popover: {
          title: 'Point of Sale',
          description: 'Create invoices and manage sales from here.',
          side: 'right',
          align: 'start',
        },
      },
      {
        element: 'body',
        popover: {
          title: "You're All Set!",
          description: 'Go ahead and create your first product in the Products section!',
          side: 'left',
          align: 'start',
          onNextClick: async () => {
            await authStore.completeOnboarding()
            driverObj.destroy()
          },
        },
      },
    ])

    driverObj.drive()
  }

  return {
    startTour,
  }
}
