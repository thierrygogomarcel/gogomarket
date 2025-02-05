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

interface ChatResponse {
  conversationId?: string
  messageId?: string
  messages?: Message[]
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
        const response: ChatResponse = await $fetch('/api/chat/start', {
          method: 'POST',
          body: { userId }
        })
        // Use null coalescing to handle potential undefined
        this.activeConversation = response.conversationId ?? null
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
        const response: ChatResponse = await $fetch(`/api/chat/${this.activeConversation}/messages`, {
          method: 'POST',
          body: { content }
        })
        
        if (!this.conversations[this.activeConversation]) {
          this.conversations[this.activeConversation] = []
        }
        
        // Convert ChatResponse to Message if messages are returned
        if (response.messages && response.messages.length > 0) {
          this.conversations[this.activeConversation].push(...response.messages)
        } else if (response.messageId) {
          // If no full messages, create a minimal Message object
          const newMessage: Message = {
            id: response.messageId,
            senderId: '', // You might want to get this from your auth context
            receiverId: '', // You might want to get this from the conversation
            content: content,
            timestamp: new Date()
          }
          this.conversations[this.activeConversation].push(newMessage)
        }
        
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
        const response: ChatResponse = await $fetch(`/api/chat/${conversationId}/messages`)
        this.conversations[conversationId] = response.messages ?? []
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