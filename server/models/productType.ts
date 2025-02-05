import mongoose from 'mongoose'

export interface IProductType extends mongoose.Document {
  name: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const productTypeSchema = new mongoose.Schema<IProductType>({
  name: {
    type: String,
    required: [true, 'Le nom du type de produit est requis'],
    unique: true,
    trim: true,
    enum: ['vivrier', 'laitier', 'céréalier', 'maraîcher', 'autre']
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

export const ProductType = mongoose.models.ProductType || mongoose.model<IProductType>('ProductType', productTypeSchema)