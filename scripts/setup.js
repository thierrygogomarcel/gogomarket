import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from 'dotenv'
import crypto from 'crypto'
import fs from 'fs/promises'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

async function generateSecret() {
  console.log('🔑 Generating JWT secret...')
  const JWT_SECRET = crypto.randomBytes(32).toString('hex')
  const JWT_EXPIRES_IN = '7d'

  const envPath = join(rootDir, '.env')
  try {
    let envContent = ''
    try {
      envContent = await fs.readFile(envPath, 'utf8')
    } catch (error) {
      // File doesn't exist, will create new one
    }

    const newEnvContent = `
# Configuration MongoDB
MONGODB_URI=mongodb://localhost:27017/gogomarket

# Configuration JWT
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=${JWT_EXPIRES_IN}

# Configuration Admin
ADMIN_EMAIL=admin@gogomarket.com
ADMIN_PASSWORD=Admin123!
ADMIN_FIRST_NAME=Super
ADMIN_LAST_NAME=Admin
ADMIN_COUNTRY_CODE=+225
ADMIN_PHONE_NUMBER=0000000000

# Port Nuxt
NUXT_PORT=3000
`

    await fs.writeFile(envPath, newEnvContent)
    console.log('✅ Environment variables generated and saved to .env')
  } catch (error) {
    console.error('❌ Error generating environment variables:', error)
    throw error
  }
}

async function connectDB() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gogomarket'
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    return mongoose
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    throw error
  }
}

async function createAdmin() {
  console.log('👤 Creating admin user...')
  try {
    const {
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
      ADMIN_FIRST_NAME,
      ADMIN_LAST_NAME,
      ADMIN_COUNTRY_CODE,
      ADMIN_PHONE_NUMBER
    } = process.env

    const User = mongoose.model('User')
    const existingAdmin = await User.findOne({ role: 'admin' })
    
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists')
      return
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
    await User.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      countryCode: ADMIN_COUNTRY_CODE,
      phoneNumber: ADMIN_PHONE_NUMBER,
      role: 'admin',
      status: 'active'
    })

    console.log('✅ Admin user created successfully')
    console.log('Email:', ADMIN_EMAIL)
    console.log('Password:', ADMIN_PASSWORD)
    console.log('⚠️ Please change the password after first login')
  } catch (error) {
    console.error('❌ Error creating admin user:', error)
    throw error
  }
}

async function setup() {
  console.log('🚀 Starting project setup...')
  config()

  try {
    await generateSecret()
    const db = await connectDB()
    await createAdmin()
    await db.disconnect()
    console.log('✅ Setup completed successfully!')
  } catch (error) {
    console.error('❌ Setup failed:', error)
    process.exit(1)
  }
}

setup()