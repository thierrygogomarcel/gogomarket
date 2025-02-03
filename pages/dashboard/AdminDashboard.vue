<!-- pages/admin/dashboard.vue -->
<template>
  <div class="card p-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- En-tête -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
        <p class="mt-2 text-gray-600">Gérez les utilisateurs, les produits et les transactions de la plateforme.</p>
      </div>

      <!-- Statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-primary-100 text-primary-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-semibold text-gray-700">Utilisateurs</h2>
              <p class="text-3xl font-bold text-gray-900">{{ stats.usersCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-primary-100 text-primary-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-semibold text-gray-700">Produits</h2>
              <p class="text-3xl font-bold text-gray-900">{{ stats.productsCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-primary-100 text-primary-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-semibold text-gray-700">Transactions</h2>
              <p class="text-3xl font-bold text-gray-900">{{ stats.transactionsCount }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-primary-100 text-primary-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div class="ml-4">
              <h2 class="text-lg font-semibold text-gray-700">Chiffre d'affaires</h2>
              <p class="text-3xl font-bold text-gray-900">{{ formatPrice(stats.totalRevenue) }} FCFA</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Dernières activités -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Derniers utilisateurs</h2>
          <div class="space-y-4">
            <div v-for="user in recentUsers" :key="user._id" class="flex items-center justify-between">
              <div class="flex items-center">
                <img :src="getUserAvatar(user)" :alt="user.fullName" class="h-10 w-10 rounded-full" />
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">{{ user.fullName }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full',
                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ user.status }}
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Dernières transactions</h2>
          <div class="space-y-4">
            <div v-for="transaction in recentTransactions" :key="transaction._id" class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">{{ transaction.description }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(transaction.createdAt) }}</p>
              </div>
              <span class="text-sm font-medium" :class="getTransactionStatusColor(transaction.status)">
                {{ formatPrice(transaction.amount) }} FCFA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'

// Define User interface
interface User {
  _id: string
  fullName: string
  email: string
  status: 'active' | 'inactive'
  avatarUrl?: string
}

interface Transaction {
  _id: string
  description: string
  amount: number
  status: string
  createdAt: string
}

interface DashboardStats {
  usersCount: number;
  productsCount: number;
  transactionsCount: number;
  totalRevenue: number;
}

interface UsersResponse {
  users: User[]
  total: number
  page: number
  limit: number
}

const auth = useAuth()
const stats = ref<DashboardStats>({
  usersCount: 0,
  productsCount: 0,
  transactionsCount: 0,
  totalRevenue: 0
})
const recentUsers = ref<User[]>([])
const recentTransactions = ref<Transaction[]>([])

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getUserAvatar = (user: User) => {
  return user.avatarUrl || `https://api.dicebear.com/7.x/personas/svg?seed=${user.fullName}`
}

const getTransactionStatusColor = (status: string) => {
  const colors = {
    completed: 'text-green-600',
    pending: 'text-yellow-600',
    cancelled: 'text-red-600'
  }
  return colors[status as keyof typeof colors] || 'text-gray-600'
}

onMounted(async () => {
  try {
    // Charger les statistiques
    const [statsResponse, usersResponse, transactionsResponse] = await Promise.all([
      $fetch('/api/dashboard-stats', {
        headers: { Authorization: `Bearer ${auth.state.token}` }
      }) as Promise<DashboardStats>,
      $fetch('/api/users?limit=5', {
        headers: { Authorization: `Bearer ${auth.state.token}` }
      }) as Promise<UsersResponse>,
      $fetch('/api/transactions?limit=5', {
        headers: { Authorization: `Bearer ${auth.state.token}` }
      }) as Promise<Transaction[]>
    ])

    stats.value = statsResponse
    recentUsers.value = usersResponse.users
    recentTransactions.value = transactionsResponse
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})
</script>
