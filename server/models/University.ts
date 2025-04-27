import mongoose, { Document, Schema } from 'mongoose';

// Interface for University document
export interface IUniversity extends Document {
  name: string;
  description: string;
  country: string;
  ranking?: number;
  image?: string;
  slug: string;
  features?: string[];
}

// Define University schema
const UniversitySchema = new Schema<IUniversity>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    ranking: {
      type: Number
    },
    image: {
      type: String
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    features: {
      type: [String]
    }
  },
  {
    timestamps: true
  }
);

// Create text index for search functionality
UniversitySchema.index({ 
  name: 'text', 
  description: 'text',
  country: 'text'
});

// Export University model
export default mongoose.models.University || mongoose.model<IUniversity>('University', UniversitySchema);