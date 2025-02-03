import { defineStore } from 'pinia'

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
}

interface ChatState {
  conversations: Record<string, Message[]>
  activeConversation: string | null
  loading: boolean
  error: string | null
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    conversations: {},
    activeConversation: null,
    loading: false,
    error: null
  }),

  actions: {
    async startChat(userId: string) {
      try {
        this.loading = true
        const response = await $fetch('/api/chat/start', {
          method: 'POST',
          body: { userId }
        })
        this.activeConversation = response.conversationId
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendMessage(content: string) {
      if (!this.activeConversation) return

      try {
        this.loading = true
        const response = await $fetch(`/api/chat/${this.activeConversation}/messages`, {
          method: 'POST',
          body: { content }
        })
        
        if (!this.conversations[this.activeConversation]) {
          this.conversations[this.activeConversation] = []
        }
        this.conversations[this.activeConversation].push(response)
        
        return response
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async loadMessages(conversationId: string) {
      try {
        this.loading = true
        const response = await $fetch(`/api/chat/${conversationId}/messages`)
        this.conversations[conversationId] = response.messages
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