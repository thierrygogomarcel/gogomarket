// server/plugins/mongoose.ts
import { defineNitroPlugin } from 'nitropack/runtime/plugin'
import mongoose from 'mongoose'
import { getServerConfig } from '../utils/config'

export default defineNitroPlugin(async () => {
  const config = getServerConfig()
  
  try {
    await mongoose.connect(config.mongodbUri!)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
})
