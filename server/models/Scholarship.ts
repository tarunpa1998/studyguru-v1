import mongoose, { Document, Schema } from 'mongoose';

// Interface for Scholarship document
export interface IScholarship extends Document {
  title: string;
  description: string;
  amount: string;
  deadline: string;
  country: string;
  tags: string[];
  slug: string;
  link?: string;
}

// Define Scholarship schema
const ScholarshipSchema = new Schema<IScholarship>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    amount: {
      type: String,
      required: true
    },
    deadline: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      required: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    link: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Create text index for search functionality
ScholarshipSchema.index({ 
  title: 'text', 
  description: 'text', 
  country: 'text'
});

// Export Scholarship model
export default mongoose.models.Scholarship || mongoose.model<IScholarship>('Scholarship', ScholarshipSchema);