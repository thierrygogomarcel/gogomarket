import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { Product } from '../../models/product' 
import { promises as fs } from 'fs'
import path from 'path'
import { requireAuth } from '~/utils/jwt'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const formData = await readMultipartFormData(event)
    console.log('FormData received:', formData)

    if (!formData || formData.length === 0) throw new Error('No form data received')

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public/uploads/products')
    await fs.mkdir(uploadDir, { recursive: true })

    const productData: Record<string, string> = {}
    const images: string[] = []

    // Process form data
    for (const field of formData) {
      console.log('Field:', field) // Voir toutes les propriétés
      if (field.filename) {

      
      // if (field.type === 'file') {
        console.log('Detected file field:', field.filename)
        const filename = `${Date.now()}-${field.filename}`
        const filepath = path.join(uploadDir, filename)
        
        console.log('Saving file to:', filepath) // Avant l'écriture
        
        try {
          await fs.writeFile(filepath, field.data)
          console.log('File saved successfully:', filename) // Après l'écriture
        } catch (err) {
          console.error('File write error:', err)
        }
      
        images.push(`/uploads/products/${filename}`)
      }
       else {
        if (field.name) {
          productData[field.name] = field.data.toString()
        }
      }
    }

    // Validate required fields
    if (!productData.name || !productData.description || !productData.price) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields'
      })
    }

    // Create product
    const product = await Product.create({
      ...productData,
      images,
      sellerId: user.userId,
      price: Number(productData.price),
      stock: Number(productData.stock)
    })

    return {
      statusCode: 201,
      message: 'Product created successfully',
      product
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error creating product'
    })
  }
})