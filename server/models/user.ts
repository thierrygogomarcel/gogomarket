import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  userType: 'producer' | 'buyer' | 'transport' | 'admin';
  entityType: 'particulier' | 'structure_privee' | 'ong';
  role: 'producer' | 'buyer' | 'transport' | 'admin';
  status: 'active' | 'inactive';
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['producer', 'buyer', 'transport', 'admin']
  },
  entityType: {
    type: String,
    required: true,
    enum: ['particulier', 'structure_privee', 'ong']
  },
  role: {
    type: String,
    required: true,
    enum: ['producer', 'buyer', 'transport', 'admin'],
    default: function(this: { userType?: string }) {
      return this.userType || 'producer'
    }
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'inactive']
  },
  avatarUrl: {
    type: String
  }
}, {
  timestamps: true
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

export const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema)