import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage"; // Keep for fallback
import { mongoStorage } from "./mongoStorage"; // Import MongoDB storage implementation
import connectToDatabase from "./lib/mongodb";
import { log } from "./vite";
import { 
  insertScholarshipSchema, 
  insertArticleSchema, 
  insertCountrySchema, 
  insertUniversitySchema,
  insertNewsSchema,
  insertMenuSchema
} from "@shared/schema";

// Import MongoDB API routes
import apiRoutes from './routes/api';
import swaggerRoutes from './routes/swagger';
import adminRoutes from './admin';

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to handle errors
  const errorHandler = (fn: (req: Request, res: Response) => Promise<any>) => {
    return async (req: Request, res: Response) => {
      try {
        await fn(req, res);
      } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({
          error: "Internal server error",
          message: error instanceof Error ? error.message : "Unknown error"
        });
      }
    };
  };

  // Register MongoDB API routes when MongoDB is available
  app.use('/api', apiRoutes);
  
  // Register Admin routes
  app.use('/api/admin', adminRoutes);
  
  // Register Swagger documentation
  app.use('/', swaggerRoutes);

  // Menu routes (with MongoDB or fallback to memory storage)
  app.get("/api/menu", errorHandler(async (req, res) => {
    // Try to use MongoDB first, fall back to memory storage if MongoDB unavailable
    try {
      const conn = await connectToDatabase();
      if (conn) {
        try {
          // First, let's count how many menu items we have in MongoDB
          const Menu = require('./models/Menu').default;
          const menuCount = await Menu.countDocuments({});
          log(`Menu items count in MongoDB: ${menuCount}`, 'debug');
          
          if (menuCount > 0) {
            // There appear to be multiple sets of menu items.
            // Let's only return one set by using distinct titles.
            const titles = await Menu.distinct('title');
            log(`Distinct menu titles: ${titles}`, 'debug');
            
            // Get one menu item per title
            const uniqueMenuItems = [];
            for (const title of titles) {
              const item = await Menu.findOne({ title }).lean();
              if (item) {
                // Convert MongoDB _id to id
                const menuItem = {
                  ...item,
                  id: item._id.toString(),
                  _id: undefined
                };
                delete menuItem._id;
                
                uniqueMenuItems.push(menuItem);
              }
            }
            
            log(`Returning ${uniqueMenuItems.length} unique menu items`, 'debug');
            return res.json(uniqueMenuItems);
          }
          
          // If no items, try normal approach
          const menuItems = await mongoStorage.getMenu();
          
          // Remove duplicate entries based on title
          const uniqueMenuItems = Array.from(
            new Map(menuItems.map(item => [item.title, item])).values()
          );
          
          return res.json(uniqueMenuItems);
        } catch (error) {
          log(`MongoDB error fetching menu: ${error}`, 'mongodb');
          // Continue to fallback
        }
      }
      
      // Fallback to memory storage
      const menuItems = await storage.getMenu();
      
      // Remove duplicate entries based on title
      const uniqueMenuItems = Array.from(
        new Map(menuItems.map(item => [item.title, item])).values()
      );
      
      res.json(uniqueMenuItems);
    } catch (error) {
      log(`Error in menu route: ${error}`, 'error');
      res.status(500).json({ error: 'Failed to fetch menu items' });
    }
  }));

  app.post("/api/menu", errorHandler(async (req, res) => {
    const validatedData = insertMenuSchema.parse(req.body);
    
    // Try to use MongoDB first, fall back to memory storage if MongoDB unavailable
    const conn = await connectToDatabase();
    if (conn) {
      try {
        const newMenuItem = await mongoStorage.createMenuItem(validatedData);
        return res.status(201).json(newMenuItem);
      } catch (error) {
        log(`MongoDB error: ${error}`, 'mongodb');
        // Fallback to memory storage
      }
    }
    
    // Fallback to memory storage
    const newMenuItem = await storage.createMenuItem(validatedData);
    res.status(201).json(newMenuItem);
  }));

  // Scholarship routes (fallback to memory storage)
  app.get("/api/scholarships", errorHandler(async (req, res) => {
    const scholarships = await storage.getAllScholarships();
    res.json(scholarships);
  }));

  app.get("/api/scholarships/:slug", errorHandler(async (req, res) => {
    const scholarship = await storage.getScholarshipBySlug(req.params.slug);
    if (!scholarship) {
      return res.status(404).json({ error: "Scholarship not found" });
    }
    res.json(scholarship);
  }));

  app.post("/api/scholarships", errorHandler(async (req, res) => {
    const validatedData = insertScholarshipSchema.parse(req.body);
    const newScholarship = await storage.createScholarship(validatedData);
    res.status(201).json(newScholarship);
  }));

  // Article routes (fallback to memory storage)
  app.get("/api/articles", errorHandler(async (req, res) => {
    const articles = await storage.getAllArticles();
    res.json(articles);
  }));

  app.get("/api/articles/:slug", errorHandler(async (req, res) => {
    const article = await storage.getArticleBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  }));

  app.post("/api/articles", errorHandler(async (req, res) => {
    const validatedData = insertArticleSchema.parse(req.body);
    const newArticle = await storage.createArticle(validatedData);
    res.status(201).json(newArticle);
  }));

  // Country routes (fallback to memory storage)
  app.get("/api/countries", errorHandler(async (req, res) => {
    const countries = await storage.getAllCountries();
    res.json(countries);
  }));

  app.get("/api/countries/:slug", errorHandler(async (req, res) => {
    const country = await storage.getCountryBySlug(req.params.slug);
    if (!country) {
      return res.status(404).json({ error: "Country not found" });
    }
    res.json(country);
  }));

  app.post("/api/countries", errorHandler(async (req, res) => {
    const validatedData = insertCountrySchema.parse(req.body);
    const newCountry = await storage.createCountry(validatedData);
    res.status(201).json(newCountry);
  }));

  // University routes (fallback to memory storage)
  app.get("/api/universities", errorHandler(async (req, res) => {
    const universities = await storage.getAllUniversities();
    res.json(universities);
  }));

  app.get("/api/universities/:slug", errorHandler(async (req, res) => {
    const university = await storage.getUniversityBySlug(req.params.slug);
    if (!university) {
      return res.status(404).json({ error: "University not found" });
    }
    res.json(university);
  }));

  app.post("/api/universities", errorHandler(async (req, res) => {
    const validatedData = insertUniversitySchema.parse(req.body);
    const newUniversity = await storage.createUniversity(validatedData);
    res.status(201).json(newUniversity);
  }));

  // News routes (fallback to memory storage)
  app.get("/api/news", errorHandler(async (req, res) => {
    const newsItems = await storage.getAllNews();
    res.json(newsItems);
  }));

  app.get("/api/news/featured", errorHandler(async (req, res) => {
    const featuredNews = await storage.getFeaturedNews();
    res.json(featuredNews);
  }));

  app.get("/api/news/:slug", errorHandler(async (req, res) => {
    const newsItem = await storage.getNewsBySlug(req.params.slug);
    if (!newsItem) {
      return res.status(404).json({ error: "News article not found" });
    }
    res.json(newsItem);
  }));

  app.post("/api/news", errorHandler(async (req, res) => {
    const validatedData = insertNewsSchema.parse(req.body);
    const newNewsItem = await storage.createNews(validatedData);
    res.status(201).json(newNewsItem);
  }));

  // Search route (fallback to memory storage)
  app.get("/api/search", errorHandler(async (req, res) => {
    const query = req.query.query as string;
    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }
    
    const results = await storage.search(query);
    res.json(results);
  }));

  // Seed initial data (just for demonstration)
  app.post("/api/seed", errorHandler(async (req, res) => {
    // Seed some initial data
    await seedInitialData();
    res.json({ message: "Initial data seeded successfully" });
  }));
  
  // API endpoint to trigger data migration (only when needed)
  app.post("/api/migrate", errorHandler(async (req, res) => {
    const { migrateDataToMongoDB } = require('./migrate');
    await migrateDataToMongoDB();
    res.json({ message: "Data migration completed" });
  }));
  
  // API endpoint to clean up duplicate menu items
  app.post("/api/cleanup-menus", errorHandler(async (req, res) => {
    try {
      // Get the Menu model dynamically
      const connection = await connectToDatabase();
      if (!connection) {
        return res.status(500).json({ error: "Failed to connect to MongoDB" });
      }
      
      // Import the model dynamically to avoid 'require' issues
      const { default: MenuModel } = await import('./models/Menu');
      
      // Get list of menu titles
      const titles = await MenuModel.distinct('title');
      log(`Found ${titles.length} unique menu titles`, 'debug');
      
      let totalDeleted = 0;
      
      // For each title, find all duplicates and delete them
      for (const title of titles) {
        try {
          // Find all documents with this title
          const allWithTitle = await MenuModel.find({ title }).sort({ createdAt: 1 });
          
          if (allWithTitle.length <= 1) {
            log(`No duplicates for menu '${title}'`, 'debug');
            continue; // No duplicates
          }
          
          // Keep the first one
          const keepDoc = allWithTitle[0];
          log(`Keeping menu item '${title}' with ID ${keepDoc._id}`, 'debug');
          
          // Delete all others with this title except the one we're keeping
          const deleteResult = await MenuModel.deleteMany({ 
            title, 
            _id: { $ne: keepDoc._id } 
          });
          
          const deleteCount = deleteResult?.deletedCount || 0;
          totalDeleted += deleteCount;
          log(`Deleted ${deleteCount} duplicate '${title}' menu items`, 'debug');
        } catch (titleError: any) {
          log(`Error processing title ${title}: ${titleError.message}`, 'error');
          // Continue with next title
        }
      }
      
      // Return success with count of deleted items
      return res.json({ 
        message: "Menu cleanup completed successfully", 
        deletedCount: totalDeleted,
        uniqueMenusRemaining: titles.length
      });
    } catch (error: any) {
      log(`Error cleaning up menu items: ${error.message}`, 'error');
      return res.status(500).json({ error: `Failed to clean up menu items: ${error.message}` });
    }
  }));
  
  // Setup initial admin user
  app.post("/api/setup-admin", errorHandler(async (req, res) => {
    const { username, password, setupKey } = req.body;
    
    // Verify setup key
    const correctSetupKey = process.env.ADMIN_SETUP_KEY || 'admin_setup_secret';
    if (setupKey !== correctSetupKey) {
      return res.status(401).json({ error: 'Invalid setup key' });
    }
    
    try {
      // Store admin user in memory storage for now
      // MongoDB will be integrated later
      const user = {
        username,
        password // Note: In a real app, password should be hashed
      };
      
      // Create a simple JWT token
      const token = 'dummy_token_for_admin_' + Date.now();
      
      res.json({ 
        message: 'Admin setup successful', 
        token,
        user: { username: user.username }
      });
    } catch (error) {
      console.error('Admin setup error:', error);
      res.status(500).json({ error: 'Failed to setup admin user' });
    }
  }));

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}

