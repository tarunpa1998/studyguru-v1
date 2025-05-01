import mongoose, { Document, Schema } from 'mongoose';

// Interface for Country document
export interface ICountry extends Document {
  name: string;
  slug: string;
  overview: string;
  description: string;
  highlights: string[];

  universities: number;
  acceptanceRate: string;
  language: string;
  currency: string;
  averageTuition: string;
  averageLivingCost: string;
  visaRequirement: string;

  popularCities: string[];
  topUniversities: string[];
  educationSystem: string;
  image?: string;
  flag?: string;
}

// Define Country schema
const CountrySchema = new Schema<ICountry>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true
    },
    overview: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    highlights: {
      type: [String],
      default: []
    },

    universities: {
      type: Number,
      required: true
    },
    acceptanceRate: {
      type: String,
      required: true
    },
    language: {
      type: String,
      default: 'English'
    },
    currency: {
      type: String,
      default: ''
    },
    averageTuition: {
      type: String,
      default: ''
    },
    averageLivingCost: {
      type: String,
      default: ''
    },
    visaRequirement: {
      type: String,
      default: ''
    },

    popularCities: {
      type: [String],
      default: []
    },
    topUniversities: {
      type: [String],
      default: []
    },
    educationSystem: {
      type: String,
      default: ''
    },
    image: {
      type: String
    },
    flag: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Create text index for search functionality
CountrySchema.index({ 
  name: 'text', 
  description: 'text',
  overview: 'text'
});

// Export Country model
export default mongoose.models.Country || mongoose.model<ICountry>('Country', CountrySchema);