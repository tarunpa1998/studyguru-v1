import mongoose, { Document, Schema } from 'mongoose';

// Interface for Article document
export interface IArticle extends Document {
  title: string;
  content: string;
  summary: string;
  slug: string;
  publishDate: string;
  author: string;
  authorTitle?: string;
  authorImage?: string;
  image?: string;
  category: string;
}

// Define Article schema
const ArticleSchema = new Schema<IArticle>(
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
    slug: {
      type: String,
      required: true,
      unique: true
    },
    publishDate: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    authorTitle: {
      type: String
    },
    authorImage: {
      type: String
    },
    image: {
      type: String
    },
    category: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Create text index for search functionality
ArticleSchema.index({ 
  title: 'text', 
  content: 'text', 
  summary: 'text',
  category: 'text'
});

// Export Article model
export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);