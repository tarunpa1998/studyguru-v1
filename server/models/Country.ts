import mongoose, { Document, Schema } from 'mongoose';

// Interface for Country document
export interface ICountry extends Document {
  name: string;
  description: string;
  universities: number;
  acceptanceRate: string;
  image?: string;
  slug: string;
}

// Define Country schema
const CountrySchema = new Schema<ICountry>(
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
    universities: {
      type: Number,
      required: true
    },
    acceptanceRate: {
      type: String,
      required: true
    },
    image: {
      type: String
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
CountrySchema.index({ 
  name: 'text', 
  description: 'text'
});

// Export Country model
export default mongoose.models.Country || mongoose.model<ICountry>('Country', CountrySchema);