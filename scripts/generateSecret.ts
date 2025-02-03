import { randomBytes } from 'crypto'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { config } from 'dotenv'

config()

const envPath = resolve(process.cwd(), '.env')
const JWT_SECRET = randomBytes(32).toString('hex')

try {
  let envContent = ''
  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf8')
  }

  if (envContent.includes('JWT_SECRET=')) {
    envContent = envContent.replace(/JWT_SECRET=.*/g, `JWT_SECRET=${JWT_SECRET}`)
  } else {
    envContent += `\nJWT_SECRET=${JWT_SECRET}`
  }

  writeFileSync(envPath, envContent)
  console.log('✅ New JWT_SECRET generated successfully')
} catch (error) {
  console.error('❌ Error generating JWT_SECRET:', error)
  process.exit(1)
}