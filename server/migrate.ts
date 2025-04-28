import { storage as memoryStorage } from './storage';
import { mongoStorage } from './mongoStorage';
import connectToDatabase from './lib/mongodb';
import { log } from './vite';
import type { InsertMenu, InsertScholarship, InsertArticle, InsertCountry, InsertUniversity, InsertNews } from '@shared/schema';

/**
 * Migrate data from in-memory storage to MongoDB
 */
export async function migrateDataToMongoDB() {
  log('Starting data migration to MongoDB...', 'migration');
  
  try {
    // Check MongoDB connection
    const conn = await connectToDatabase();
    if (!conn) {
      log('Error: MongoDB connection failed, data migration aborted', 'migration');
      return false;
    }
    
    log('Connected to MongoDB successfully', 'migration');
    
    // Migrate menu items
    const menuItems = await memoryStorage.getMenu();
    if (menuItems.length > 0) {
      log(`Migrating ${menuItems.length} menu items...`, 'migration');
      for (const menuItem of menuItems) {
        try {
          // Omit 'id' because MongoDB will generate its own _id
          const { id, ...menuData } = menuItem;
          // Type assertion to ensure compatibility with schema type
          await mongoStorage.createMenuItem({
            title: menuData.title,
            url: menuData.url,
            children: menuData.children as any
          });
        } catch (error) {
          log(`Error migrating menu item ${menuItem.title}: ${error}`, 'migration');
        }
      }
    }
    
    // Migrate scholarships
    const scholarships = await memoryStorage.getAllScholarships();
    if (scholarships.length > 0) {
      log(`Migrating ${scholarships.length} scholarships...`, 'migration');
      for (const scholarship of scholarships) {
        try {
          const { id, ...scholarshipData } = scholarship;
          await mongoStorage.createScholarship(scholarshipData);
        } catch (error) {
          log(`Error migrating scholarship ${scholarship.title}: ${error}`, 'migration');
        }
      }
    }
    
    // Migrate articles
    const articles = await memoryStorage.getAllArticles();
    if (articles.length > 0) {
      log(`Migrating ${articles.length} articles...`, 'migration');
      for (const article of articles) {
        try {
          const { id, ...articleData } = article;
          await mongoStorage.createArticle(articleData);
        } catch (error) {
          log(`Error migrating article ${article.title}: ${error}`, 'migration');
        }
      }
    }
    
    // Migrate countries
    const countries = await memoryStorage.getAllCountries();
    if (countries.length > 0) {
      log(`Migrating ${countries.length} countries...`, 'migration');
      for (const country of countries) {
        try {
          const { id, ...countryData } = country;
          await mongoStorage.createCountry(countryData);
        } catch (error) {
          log(`Error migrating country ${country.name}: ${error}`, 'migration');
        }
      }
    }
    
    // Migrate universities
    const universities = await memoryStorage.getAllUniversities();
    if (universities.length > 0) {
      log(`Migrating ${universities.length} universities...`, 'migration');
      for (const university of universities) {
        try {
          const { id, ...universityData } = university;
          await mongoStorage.createUniversity(universityData);
        } catch (error) {
          log(`Error migrating university ${university.name}: ${error}`, 'migration');
        }
      }
    }
    
    // Migrate news
    const newsItems = await memoryStorage.getAllNews();
    if (newsItems.length > 0) {
      log(`Migrating ${newsItems.length} news items...`, 'migration');
      for (const newsItem of newsItems) {
        try {
          const { id, ...newsData } = newsItem;
          await mongoStorage.createNews(newsData);
        } catch (error) {
          log(`Error migrating news item ${newsItem.title}: ${error}`, 'migration');
        }
      }
    }
    
    log('Data migration completed successfully', 'migration');
    return true;
  } catch (error) {
    log(`Migration failed: ${error}`, 'migration');
    return false;
  }
}