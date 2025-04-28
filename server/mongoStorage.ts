import { IStorage } from './storage';
import connectToDatabase from './lib/mongodb';
import {
  User, Scholarship, Article, Country, University, News, Menu
} from './models';
import {
  type User as UserType,
  type InsertUser,
  type Scholarship as ScholarshipType,
  type InsertScholarship,
  type Article as ArticleType,
  type InsertArticle,
  type Country as CountryType,
  type InsertCountry,
  type University as UniversityType,
  type InsertUniversity,
  type News as NewsType,
  type InsertNews,
  type Menu as MenuType,
  type InsertMenu
} from '@shared/schema';
import { log } from './vite';

export class MongoStorage implements IStorage {
  // Helper method to convert Mongoose document to plain object with id
  private documentToObject(doc: any): any {
    if (!doc) return undefined;
    
    const obj = doc.toObject ? doc.toObject() : doc;
    // Replace _id with id for consistency with schema types
    if (obj._id) {
      obj.id = obj._id;
      delete obj._id;
    }
    // Remove __v (version key) from MongoDB documents
    if (obj.__v !== undefined) {
      delete obj.__v;
    }
    // Remove timestamps if present
    if (obj.createdAt) delete obj.createdAt;
    if (obj.updatedAt) delete obj.updatedAt;
    
    return obj;
  }

  // User methods
  async getUser(id: number): Promise<UserType | undefined> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return undefined;
      
