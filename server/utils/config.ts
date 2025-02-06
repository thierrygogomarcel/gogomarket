// server/utils/config.ts
import { useRuntimeConfig } from "nuxt/app" 

export const getServerConfig = () => {
    const config = useRuntimeConfig()
    return {
      jwtSecret: config.jwtSecret,
      mongodbUri: config.mongodbUri
    }
  }
  