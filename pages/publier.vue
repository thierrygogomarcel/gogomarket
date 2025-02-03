<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-8">Publier une annonce</h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Informations de base -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">Informations du produit</h2>
          <div class="grid grid-cols-1 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Nom du produit
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="category" class="block text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select
                id="category"
                v-model="form.category"
                required
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
            </div>

            <div>
              <label for="location" class="block text-sm font-medium text-gray-700">
                Localisation
              </label>
              <select
                id="location"
                v-model="form.location"
                required
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              >
                <option v-for="location in locations" :key="location" :value="location">
                  {{ location }}
                </option>
              </select>
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Prix et stock -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">Prix et disponibilité</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700">
                Prix (FCFA)
              </label>
              <input
                id="price"
                v-model="form.price"
                type="number"
                min="0"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <div>
              <label for="stock" class="block text-sm font-medium text-gray-700">
                Stock disponible (kg)
              </label>
              <input
                id="stock"
                v-model="form.stock"
                type="number"
                min="0"
                required
                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Photos -->
        <div>
          <h2 class="text-lg font-medium text-gray-900 mb-4">Photos du produit</h2>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div class="flex text-sm text-gray-600">
                <label
                  for="file-upload"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <span>Télécharger des photos</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    class="sr-only"
                    multiple
                    accept="image/*"
                    @change="handleFileUpload"
                  />
                </label>
                <p class="pl-1">ou glisser-déposer</p>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG jusqu'à 10MB</p>
            </div>
          </div>
          <!-- Preview des images -->
          <div v-if="imageUrls.length > 0" class="mt-4 grid grid-cols-3 gap-4">
            <div v-for="(url, index) in imageUrls" :key="index" class="relative">
              <img :src="url" class="h-24 w-24 object-cover rounded-lg" />
              <button
                type="button"
                @click="removeImage(index)"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Message d'erreur -->
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Erreur</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{{ error }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bouton de soumission -->
        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="loading"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <span v-if="loading">Publication en cours...</span>
            <span v-else>Publier l'annonce</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import auth from '~/middleware/auth'

// Define the form type
interface ProductForm {
  name: string
  category: string
  location: string
  description: string
  price: number | null
  stock: number | null
  images: File[]
}

// Create a reactive form object with initial values
const form = ref<ProductForm>({
  name: '',
  category: '',
  location: '',
  description: '',
  price: null,
  stock: null,
  images: []
})

const categories = ['Électronique', 'Vêtements', 'Mobilier', 'Autres']
const locations = ['Dakar', 'Thiès', 'Saint-Louis', 'Autres']

const imageUrls = ref<string[]>([])
const imageFiles = ref<File[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const router = useRouter()

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const newFiles = Array.from(input.files)
    form.value.images = [...form.value.images, ...newFiles]
    
    // Create preview URLs
    newFiles.forEach(file => {
      const url = URL.createObjectURL(file)
      imageUrls.value.push(url)
    })
  }
}

const removeImage = (index: number) => {
  URL.revokeObjectURL(imageUrls.value[index])
  imageUrls.value.splice(index, 1)
  form.value.images.splice(index, 1)
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = null

    const formData = new FormData()
    Object.entries(form.value).forEach(([key, value]) => {
      if (key !== 'images' && value != null) {
        formData.append(key, value.toString())
      }
    })

    // Ajouter les images au formData
    form.value.images?.forEach((file: File) => {
      formData.append('images', file)
    })

    const token = await auth.getToken()
    const response = await $fetch('/api/products/add', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    toast.success('Produit publié avec succès')
    router.push('/mes-produits')
  } catch (error: any) {
    error.value = error.message || 'Erreur lors de la publication du produit'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

// Nettoyer les URLs des aperçus lors de la destruction du composant
onBeforeUnmount(() => {
  imageUrls.value.forEach(url => URL.revokeObjectURL(url))
})
</script>