import { useRuntimeConfig } from "nuxt/app"

// server/utils/config.ts
export const getServerConfig = () => {
    const config = useRuntimeConfig()
    return {
      jwtSecret: config.jwtSecret,
      mongodbUri: config.mongodbUri
    }
  }
  