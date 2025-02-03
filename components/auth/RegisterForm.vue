<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Type de compte -->
      <div>
        <label for="userType" class="block text-sm font-medium text-gray-700">
          Type de compte
        </label>
        <select
          id="userType"
          v-model="form.userType"
          required
          class="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        >
          <option value="producer">Vendeur</option>
          <option value="buyer">Acheteur</option>
          <option value="transport">Transporteur</option>
        </select>
      </div>
  
      <!-- Type d'entité -->
      <div>
        <label for="entityType" class="block text-sm font-medium text-gray-700">
          Type d'entité
        </label>
        <select
          id="entityType"
          v-model="form.entityType"
          required
          class="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        >
          <option value="particulier">Particulier</option>
          <option value="structure_privee">Structure Privée</option>
          <option value="ong">ONG</option>
        </select>
      </div>
  
      <!-- Nom complet -->
      <div>
        <label for="fullName" class="block text-sm font-medium text-gray-700">
          Nom complet
        </label>
        <input
          id="fullName"
          v-model="form.fullName"
          type="text"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="Votre nom complet"
        />
      </div>
  
      <!-- Email -->
      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">
          Adresse e-mail
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="vous@exemple.com"
        />
      </div>
  
      <!-- Téléphone -->
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700">
          Numéro de téléphone
        </label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="+225 XX XX XX XX XX"
        />
      </div>
  
      <!-- Mot de passe -->
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">
          Mot de passe
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          minlength="6"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="Minimum 6 caractères"
        />
      </div>
  
      <!-- Confirmation du mot de passe -->
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
          Confirmer le mot de passe
        </label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          placeholder="Confirmez votre mot de passe"
        />
      </div>
  
      <!-- Message d'erreur -->
      <div v-if="error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Erreur d'inscription</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Bouton de soumission -->
      <button
        type="submit"
        :disabled="loading || !isValid"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
      >
        <span v-if="loading">Inscription en cours...</span>
        <span v-else>S'inscrire</span>
      </button>
    </form>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuth } from '~/composables/useAuth'
  
  const router = useRouter()
  const auth = useAuth()
  
  interface RegisterForm {
    userType: 'producer' | 'buyer' | 'transport'
    entityType: 'particulier' | 'structure_privee' | 'ong'
    fullName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
  }
  
  const form = ref<RegisterForm>({
    userType: 'buyer',
    entityType: 'particulier',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Validation du formulaire
  const isValid = computed(() => {
    return (
      form.value.fullName.length >= 2 &&
      form.value.email.includes('@') &&
      form.value.phone.length >= 8 &&
      form.value.password.length >= 6 &&
      form.value.password === form.value.confirmPassword
    )
  })
  
  const handleSubmit = async () => {
    if (!isValid.value) return
  
    try {
      loading.value = true
      error.value = null
  
      const { confirmPassword, ...userData } = form.value
      await auth.register(userData)
      
      router.push('/connexion')
    } catch (err: any) {
      error.value = err.message || 'Une erreur est survenue lors de l\'inscription'
    } finally {
      loading.value = false
    }
  }
  </script>