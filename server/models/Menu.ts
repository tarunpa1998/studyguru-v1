import mongoose, { Document, Schema } from 'mongoose';

// Interface for Menu Child item
export interface IMenuChild {
  id: number;
  title: string;
  url: string;
}

// Interface for Menu document
export interface IMenu extends Document {
  title: string;
  url: string;
  children: IMenuChild[];
}

// Define Menu schema
const MenuSchema = new Schema<IMenu>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    children: {
      type: [{
        id: Number,
        title: String,
        url: String
      }],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Export Menu model
export default mongoose.models.Menu || mongoose.model<IMenu>('Menu', MenuSchema);