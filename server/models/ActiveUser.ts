import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IActiveUser extends Document {
  fullName: string;
  email: string;
  password: string;
  profileImage?: string;
  savedArticles: mongoose.Types.ObjectId[];
  savedScholarships: mongoose.Types.ObjectId[];
  comments: {
    content: string;
    articleId: mongoose.Types.ObjectId;
    createdAt: Date;
  }[];
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create ActiveUser Schema
const ActiveUserSchema = new Schema<IActiveUser>({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: function(this: any) {
      // Password is required unless the user has a googleId
      return !this.googleId;
    },
    minlength: 6,
  },
  profileImage: {
    type: String,
    default: '',
  },
  savedArticles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
  savedScholarships: [{
    type: Schema.Types.ObjectId,
    ref: 'Scholarship',
  }],
  comments: [{
    content: {
      type: String,
      required: true,
    },
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  googleId: {
    type: String,
  },
}, {
  timestamps: true
});

// Method to compare password
ActiveUserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Pre-save hook to hash password
ActiveUserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Create and export the model
export default mongoose.models.ActiveUser || mongoose.model<IActiveUser>('ActiveUser', ActiveUserSchema);