import mongoose, { Document, Schema } from 'mongoose';

// Interface for News document
export interface INews extends Document {
  title: string;
  content: string;
  summary: string;
  publishDate: string;
  image?: string;
  category: string;
  isFeatured: boolean;
  slug: string;
}

// Define News schema
const NewsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true
    },
    publishDate: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    category: {
      type: String,
      required: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    slug: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

// Create text index for search functionality
NewsSchema.index({ 
  title: 'text', 
  content: 'text',
  summary: 'text',
  category: 'text'
});

// Export News model
export default mongoose.models.News || mongoose.model<INews>('News', NewsSchema);