// Function to seed initial data
async function seedInitialData() {
  // Sample scholarships
  const scholarships = [
    {
      title: "Fulbright Foreign Student Program",
      description: "Full scholarships for graduate students, young professionals, and artists to study in the United States.",
      amount: "$40,000",
      deadline: "Jun 15, 2023",
      country: "United States",
      tags: ["Fully Funded", "Merit-Based"],
      slug: "fulbright-foreign-student-program",
      link: "https://foreign.fulbrightonline.org/"
    },
    {
      title: "Erasmus Mundus Joint Master Degrees",
      description: "Prestigious, integrated, international study program with scholarships for students worldwide.",
      amount: "€25,000/year",
      deadline: "Feb 28, 2023",
      country: "European Union",
      tags: ["Fully Funded", "Research"],
      slug: "erasmus-mundus",
      link: "https://erasmus-plus.ec.europa.eu/"
    },
    {
      title: "Global Korea Scholarship",
      description: "Designed to provide international students with opportunities to study at higher educational institutions in Korea.",
      amount: "₩5,000,000/year",
      deadline: "Mar 31, 2023",
      country: "South Korea",
      tags: ["Partial Aid", "Undergraduate"],
      slug: "global-korea-scholarship",
      link: "https://www.studyinkorea.go.kr/en/sub/gks/allnew_invite.do"
    }
  ];

  // Sample countries
  const countries = [
    {
      name: "United States",
      description: "The United States offers world-class education with diverse programs and research opportunities.",
      universities: 4500,
      acceptanceRate: "High Acceptance Rate",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      slug: "usa"
    },
    {
      name: "United Kingdom",
      description: "The UK is known for its prestigious universities and quality education system.",
      universities: 160,
      acceptanceRate: "Moderate Acceptance",
      image: "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      slug: "uk"
    },
    {
      name: "Canada",
      description: "Canada offers quality education, affordable tuition, and a multicultural environment.",
      universities: 100,
      acceptanceRate: "High Acceptance Rate",
      image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      slug: "canada"
    },
    {
      name: "Australia",
      description: "Australia provides world-class education with innovative research opportunities.",
      universities: 43,
      acceptanceRate: "Moderate Acceptance",
      image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      slug: "australia"
    }
  ];

  // Sample articles
  const articles = [
    {
      title: "10 Tips to Ace Your Student Visa Interview",
      content: "Detailed content about visa interview preparation...",
      summary: "Expert advice on how to prepare for and succeed in your student visa interview with practical examples.",
      slug: "visa-tips",
      publishDate: "May 12, 2023",
      author: "Sarah Johnson",
      authorTitle: "Visa Consultant",
      authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Visa Tips"
    },
    {
      title: "How to Budget for Your Study Abroad Experience",
      content: "Detailed content about budgeting...",
      summary: "A comprehensive guide to managing your finances while studying in a foreign country.",
      slug: "study-abroad-budget",
      publishDate: "May 5, 2023",
      author: "Michael Chen",
      authorTitle: "Financial Advisor",
      authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Budgeting"
    },
    {
      title: "The Ultimate Guide to Finding Student Accommodation Abroad",
      content: "Detailed content about finding accommodation...",
      summary: "Discover the best options for student housing and tips for securing your ideal living situation.",
      slug: "housing-guide",
      publishDate: "Apr 28, 2023",
      author: "Emma Rodriguez",
      authorTitle: "Housing Specialist",
      authorImage: "https://images.unsplash.com/photo-1558203728-00f45181dd84?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      category: "Housing"
    }
  ];

  // Sample news
  const newsItems = [
    {
      title: "Major Funding Initiative Announced for International STEM Students",
      content: "Detailed news content about funding initiative...",
      summary: "A consortium of universities has announced a new $50 million scholarship fund for international students pursuing degrees in Science, Technology, Engineering, and Mathematics (STEM) fields.",
      publishDate: "May 15, 2023",
      image: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "Breaking News",
      isFeatured: true,
      slug: "major-funding-initiative"
    },
    {
      title: "UK Simplifies Student Visa Application Process",
      content: "Detailed news content about visa changes...",
      summary: "New changes aim to streamline the visa application process for international students.",
      publishDate: "May 10, 2023",
      image: "https://images.unsplash.com/photo-1535231540604-72e8fbaf8cdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "Visa Updates",
      isFeatured: false,
      slug: "uk-simplifies-process"
    },
    {
      title: "Latest Global University Rankings Released",
      content: "Detailed news content about rankings...",
      summary: "The new rankings show significant changes in the top international education destinations.",
      publishDate: "May 7, 2023",
      image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      category: "University Updates",
      isFeatured: false,
      slug: "global-rankings"
    }
  ];

  // Sample universities
  const universities = [
    {
      name: "Harvard University",
      description: "Harvard University is a private Ivy League research university in Cambridge, Massachusetts.",
      country: "United States",
      ranking: 1,
      image: "https://images.unsplash.com/photo-1512697230323-74151c14ad4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      slug: "harvard-university",
      features: ["World-class faculty", "Extensive research opportunities", "Global alumni network"]
    },
    {
      name: "University of Oxford",
      description: "The University of Oxford is a collegiate research university in Oxford, England.",
      country: "United Kingdom",
      ranking: 2,
      image: "https://images.unsplash.com/photo-1580491883528-bdd97b95c4e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      slug: "university-of-oxford",
      features: ["Historic institution", "Tutorial-based learning", "Prestigious scholarship programs"]
    },
    {
      name: "University of Toronto",
      description: "The University of Toronto is a public research university in Toronto, Ontario, Canada.",
      country: "Canada",
      ranking: 18,
      image: "https://images.unsplash.com/photo-1585503507680-93f1d71efaa5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      slug: "university-of-toronto",
      features: ["Diverse student body", "Strong research funding", "Urban campus"]
    }
  ];

  // Determine if we should use MongoDB or in-memory storage
  const conn = await connectToDatabase();
  const useMongoDb = !!conn;
  const storageImpl = useMongoDb ? mongoStorage : storage;
  
  if (useMongoDb) {
    log('Seeding data into MongoDB...', 'seeding');
  } else {
    log('MongoDB not available. Seeding data into memory storage...', 'seeding');
  }

  // Create sample data using appropriate storage implementation
  try {
    // Create scholarships
    for (const scholarship of scholarships) {
      try {
        await storageImpl.createScholarship(scholarship);
      } catch (error) {
        log(`Error seeding scholarship: ${error}`, 'seeding');
      }
    }
    
    // Create countries
    for (const country of countries) {
      try {
        await storageImpl.createCountry(country);
      } catch (error) {
        log(`Error seeding country: ${error}`, 'seeding');
      }
    }
    
    // Create articles
    for (const article of articles) {
      try {
        await storageImpl.createArticle(article);
      } catch (error) {
        log(`Error seeding article: ${error}`, 'seeding');
      }
    }
    
    // Create news items
    for (const newsItem of newsItems) {
      try {
        await storageImpl.createNews(newsItem);
      } catch (error) {
        log(`Error seeding news: ${error}`, 'seeding');
      }
    }
    
    // Create universities
    for (const university of universities) {
      try {
        await storageImpl.createUniversity(university);
      } catch (error) {
        log(`Error seeding university: ${error}`, 'seeding');
      }
    }
    
    log('Seeding completed successfully', 'seeding');
  } catch (error) {
    log(`Seeding error: ${error}`, 'seeding');
  }
}
