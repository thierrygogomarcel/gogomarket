import { defineStore } from 'pinia'
import { useToast } from '~/composables/useToast'

// Interface définissant la structure d'un utilisateur dans l'application
export interface User {
  profilePicture: any // Image de profil de l'utilisateur
  id: string // Identifiant unique de l'utilisateur
  email: string // Adresse email de l'utilisateur
  fullName: string // Nom complet de l'utilisateur
  userType: 'producer' | 'buyer' | 'transport' | 'admin' // Type d'utilisateur
  role: string // Rôle spécifique de l'utilisateur
  status: 'active' | 'inactive' // Statut de l'utilisateur (actif/inactif)
  avatarUrl?: string // URL de l'avatar (optionnel)
  createdAt?: string | Date // Date de création du compte (optionnel)
  phone?: string // Numéro de téléphone de l'utilisateur (optionnel)
  lastLoginAt?: string | Date // Dernière connexion de l'utilisateur (optionnel)
}

// Interface définissant les statistiques associées à un utilisateur
export interface UserStats {
  totalOrders: number; // Nombre total de commandes
  totalRevenue: number; // Revenu total généré
  activeProducts: number; // Nombre de produits actifs
  lastOrderDate?: string; // Date de la dernière commande (optionnel)
  purchasesCount?: number; // Nombre total d'achats effectués (optionnel)
}

// Interface représentant l'état du store utilisateur
interface UserState {
  user: User | null // Stocke les informations de l'utilisateur connecté
  loading: boolean // Indique si une requête est en cours
  error: string | null // Stocke les erreurs éventuelles
}

// Définition du store utilisateur
export const useUserStore = defineStore('user', {
  // Définition de l'état initial du store
  state: (): UserState => ({
    user: null, // Aucun utilisateur au départ
    loading: false, // Pas de chargement initialement
    error: null // Pas d'erreur au départ
  }),

  // Getters permettant d'obtenir des informations dérivées de l'état
  getters: {
    isAdmin: (state) => state.user?.role === 'admin', // Vérifie si l'utilisateur est admin
    isProducer: (state) => state.user?.userType === 'producer', // Vérifie si l'utilisateur est un producteur
    isBuyer: (state) => state.user?.userType === 'buyer', // Vérifie si l'utilisateur est un acheteur
    isTransporter: (state) => state.user?.userType === 'transport' // Vérifie si l'utilisateur est un transporteur
  },

  // Actions pour modifier l'état du store
  actions: {
    /**
     * Récupère les informations de l'utilisateur connecté depuis l'API
     */
    async fetchUser() {
      const toast = useToast() // Instance du composable toast pour afficher des messages utilisateur
      try {
        console.log('Début de la récupération des informations utilisateur...')
        this.loading = true // Active l'état de chargement
        
        const response = await $fetch('/api/users/profile') // Appel API pour récupérer le profil utilisateur
        
        this.user = response as User // Stocke les données de l'utilisateur récupérées
        console.log('Utilisateur récupéré avec succès :', this.user)
      } catch (error: any) {
        this.error = error.message // Stocke l'erreur en cas d'échec
        toast.error(error.message) // Affiche un message d'erreur à l'utilisateur
        console.error('Erreur lors de la récupération de l’utilisateur :', error.message)
      } finally {
        this.loading = false // Désactive l'état de chargement
        console.log('Fin de la récupération des informations utilisateur.')
      }
    },

    /**
     * Réinitialise l'état de l'utilisateur (déconnexion par exemple)
     */
    clearUser() {
      console.log('Réinitialisation des informations utilisateur...')
      this.user = null // Supprime les informations de l'utilisateur
      this.error = null // Réinitialise les erreurs éventuelles
      console.log('Utilisateur réinitialisé avec succès.')
    }
  }
})
