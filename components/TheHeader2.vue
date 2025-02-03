<template>
  <header class="bg-gray-800 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and title -->
        <NuxtLink to="/" class="flex items-center space-x-2">
          <img src="/logo.png" alt="GoGoMarket Logo" class="h-10 w-10 rounded-lg object-cover" />
          <span class="text-2xl font-bold">GoGoMarket 2.0</span>
        </NuxtLink>

        <!-- Navigation -->
        <nav class="flex items-center space-x-4">
          <NuxtLink to="/explorer" class="hover:text-gray-300">Explorer</NuxtLink>
          
          <!-- Links visible only for producers and admins -->
          <template v-if="isProducerOrAdmin">
            <NuxtLink to="/publier" class="hover:text-gray-300">Publier</NuxtLink>
            <NuxtLink to="/mes-produits" class="hover:text-gray-300">Mes Produits</NuxtLink>
          </template>

          <!-- Wallet link not visible for buyers -->
          <NuxtLink v-if="!isBuyer" to="/wallet" class="hover:text-gray-300">Portefeuille</NuxtLink>

          <!-- Info icon -->
          <button @click="showInfo" class="text-white hover:text-gray-300 p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <!-- User menu or login form -->
          <template v-if="isAuthenticated">
            <div class="relative">
              <button @click="toggleUserMenu" class="flex items-center space-x-2 hover:text-gray-300">
                <span>{{ user?.fullName }}</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <NuxtLink to="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profil</NuxtLink>
                <button @click="logout" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Déconnexion
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <!-- Login Form -->
            <form @submit.prevent="handleLogin" class="flex items-center space-x-4">
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  v-model="email"
                  type="email"
                  placeholder="Email"
                  class="pl-10 pr-4 py-2 border border-transparent rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white/10 text-white placeholder-gray-300"
                  required
                />
              </div>
              
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  v-model="password"
                  type="password"
                  placeholder="Mot de passe"
                  class="pl-10 pr-4 py-2 border border-transparent rounded-md focus:ring-primary-500 focus:border-primary-500 bg-white/10 text-white placeholder-gray-300"
                  required
                />
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50"
              >
                {{ loading ? 'Connexion...' : 'Se connecter' }}
              </button>
            </form>
          </template>
        </nav>
      </div>
    </div>

    <!-- Company info modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showModal = false"></div>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <CompanyPresentation @close="showModal = false" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useRouter } from 'vue-router';
import { useToast } from '~/composables/useToast';

const router = useRouter();
const auth = useAuth();
const toast = useToast();

const email = ref('');
const password = ref('');
const loading = ref(false);
const showUserMenu = ref(false);
const showModal = ref(false);

const isAuthenticated = computed(() => auth.isAuthenticated);
const user = computed(() => auth.state.user);
const isProducerOrAdmin = computed(() => ['producer', 'admin'].includes(user.value?.role));
const isBuyer = computed(() => user.value?.role === 'buyer');

const handleLogin = async () => {
  try {
    loading.value = true;
    await auth.login(email.value, password.value);
    toast.success('Connexion réussie');
    email.value = '';
    password.value = '';
  } catch (error) {
    toast.error('Email ou mot de passe incorrect');
  } finally {
    loading.value = false;
  }
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const logout = () => {
  auth.logout();
  toast.success('Déconnexion réussie');
  router.push('/');
};

const showInfo = () => {
  showModal.value = true;
};
</script>

<style scoped>
/* Styles spécifiques au composant */
</style>