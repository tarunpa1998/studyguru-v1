import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to handle errors
  const errorHandler = (fn: (req: Request, res: Response) => Promise<void>) => {
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
  
  // Register Swagger documentation
  app.use('/', swaggerRoutes);

  // Menu routes (fallback to memory storage)
  app.get("/api/menu", errorHandler(async (req, res) => {
    const menuItems = await storage.getMenu();
    res.json(menuItems);
  }));

  app.post("/api/menu", errorHandler(async (req, res) => {
    const validatedData = insertMenuSchema.parse(req.body);
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

  // Create sample data
  for (const scholarship of scholarships) {
    await storage.createScholarship(scholarship);
  }
  
  for (const country of countries) {
    await storage.createCountry(country);
  }
  
  for (const article of articles) {
    await storage.createArticle(article);
  }
  
  for (const newsItem of newsItems) {
    await storage.createNews(newsItem);
  }
  
  for (const university of universities) {
    await storage.createUniversity(university);
  }
}
