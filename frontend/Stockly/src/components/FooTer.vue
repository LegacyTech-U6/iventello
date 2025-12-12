<template>
  <footer class="bg-primary-20 text-on-primary/80">
    <div class="max-w-7xl mx-auto px-6 py-16">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
        <!-- Logo & Socials -->
        <div class="md:col-span-4 lg:col-span-5">
                        <img :src="Iventello" class="w-30 h-10" alt="iventello illustration">

          <p class="text-sm mb-6">
            The smart way to manage inventory and sales.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="hover:text-on-primary transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd" />
              </svg>
            </a>
            <a href="#" class="hover:text-on-primary transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" class="hover:text-on-primary transition-colors">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.345 2.525c.636-.247 1.363-.416 2.427-.465C9.793 2.013 10.147 2 12.315 2zm0 1.623c-2.403 0-2.72.009-3.667.053a3.292 3.292 0 00-1.816.63c-.537.35-.945.757-1.3 1.3-.354.537-.58 1.15-.63 1.816-.044.947-.053 1.264-.053 3.667s.009 2.72.053 3.667a3.292 3.292 0 00.63 1.816c.354.537.757.945 1.3 1.3.537.35 1.15.58 1.816.63.947.044 1.264.053 3.667.053s2.72-.009 3.667-.053a3.292 3.292 0 001.816-.63c.537-.35.945-.757 1.3-1.3.354-.537.58-1.15.63-1.816.044-.947.053-1.264.053-3.667s-.009-2.72-.053-3.667a3.292 3.292 0 00-.63-1.816c-.354-.537-.757-.945-1.3-1.3-.537-.35-1.15-.58-1.816-.63-.947-.044-1.264-.053-3.667-.053zM12 8.118a3.882 3.882 0 100 7.764 3.882 3.882 0 000-7.764zM12 14a2 2 0 110-4 2 2 0 010 4zm6.406-7.184a.96.96 0 100-1.92.96.96 0 000 1.92z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Product Links -->
        <div class="md:col-span-2 lg:col-span-2">
          <h3 class="text-sm font-semibold tracking-wider uppercase text-green-500">Navigation</h3>
          <ul class="mt-4 space-y-3">
            <li><router-link to="/features" class="hover:text-blue-400 transition-colors">Features</router-link></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div class="md:col-span-6 lg:col-span-5">
          <h3 class="text-sm font-semibold tracking-wider uppercase text-on-primary/90">Subscribe to our newsletter</h3>
          <p class="mt-4 text-sm">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <form class="mt-4 flex flex-col sm:flex-row gap-2">
            <label for="email-address" class="sr-only">Email address</label>
            <input id="email-address" name="email" type="email" autocomplete="email" required
              class="input-field flex-auto !bg-primary-30 !border-primary-40 placeholder:text-on-primary/50" placeholder="Enter your email" />
            <button type="submit" class="btn-primary flex-none rounded-md px-4 py-2 text-sm">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-16 pt-8 border-t border-on-primary/10 text-center text-sm">
        <p>&copy; {{ new Date().getFullYear() }} Iventello. All rights reserved. Designed and developed by Fillin Corporation.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
  import Iventello from "@/assets/iventello.png";


</script>

<style scoped>
/* Custom styles for the input field in the footer to match the dark theme */
.input-field {
  background-color: var(--md-surface);
  color: var(--md-on-surface);
  border: 1px solid var(--md-outline);
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: var(--md-primary);
  box-shadow: 0 0 0 3px rgba(132, 210, 229, 0.2); /* Using a lightened primary for focus ring */
}

.input-field::placeholder {
  color: var(--md-on-surface-variant);
  opacity: 0.7;
}
</style>
