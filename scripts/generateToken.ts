import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config()

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables')
  process.exit(1)
}

const payload = {
  userId: 'test-user-id',
  email: 'test@example.com',
  role: 'user'
}

try {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
  console.log('✅ Generated test token:', token)
} catch (error) {
  console.error('❌ Error generating token:', error)
  process.exit(1)
}