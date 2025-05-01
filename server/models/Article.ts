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
  isFeatured: boolean;
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
    },
    isFeatured: {
      type: Boolean,
      default: false
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
ArticleSchema.index({ 
  title: 'text', 
  content: 'text', 
  summary: 'text',
  category: 'text'
});

// Export Article model
export default mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);