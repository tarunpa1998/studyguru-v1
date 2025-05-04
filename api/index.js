// This is a simple serverless function entry point for Vercel
import express from 'express';
import { createServer } from 'http';
import { registerRoutes } from '../server/routes';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up routes
registerRoutes(app);

// Create server
const server = createServer(app);

// Export for serverless
export default app;