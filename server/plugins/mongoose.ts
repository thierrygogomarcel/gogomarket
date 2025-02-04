import { defineNitroPlugin } from 'nitropack/runtime/plugin'
import { connectDB } from '../utils/db'
import { logger } from '../utils/logger'

export default defineNitroPlugin(async () => {
  try {
    await connectDB()
    logger.info('MongoDB plugin initialized')
  } catch (error) {
    logger.error('Failed to initialize MongoDB plugin:', error)
    throw error
  }
})