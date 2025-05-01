import mongoose, { Document, Schema } from 'mongoose';

// Interface for University document
export interface IUniversity extends Document {
  name: string;
  description: string;
  overview: string;
  country: string;
  location: string;
  foundedYear: number;
  ranking?: number;
  acceptanceRate?: string;
  studentPopulation?: number;
  internationalStudents?: string;
  academicCalendar?: string;
  programsOffered: string[];
  tuitionFees: string;
  admissionRequirements: string[];
  applicationDeadlines: string;
  scholarshipsAvailable: boolean;
  campusLife: string;
  notableAlumni: string[];
  facilities: string[];
  image?: string;
  logo?: string;
  website?: string;
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
    overview: {
      type: String,
      default: ''
    },
    country: {
      type: String,
      required: true
    },
    location: {
      type: String,
      default: ''
    },
    foundedYear: {
      type: Number,
      default: 0
    },
    ranking: {
      type: Number
    },
    acceptanceRate: {
      type: String,
      default: ''
    },
    studentPopulation: {
      type: Number,
      default: 0
    },
    internationalStudents: {
      type: String,
      default: ''
    },
    academicCalendar: {
      type: String,
      default: ''
    },
    programsOffered: {
      type: [String],
      default: []
    },
    tuitionFees: {
      type: String,
      default: ''
    },
    admissionRequirements: {
      type: [String],
      default: []
    },
    applicationDeadlines: {
      type: String,
      default: ''
    },
    scholarshipsAvailable: {
      type: Boolean,
      default: false
    },
    campusLife: {
      type: String,
      default: ''
    },
    notableAlumni: {
      type: [String],
      default: []
    },
    facilities: {
      type: [String],
      default: []
    },
    image: {
      type: String
    },
    logo: {
      type: String
    },
    website: {
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