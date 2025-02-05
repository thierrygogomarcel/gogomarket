import mongoose from 'mongoose'

export interface IProduct extends mongoose.Document {
  name: string
  description: string
  price: number
  category: mongoose.Types.ObjectId
  typeProduct: mongoose.Types.ObjectId
  location: string
  stock: number
  images: string[]
  sellerId: mongoose.Types.ObjectId
  packaging: string // conditionnement
  productionDate: Date
  expiryDate: Date
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La catégorie est requise']
  },
  typeProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductType',
    required: [true, 'Le type de produit est requis']
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
  packaging: {
    type: String,
    required: [true, 'Le conditionnement est requis'],
    enum: ['carton', 'sac', 'bouteille', 'conserve', 'autre']
  },
  productionDate: {
    type: Date,
    required: [true, 'La date de production est requise']
  },
  expiryDate: {
    type: Date,
    required: [true, 'La date de péremption est requise']
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
productSchema.index({ typeProduct: 1 })
productSchema.index({ location: 1 })
productSchema.index({ sellerId: 1 })
productSchema.index({ price: 1 })

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema)