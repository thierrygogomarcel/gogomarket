import { connectDB } from '../server/utils/db'
import { User } from '../server/models/user'
import { Product } from '../server/models/product'
import bcrypt from 'bcryptjs'

async function seedDatabase() {
  try {
    await connectDB()
    console.log('Connected to database')

    // Nettoyer la base de données
    await User.deleteMany({})
    await Product.deleteMany({})
    console.log('Database cleaned')

    // Créer des utilisateurs de test
    const password = await bcrypt.hash('Password123!', 10)
    
    const producer = await User.create({
      email: 'producer@test.com',
      password,
      fullName: 'Test Producer',
      phone: '+22500000001',
      userType: 'producer',
      status: 'active'
    })

    await User.create({
      email: 'buyer@test.com',
      password,
      fullName: 'Test Buyer',
      phone: '+22500000002',
      userType: 'buyer',
      status: 'active'
    })

    // Créer des produits de test
    const products = [
      {
        name: 'Tomates Bio',
        description: 'Tomates fraîches cultivées sans pesticides',
        price: 1500,
        category: 'Légumes',
        location: 'Abidjan',
        stock: 100,
        sellerId: producer._id,
        images: ['https://example.com/tomatoes.jpg']
      },
      {
        name: 'Bananes Plantain',
        description: 'Bananes plantain mûres et fraîches',
        price: 2000,
        category: 'Fruits',
        location: 'Yamoussoukro',
        stock: 50,
        sellerId: producer._id,
        images: ['https://example.com/plantains.jpg']
      }
    ]

    await Product.insertMany(products)
    console.log('Test data seeded successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    process.exit()
  }
}

seedDatabase()