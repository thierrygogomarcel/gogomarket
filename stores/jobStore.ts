 import { defineStore } from 'pinia'

interface Job {
  id: string
  title: string
  description: string
  location: string
  salary: number
  requirements: string[]
  employerId: string
}

interface JobState {
  jobs: Job[]
  loading: boolean
  error: string | null
}

interface JobListResponse {
  jobs: Job[]
  total?: number
  page?: number
}

export const useJobStore = defineStore('job', {
  state: (): JobState => ({
    jobs: [],
    loading: false,
    error: null
  }),

  actions: {
    async postJob(jobData: Partial<Job>) {
      try {
        this.loading = true
        const response: { job: Job } = await $fetch('/api/jobs/post', {
          method: 'POST',
          body: jobData
        })
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async getJobs(filters?: any) {
      try {
        this.loading = true
        const response: { jobs: Job[], total: number } = await $fetch('/api/jobs/list', {
          params: filters
        })
        this.jobs = response.jobs
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