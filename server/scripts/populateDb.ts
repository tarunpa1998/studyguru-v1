import connectToDatabase from '../lib/mongodb';
import { menuItems, scholarships, countries, articles, newsItems, universities } from '../data/sampleData';
import { log } from '../vite';

// Import models
import Menu from '../models/Menu';
import Article from '../models/Article';
import Country from '../models/Country';
import News from '../models/News';
import Scholarship from '../models/Scholarship';
import University from '../models/University';

/**
 * Populates MongoDB with sample data
 */
export async function populateDatabase() {
  try {
    // Connect to MongoDB
    const connection = await connectToDatabase();
    if (!connection) {
      log('Failed to connect to MongoDB', 'populate');
      throw new Error('Failed to connect to MongoDB');
    }
    
    log('Connected to MongoDB, starting data population...', 'populate');
    
    // Clear existing data first
    await clearCollections();
    
    // Start populating collections
    await populateMenus();
    await populateScholarships();
    await populateCountries();
    await populateArticles();
    await populateNews();
    await populateUniversities();
    
    log('Database population completed successfully', 'populate');
    return { success: true, message: 'Database populated successfully' };
  } catch (error: any) {
    log(`Error populating database: ${error}`, 'populate');
    return { success: false, error: error.message };
  }
}

async function clearCollections() {
  try {
    log('Clearing existing collections...', 'populate');
    await Menu.deleteMany({});
    await Scholarship.deleteMany({});
    await Country.deleteMany({});
    await Article.deleteMany({});
    await News.deleteMany({});
    await University.deleteMany({});
    log('Collections cleared successfully', 'populate');
  } catch (error: any) {
    log(`Error clearing collections: ${error}`, 'populate');
    throw error;
  }
}

async function populateMenus() {
  try {
    log(`Adding ${menuItems.length} menu items...`, 'populate');
    await Menu.insertMany(menuItems);
    log('Menu items added successfully', 'populate');
  } catch (error: any) {
    log(`Error adding menu items: ${error}`, 'populate');
    throw error;
  }
}

async function populateScholarships() {
  try {
    log(`Adding ${scholarships.length} scholarships...`, 'populate');
    await Scholarship.insertMany(scholarships);
    log('Scholarships added successfully', 'populate');
  } catch (error: any) {
    log(`Error adding scholarships: ${error}`, 'populate');
    throw error;
  }
}

async function populateCountries() {
  try {
    log(`Adding ${countries.length} countries...`, 'populate');
    await Country.insertMany(countries);
    log('Countries added successfully', 'populate');
  } catch (error: any) {
    log(`Error adding countries: ${error}`, 'populate');
    throw error;
  }
}

async function populateArticles() {
  try {
    log(`Adding ${articles.length} articles...`, 'populate');
    await Article.insertMany(articles);
    log('Articles added successfully', 'populate');
  } catch (error: any) {
    log(`Error adding articles: ${error}`, 'populate');
    throw error;
  }
}

async function populateNews() {
  try {
    log(`Adding ${newsItems.length} news items...`, 'populate');
    await News.insertMany(newsItems);
    log('News items added successfully', 'populate');
  } catch (error: any) {
    log(`Error adding news items: ${error}`, 'populate');
    throw error;
  }
}

async function populateUniversities() {
  try {
    log(`Adding ${universities.length} universities...`, 'populate');
    await University.insertMany(universities);
    log('Universities added successfully', 'populate');
  } catch (error: any) {
    log(`Error adding universities: ${error}`, 'populate');
    throw error;
  }
}