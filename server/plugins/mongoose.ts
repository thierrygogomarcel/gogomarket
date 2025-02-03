// server/plugins/mongoose.ts
import { defineNitroPlugin } from 'nitropack/runtime/plugin'
import connectDB from '../utils/db'

export default defineNitroPlugin(async () => {
  try {
    await connectDB()
    console.log('✅ Connected to MongoDB')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
  }
})