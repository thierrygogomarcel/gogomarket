import mongoose from 'mongoose'

export interface IFavorite extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  productId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const favoriteSchema = new mongoose.Schema<IFavorite>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, {
  timestamps: true
})

// Ensure a user can't favorite the same product twice
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true })

export const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', favoriteSchema)