import mongoose from 'mongoose';

export interface ISale extends mongoose.Document {
  productId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'completed' | 'canceled';
  createdAt: Date;
  updatedAt: Date;
}

const saleSchema = new mongoose.Schema<ISale>({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  buyerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1 
  },
  totalPrice: { 
    type: Number, 
    required: true,
    min: 0 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'canceled'], 
    default: 'pending' 
  }
}, { timestamps: true });

export const Sale = mongoose.models.Sale || mongoose.model<ISale>('Sale', saleSchema);
