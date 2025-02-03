import { defineStore } from 'pinia'

interface Training {
  id: string
  title: string
  description: string
  duration: string
  price: number
  category: string
}

interface TrainingState {
  trainings: Training[]
  loading: boolean
  error: string | null
}

export const useTrainingStore = defineStore('training', {
  state: (): TrainingState => ({
    trainings: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchTrainings() {
      try {
        this.loading = true
        const response = await $fetch('/api/training')
        this.trainings = response.trainings
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})