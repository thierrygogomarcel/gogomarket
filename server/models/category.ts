import mongoose from 'mongoose'

export interface ICategory extends mongoose.Document {
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const categorySchema = new mongoose.Schema<ICategory>({
  name: {
    type: String,
    required: [true, 'Le nom de la catégorie est requis'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema)