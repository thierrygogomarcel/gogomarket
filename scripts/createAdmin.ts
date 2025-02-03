import { connectDB } from '../server/utils/db'
import { User } from '../server/models/user'
import bcrypt from 'bcryptjs'

async function createAdminUser() {
  try {
    await connectDB()

    const adminExists = await User.findOne({ role: 'admin' })
    if (adminExists) {
      console.log('Admin user already exists')
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash('Admin123!', 10)
    
    const admin = new User({
      email: 'admin@gogomarket.com',
      password: hashedPassword,
      fullName: 'Admin User',
      phone: '+225000000000',
      userType: 'admin',
      role: 'admin',
      status: 'active'
    })

    await admin.save()
    console.log('Admin user created successfully')
    console.log('Email: admin@gogomarket.com')
    console.log('Password: Admin123!')
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    process.exit()
  }
}

createAdminUser()