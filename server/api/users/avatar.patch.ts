import { requireAuth } from '../../utils/auth'
import { User } from '../../models/user'
import { createError } from 'h3'
import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const formData = await readMultipartFormData(event)
    
    if (!formData || !formData[0]) {
      throw createError({
        statusCode: 400,
        message: 'No file uploaded'
      })
    }

    const file = formData[0]
    const uploadDir = path.join(process.cwd(), 'public/uploads/avatars')
    
    // Create uploads directory if it doesn't exist
    await fs.mkdir(uploadDir, { recursive: true })
    
    const filename = `${user.userId}-${Date.now()}${path.extname(file.filename || '.jpg')}`
    const filepath = path.join(uploadDir, filename)
    
    await fs.writeFile(filepath, file.data)
    
    const avatarUrl = `/uploads/avatars/${filename}`
    
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { avatarUrl },
      { new: true }
    ).select('-password')

    return updatedUser
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error'
    })
  }
})