      const user = await User.findById(id);
      return this.documentToObject(user);
    } catch (error) {
      console.error('MongoDB Error (getUser):', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return undefined;
      
      const user = await User.findOne({ username });
      return this.documentToObject(user);
    } catch (error) {
      console.error('MongoDB Error (getUserByUsername):', error);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<UserType> {
    try {
      const conn = await connectToDatabase();
      if (!conn) throw new Error('Database connection failed');
      
      const newUser = await User.create(user);
      return this.documentToObject(newUser);
    } catch (error) {
      console.error('MongoDB Error (createUser):', error);
      throw error;
    }
  }

  // Scholarship methods
  async getAllScholarships(): Promise<ScholarshipType[]> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return [];
      
      const scholarships = await Scholarship.find().sort({ createdAt: -1 });
      return scholarships.map(s => this.documentToObject(s));
    } catch (error) {
      console.error('MongoDB Error (getAllScholarships):', error);
      return [];
    }
  }

  async getScholarshipBySlug(slug: string): Promise<ScholarshipType | undefined> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return undefined;
      
      const scholarship = await Scholarship.findOne({ slug });
      return this.documentToObject(scholarship);
    } catch (error) {
      console.error('MongoDB Error (getScholarshipBySlug):', error);
      return undefined;
    }
  }

  async createScholarship(scholarship: InsertScholarship): Promise<ScholarshipType> {
    try {
      const conn = await connectToDatabase();
      if (!conn) throw new Error('Database connection failed');
      
      const newScholarship = await Scholarship.create(scholarship);
      return this.documentToObject(newScholarship);
    } catch (error) {
      console.error('MongoDB Error (createScholarship):', error);
      throw error;
    }
  }

  // Article methods
  async getAllArticles(): Promise<ArticleType[]> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return [];
      
      const articles = await Article.find().sort({ createdAt: -1 });
      return articles.map(a => this.documentToObject(a));
    } catch (error) {
      console.error('MongoDB Error (getAllArticles):', error);
      return [];
    }
  }

  async getArticleBySlug(slug: string): Promise<ArticleType | undefined> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return undefined;
      
      const article = await Article.findOne({ slug });
      return this.documentToObject(article);
    } catch (error) {
      console.error('MongoDB Error (getArticleBySlug):', error);
      return undefined;
    }
  }

  async createArticle(article: InsertArticle): Promise<ArticleType> {
    try {
      const conn = await connectToDatabase();
      if (!conn) throw new Error('Database connection failed');
      
      const newArticle = await Article.create(article);
      return this.documentToObject(newArticle);
    } catch (error) {
      console.error('MongoDB Error (createArticle):', error);
      throw error;
    }
  }

  // Country methods
  async getAllCountries(): Promise<CountryType[]> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return [];
      
      const countries = await Country.find().sort({ name: 1 });
      return countries.map(c => this.documentToObject(c));
    } catch (error) {
      console.error('MongoDB Error (getAllCountries):', error);
      return [];
    }
  }

  async getCountryBySlug(slug: string): Promise<CountryType | undefined> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return undefined;
      
      const country = await Country.findOne({ slug });
      return this.documentToObject(country);
    } catch (error) {
      console.error('MongoDB Error (getCountryBySlug):', error);
      return undefined;
    }
  }

  async createCountry(country: InsertCountry): Promise<CountryType> {
    try {
      const conn = await connectToDatabase();
      if (!conn) throw new Error('Database connection failed');
      
      const newCountry = await Country.create(country);
      return this.documentToObject(newCountry);
    } catch (error) {
      console.error('MongoDB Error (createCountry):', error);
      throw error;
    }
  }

  // University methods
  async getAllUniversities(): Promise<UniversityType[]> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return [];
      
      const universities = await University.find().sort({ ranking: 1 });
      return universities.map(u => this.documentToObject(u));
    } catch (error) {
      console.error('MongoDB Error (getAllUniversities):', error);
      return [];
    }
  }

  async getUniversityBySlug(slug: string): Promise<UniversityType | undefined> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return undefined;
      
      const university = await University.findOne({ slug });
      return this.documentToObject(university);
    } catch (error) {
      console.error('MongoDB Error (getUniversityBySlug):', error);
      return undefined;
    }
  }

  async createUniversity(university: InsertUniversity): Promise<UniversityType> {
    try {
      const conn = await connectToDatabase();
      if (!conn) throw new Error('Database connection failed');
      
      const newUniversity = await University.create(university);
      return this.documentToObject(newUniversity);
    } catch (error) {
      console.error('MongoDB Error (createUniversity):', error);
      throw error;
    }
  }

  // News methods
  async getAllNews(): Promise<NewsType[]> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return [];
      
      const newsItems = await News.find().sort({ publishDate: -1 });
      return newsItems.map(n => this.documentToObject(n));
    } catch (error) {
      console.error('MongoDB Error (getAllNews):', error);
      return [];
    }
  }

  async getNewsBySlug(slug: string): Promise<NewsType | undefined> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return undefined;
      
      const newsItem = await News.findOne({ slug });
      return this.documentToObject(newsItem);
    } catch (error) {
      console.error('MongoDB Error (getNewsBySlug):', error);
      return undefined;
    }
  }

  async getFeaturedNews(): Promise<NewsType[]> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return [];
      
      const featuredNews = await News.find({ isFeatured: true }).sort({ publishDate: -1 });
      return featuredNews.map(n => this.documentToObject(n));
    } catch (error) {
      console.error('MongoDB Error (getFeaturedNews):', error);
      return [];
    }
  }

  async createNews(news: InsertNews): Promise<NewsType> {
    try {
      const conn = await connectToDatabase();
      if (!conn) throw new Error('Database connection failed');
      
      const newNewsItem = await News.create(news);
      return this.documentToObject(newNewsItem);
    } catch (error) {
      console.error('MongoDB Error (createNews):', error);
      throw error;
    }
  }

  // Menu methods
  async getMenu(): Promise<MenuType[]> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return [];
      
      const menuItems = await Menu.find().sort({ id: 1 });
      return menuItems.map(m => this.documentToObject(m));
    } catch (error) {
      console.error('MongoDB Error (getMenu):', error);
      return [];
    }
  }

  async createMenuItem(menuItem: InsertMenu): Promise<MenuType> {
    try {
      const conn = await connectToDatabase();
      if (!conn) throw new Error('Database connection failed');
      
      const newMenuItem = await Menu.create(menuItem);
      return this.documentToObject(newMenuItem);
    } catch (error) {
      console.error('MongoDB Error (createMenuItem):', error);
      throw error;
    }
  }

  // Search functionality
  async search(query: string): Promise<{
    scholarships: ScholarshipType[];
    articles: ArticleType[];
    countries: CountryType[];
    universities: UniversityType[];
    news: NewsType[];
  }> {
    try {
      const conn = await connectToDatabase();
      if (!conn) return {
        scholarships: [],
        articles: [],
        countries: [],
        universities: [],
        news: [],
      };
      
      // MongoDB's text search (requires text indexes on collections)
      const textSearchQuery = { $text: { $search: query } };
      const scoreSort = { score: { $meta: "textScore" } };
      
      // Use a regex search as fallback
      const regexQuery = { $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { summary: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
        { country: { $regex: query, $options: 'i' } },
      ]};
      
      // Perform the searches in parallel for better performance
      const [scholarships, articles, countries, universities, newsItems] = await Promise.all([
        Scholarship.find(textSearchQuery).select(scoreSort).limit(10)
          .catch(() => Scholarship.find(regexQuery).limit(10)),
        Article.find(textSearchQuery).select(scoreSort).limit(10)
          .catch(() => Article.find(regexQuery).limit(10)),
        Country.find(textSearchQuery).select(scoreSort).limit(10)
          .catch(() => Country.find(regexQuery).limit(10)),
        University.find(textSearchQuery).select(scoreSort).limit(10)
          .catch(() => University.find(regexQuery).limit(10)),
        News.find(textSearchQuery).select(scoreSort).limit(10)
          .catch(() => News.find(regexQuery).limit(10)),
      ]);
      
      return {
        scholarships: scholarships.map(s => this.documentToObject(s)),
        articles: articles.map(a => this.documentToObject(a)),
        countries: countries.map(c => this.documentToObject(c)),
        universities: universities.map(u => this.documentToObject(u)),
        news: newsItems.map(n => this.documentToObject(n)),
      };
    } catch (error) {
      console.error('MongoDB Error (search):', error);
      return {
        scholarships: [],
        articles: [],
        countries: [],
        universities: [],
        news: [],
      };
    }
  }
}

export const mongoStorage = new MongoStorage();