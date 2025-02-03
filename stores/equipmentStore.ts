import { defineStore } from 'pinia'

interface Equipment {
  id: string
  name: string
  description: string
  dailyRate: number
  available: boolean
}

interface EquipmentState {
  equipment: Equipment[]
  loading: boolean
  error: string | null
}

export const useEquipmentStore = defineStore('equipment', {
  state: (): EquipmentState => ({
    equipment: [],
    loading: false,
    error: null
  }),

  actions: {
    async rentEquipment(equipmentId: string, duration: number) {
      try {
        this.loading = true
        const response = await $fetch('/api/equipment/rent', {
          method: 'POST',
          body: { equipmentId, duration }
        })
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})