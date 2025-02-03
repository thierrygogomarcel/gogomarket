<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <img 
          :src="user?.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.fullName}`" 
          :alt="user?.fullName"
          class="h-20 w-20 rounded-full object-cover"
        />
        <div>
          <h2 class="text-2xl font-bold text-gray-900">{{ user?.fullName }}</h2>
          <p class="text-gray-500">{{ user?.email }}</p>
        </div>
      </div>
      <button
        v-if="!isEditing"
        @click="$emit('edit')"
        class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
      >
        Modifier le profil
      </button>
    </div>

    <!-- Mode édition -->
    <form v-if="isEditing" @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nom complet</label>
          <input
            v-model="formData.fullName"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Téléphone</label>
          <input
            v-model="formData.phone"
            type="tel"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            required
          />
        </div>
      </div>

      <div class="flex justify-end space-x-3">
        <button
          type="button"
          @click="cancelEdit"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
        >
          {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
      </div>
    </form>

    <!-- Mode affichage -->
    <div v-else class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <h3 class="text-lg font-medium text-gray-900">Informations personnelles</h3>
        <dl class="mt-2 space-y-2">
          <div>
            <dt class="text-sm font-medium text-gray-500">Type de compte</dt>
            <dd class="text-sm text-gray-900">{{ getUserTypeLabel(user?.userType) }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Téléphone</dt>
            <dd class="text-sm text-gray-900">{{ user?.phone }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Statut</dt>
            <dd class="text-sm">
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                user?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ user?.status === 'active' ? 'Actif' : 'Inactif' }}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 class="text-lg font-medium text-gray-900">Statistiques</h3>
        <dl class="mt-2 space-y-2">
          <div>
            <dt class="text-sm font-medium text-gray-500">Membre depuis</dt>
            <dd class="text-sm text-gray-900">{{ formatDate(user?.createdAt) }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from '~/composables/useToast'

const props = defineProps<{
  user: any
  isEditing?: boolean
}>()

const emit = defineEmits(['edit', 'update', 'cancel'])

const toast = useToast()
const loading = ref(false)
const formData = ref({
  fullName: props.user?.fullName || '',
  phone: props.user?.phone || ''
})

const getUserTypeLabel = (type?: string) => {
  const types = {
    producer: 'Producteur',
    buyer: 'Acheteur',
    transport: 'Transporteur',
    admin: 'Administrateur'
  }
  return type ? (types[type as keyof typeof types] || type) : ''
}

const formatDate = (date?: string | Date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleSubmit = async () => {
  try {
    loading.value = true
    emit('update', formData.value)
  } catch (error) {
    toast.error('Erreur lors de la mise à jour du profil')
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  formData.value = {
    fullName: props.user?.fullName || '',
    phone: props.user?.phone || ''
  }
  emit('cancel')
}
</script>
