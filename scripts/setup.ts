import { config } from 'dotenv'
import { randomBytes } from 'crypto'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { connectDB } from '../server/utils/db'
import { User } from '../server/models/user'
import { hashPassword } from '../server/utils/auth'

config()

async function setup() {
  try {
    console.log('🚀 Démarrage de la configuration...')

    // Générer un nouveau secret JWT si nécessaire
    const JWT_SECRET = randomBytes(32).toString('hex')
    const envPath = resolve(process.cwd(), '.env')
    
    let envContent = ''
    if (existsSync(envPath)) {
      envContent = readFileSync(envPath, 'utf8')
    }

    if (!envContent.includes('JWT_SECRET=')) {
      envContent += `\nJWT_SECRET=${JWT_SECRET}`
      writeFileSync(envPath, envContent)
      console.log('✅ Nouveau JWT_SECRET généré')
    }

    // Connexion à la base de données
    await connectDB()
    console.log('✅ Connecté à MongoDB')

    // Création de l'administrateur si nécessaire
    const adminExists = await User.findOne({ role: 'admin' })
    if (!adminExists) {
      const password = await hashPassword(process.env.ADMIN_PASSWORD || 'Admin123!')
      await User.create({
        email: process.env.ADMIN_EMAIL || 'admin@gogomarket.com',
        password,
        fullName: 'Super Administrateur',
        phone: process.env.ADMIN_PHONE || '+22500000000',
        userType: 'admin',
        role: 'admin',
        status: 'active'
      })
      console.log('✅ Compte administrateur créé')
    }

    console.log('✨ Configuration terminée avec succès!')
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error)
    process.exit(1)
  }
}

setup()