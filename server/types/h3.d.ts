import { UserToken } from '../middleware/auth'

declare module 'h3' {
  interface H3EventContext {
    user?: {
      userId: string
      [key: string]: any
    }
  }
}
