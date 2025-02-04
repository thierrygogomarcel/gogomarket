import mongoose from 'mongoose'

export interface IProduct extends mongoose.Document {
  name: string
  description: string
  price: number
  category: string
  location: string
  stock: number
  images: string[]
  sellerId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix doit être positif']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'La localisation est requise'],
    trim: true
  },
  stock: {
    type: Number,
    required: [true, 'Le stock est requis'],
    min: [0, 'Le stock doit être positif']
  },
  images: [{
    type: String,
    default: ['https://via.placeholder.com/300x200?text=Produit']
  }],
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'ID du vendeur est requis']
  }
}, {
  timestamps: true
})

// Add indexes for better query performance
productSchema.index({ category: 1 })
productSchema.index({ location: 1 })
productSchema.index({ sellerId: 1 })
productSchema.index({ price: 1 })

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)