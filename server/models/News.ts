import mongoose, { Document, Schema } from 'mongoose';

// Interface for FAQ item
interface IFAQ {
  question: string;
  answer: string;
}

// Interface for Table of Contents item
interface ITocItem {
  id: string;
  title: string;
  level: number;
}

// Interface for SEO metadata
interface ISEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

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
  relatedArticles: string[]; // Array of article IDs or slugs
  seo: ISEO;
  views: number;
  readingTime: string;
  helpful: {
    yes: number;
    no: number;
  };
  tableOfContents: ITocItem[];
  faqs: IFAQ[];
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
    },
    relatedArticles: {
      type: [String],
      default: []
    },
    seo: {
      metaTitle: {
        type: String,
        default: ''
      },
      metaDescription: {
        type: String,
        default: ''
      },
      keywords: {
        type: [String],
        default: []
      }
    },
    views: {
      type: Number,
      default: 0
    },
    readingTime: {
      type: String,
      default: '5 min read'
    },
    helpful: {
      yes: {
        type: Number,
        default: 0
      },
      no: {
        type: Number,
        default: 0
      }
    },
    tableOfContents: {
      type: [{
        id: String,
        title: String,
        level: Number
      }],
      default: []
    },
    faqs: {
      type: [{
        question: String,
        answer: String
      }],
      default: []
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