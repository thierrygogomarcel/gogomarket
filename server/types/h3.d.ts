
// server/types/h3.d.ts
declare module 'h3' {
  interface H3EventContext {
    user?: {
      userId: string
      [key: string]: any
    }
  }
}
