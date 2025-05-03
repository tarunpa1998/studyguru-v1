import { 
  users, type User, type InsertUser,
  scholarships, type Scholarship, type InsertScholarship,
  articles, type Article, type InsertArticle,
  countries, type Country, type InsertCountry,
  universities, type University, type InsertUniversity,
  news, type News, type InsertNews,
  menu, type Menu, type InsertMenu
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number | string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number | string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number | string): Promise<boolean>;
  
  // Scholarships
  getAllScholarships(): Promise<Scholarship[]>;
  getScholarshipById(id: number | string): Promise<Scholarship | undefined>;
  getScholarshipBySlug(slug: string): Promise<Scholarship | undefined>;
  createScholarship(scholarship: InsertScholarship): Promise<Scholarship>;
  updateScholarship(id: number | string, scholarship: Partial<InsertScholarship>): Promise<Scholarship | undefined>;
  deleteScholarship(id: number | string): Promise<boolean>;
  
  // Articles
  getAllArticles(): Promise<Article[]>;
  getArticleById(id: number | string): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number | string, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number | string): Promise<boolean>;
  
  // Countries
  getAllCountries(): Promise<Country[]>;
  getCountryById(id: number | string): Promise<Country | undefined>;
  getCountryBySlug(slug: string): Promise<Country | undefined>;
  createCountry(country: InsertCountry): Promise<Country>;
  updateCountry(id: number | string, country: Partial<InsertCountry>): Promise<Country | undefined>;
  deleteCountry(id: number | string): Promise<boolean>;
  
  // Universities
  getAllUniversities(): Promise<University[]>;
  getUniversityById(id: number | string): Promise<University | undefined>;
  getUniversityBySlug(slug: string): Promise<University | undefined>;
  createUniversity(university: InsertUniversity): Promise<University>;
  updateUniversity(id: number | string, university: Partial<InsertUniversity>): Promise<University | undefined>;
  deleteUniversity(id: number | string): Promise<boolean>;
  
  // News
  getAllNews(): Promise<News[]>;
  getNewsById(id: number | string): Promise<News | undefined>;
  getNewsBySlug(slug: string): Promise<News | undefined>;
  getFeaturedNews(): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number | string, news: Partial<InsertNews>): Promise<News | undefined>;
  deleteNews(id: number | string): Promise<boolean>;
  
  // Menu
  getMenu(): Promise<Menu[]>;
  getMenuItemById(id: number | string): Promise<Menu | undefined>;
  createMenuItem(menuItem: InsertMenu): Promise<Menu>;
  updateMenuItem(id: number | string, menuItem: Partial<InsertMenu>): Promise<Menu | undefined>;
  deleteMenuItem(id: number | string): Promise<boolean>;
  
  // Search
  search(query: string): Promise<{
    scholarships: Scholarship[];
    articles: Article[];
    countries: Country[];
    universities: University[];
    news: News[];
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private scholarshipsMap: Map<number, Scholarship>;
  private articlesMap: Map<number, Article>;
  private countriesMap: Map<number, Country>;
  private universitiesMap: Map<number, University>;
  private newsMap: Map<number, News>;
  private menuMap: Map<number, Menu>;
  
  currentUserId: number;
  currentScholarshipId: number;
  currentArticleId: number;
  currentCountryId: number;
  currentUniversityId: number;
  currentNewsId: number;
  currentMenuId: number;

  constructor() {
    this.users = new Map();
    this.scholarshipsMap = new Map();
    this.articlesMap = new Map();
    this.countriesMap = new Map();
    this.universitiesMap = new Map();
    this.newsMap = new Map();
    this.menuMap = new Map();
    
    this.currentUserId = 1;
    this.currentScholarshipId = 1;
    this.currentArticleId = 1;
    this.currentCountryId = 1;
    this.currentUniversityId = 1;
    this.currentNewsId = 1;
    this.currentMenuId = 1;
    
    // Add some initial menu items
    this.seedMenu();
  }
  
  private seedMenu() {
    const menuItems: InsertMenu[] = [
      {
        title: "Home",
        url: "/",
        children: []
      },
      {
        title: "Scholarships",
        url: "/scholarships",
        children: [
          {
            id: 21,
            title: "Merit-Based",
            url: "/scholarships/merit-based"
          },
          {
            id: 22,
            title: "Need-Based",
            url: "/scholarships/need-based"
          },
          {
            id: 23,
            title: "Govt Funded",
            url: "/scholarships/govt-funded"
          },
          {
            id: 24,
            title: "University Grants",
            url: "/scholarships/university-grants"
          },
          {
            id: 25,
            title: "Country-Based",
            url: "/scholarships/country-based"
          },
          {
            id: 26,
            title: "Fully Funded",
            url: "/scholarships/fully-funded"
          },
          {
            id: 27,
            title: "Partial Aid",
            url: "/scholarships/partial-aid"
          }
        ]
      },
      {
        title: "Articles",
        url: "/articles",
        children: [
          {
            id: 31,
            title: "Study Guide",
            url: "/articles/study-guide"
          },
          {
            id: 32,
            title: "Visa Tips",
            url: "/articles/visa-tips"
          },
          {
            id: 33,
            title: "Living Abroad",
            url: "/articles/living-abroad"
          },
          {
            id: 34,
            title: "Part-Time Jobs",
            url: "/articles/part-time-jobs"
          },
          {
            id: 35,
            title: "Applications",
            url: "/articles/applications"
          },
          {
            id: 36,
            title: "Budgeting",
            url: "/articles/budgeting"
          },
          {
            id: 37,
            title: "Housing",
            url: "/articles/housing"
          }
        ]
      },
      {
        title: "Countries",
        url: "/countries",
        children: [
          {
            id: 41,
            title: "USA",
            url: "/countries/usa"
          },
          {
            id: 42,
            title: "UK",
            url: "/countries/uk"
          },
          {
            id: 43,
            title: "Canada",
            url: "/countries/canada"
          },
          {
            id: 44,
            title: "Australia",
            url: "/countries/australia"
          },
          {
            id: 45,
            title: "Germany",
            url: "/countries/germany"
          },
          {
            id: 46,
            title: "France",
            url: "/countries/france"
          },
          {
            id: 47,
            title: "China",
            url: "/countries/china"
          },
          {
            id: 48,
            title: "Japan",
            url: "/countries/japan"
          }
        ]
      },
      {
        title: "Universities",
        url: "/universities",
        children: [
          {
            id: 51,
            title: "Top Ranked",
            url: "/universities/top-ranked"
          },
          {
            id: 52,
            title: "Engineering",
            url: "/universities/engineering"
          },
          {
            id: 53,
            title: "Business",
            url: "/universities/business"
          },
          {
            id: 54,
            title: "Medical",
            url: "/universities/medical"
          },
          {
            id: 55,
            title: "Affordable",
            url: "/universities/affordable"
          },
          {
            id: 56,
            title: "Online Degrees",
            url: "/universities/online-degrees"
          },
          {
            id: 57,
            title: "Admission Guide",
            url: "/universities/admission-guide"
          }
        ]
      },
      {
        title: "News",
        url: "/news",
        children: [
          {
            id: 61,
            title: "New Scholarships",
            url: "/news/new-scholarships"
          },
          {
            id: 62,
            title: "University Updates",
            url: "/news/university-updates"
          },
          {
            id: 63,
            title: "Visa Changes",
            url: "/news/visa-changes"
          },
          {
            id: 64,
            title: "Job Market",
            url: "/news/job-market"
          },
          {
            id: 65,
            title: "Student Events",
            url: "/news/student-events"
          },
          {
            id: 66,
            title: "Internships",
            url: "/news/internships"
          },
          {
            id: 67,
            title: "Research",
            url: "/news/research"
          },
          {
            id: 68,
            title: "Student Success",
            url: "/news/student-success"
          },
          {
            id: 69,
            title: "Abroad Trends",
            url: "/news/abroad-trends"
          }
        ]
      }
    ];
    
    menuItems.forEach(item => this.createMenuItem(item));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Scholarship methods
  async getAllScholarships(): Promise<Scholarship[]> {
    return Array.from(this.scholarshipsMap.values());
  }
  
  async getScholarshipBySlug(slug: string): Promise<Scholarship | undefined> {
    return Array.from(this.scholarshipsMap.values()).find(
      (scholarship) => scholarship.slug === slug,
    );
  }
  
  async createScholarship(insertScholarship: InsertScholarship): Promise<Scholarship> {
    const id = this.currentScholarshipId++;
    const scholarship: Scholarship = { ...insertScholarship, id };
    this.scholarshipsMap.set(id, scholarship);
    return scholarship;
  }

  async getScholarshipById(id: number | string): Promise<Scholarship | undefined> {
    // Convert id to number if it's a string containing a number
    const numId = typeof id === 'string' ? parseInt(id) : id;
    if (Number.isNaN(numId)) {
      // If id is not a number (likely MongoDB ObjectId), find by checking all IDs as strings
      return Array.from(this.scholarshipsMap.values()).find(
        (scholarship) => scholarship.id.toString() === id.toString()
      );
    }
    return this.scholarshipsMap.get(numId);
  }

  async updateScholarship(id: number | string, scholarshipData: Partial<InsertScholarship>): Promise<Scholarship | undefined> {
    const scholarship = await this.getScholarshipById(id);
    if (!scholarship) {
      return undefined;
    }

    const updatedScholarship = { ...scholarship, ...scholarshipData };
    
    // Convert id to number if it's a string containing a number
    const numId = typeof id === 'string' ? parseInt(id) : id;
    if (!Number.isNaN(numId)) {
      this.scholarshipsMap.set(numId, updatedScholarship);
    } else {
      // For string IDs (likely MongoDB ObjectIds), find and update by ID
      for (const [key, value] of this.scholarshipsMap.entries()) {
        if (value.id.toString() === id.toString()) {
          this.scholarshipsMap.set(key, updatedScholarship);
          break;
        }
      }
    }
    
    return updatedScholarship;
  }

  async deleteScholarship(id: number | string): Promise<boolean> {
    const scholarship = await this.getScholarshipById(id);
    if (!scholarship) {
      return false;
    }

    // Convert id to number if it's a string containing a number
    const numId = typeof id === 'string' ? parseInt(id) : id;
    if (!Number.isNaN(numId)) {
      return this.scholarshipsMap.delete(numId);
    } else {
      // For string IDs (likely MongoDB ObjectIds), find and delete by ID
      for (const [key, value] of this.scholarshipsMap.entries()) {
        if (value.id.toString() === id.toString()) {
          return this.scholarshipsMap.delete(key);
        }
      }
    }
    
    return false;
  }
  
  // Article methods
  async getAllArticles(): Promise<Article[]> {
    return Array.from(this.articlesMap.values());
  }
  
  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articlesMap.values()).find(
      (article) => article.slug === slug,
    );
  }
  
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentArticleId++;
    const article: Article = { ...insertArticle, id };
    this.articlesMap.set(id, article);
    return article;
  }
  
  // Country methods
  async getAllCountries(): Promise<Country[]> {
    return Array.from(this.countriesMap.values());
  }
  
  async getCountryBySlug(slug: string): Promise<Country | undefined> {
    return Array.from(this.countriesMap.values()).find(
      (country) => country.slug === slug,
    );
  }
  
  async createCountry(insertCountry: InsertCountry): Promise<Country> {
    const id = this.currentCountryId++;
    const country: Country = { ...insertCountry, id };
    this.countriesMap.set(id, country);
    return country;
  }
  
  // University methods
  async getAllUniversities(): Promise<University[]> {
    return Array.from(this.universitiesMap.values());
  }
  
  async getUniversityBySlug(slug: string): Promise<University | undefined> {
    return Array.from(this.universitiesMap.values()).find(
      (university) => university.slug === slug,
    );
  }
  
  async createUniversity(insertUniversity: InsertUniversity): Promise<University> {
    const id = this.currentUniversityId++;
    const university: University = { ...insertUniversity, id };
    this.universitiesMap.set(id, university);
    return university;
  }

  async getUniversityById(id: number | string): Promise<University | undefined> {
    // Convert id to number if it's a string containing a number
    const numId = typeof id === 'string' ? parseInt(id) : id;
    if (Number.isNaN(numId)) {
      // If id is not a number (likely MongoDB ObjectId), find by checking all IDs as strings
      return Array.from(this.universitiesMap.values()).find(
        (university) => university.id.toString() === id.toString()
      );
    }
    return this.universitiesMap.get(numId);
  }

  async updateUniversity(id: number | string, universityData: Partial<InsertUniversity>): Promise<University | undefined> {
    const university = await this.getUniversityById(id);
    if (!university) {
      return undefined;
    }

    const updatedUniversity = { ...university, ...universityData };
    
    // Convert id to number if it's a string containing a number
    const numId = typeof id === 'string' ? parseInt(id) : id;
    if (!Number.isNaN(numId)) {
      this.universitiesMap.set(numId, updatedUniversity);
    } else {
      // For string IDs (likely MongoDB ObjectIds), find and update by ID
      for (const [key, value] of this.universitiesMap.entries()) {
        if (value.id.toString() === id.toString()) {
          this.universitiesMap.set(key, updatedUniversity);
          break;
        }
      }
    }
    
    return updatedUniversity;
  }

  async deleteUniversity(id: number | string): Promise<boolean> {
    const university = await this.getUniversityById(id);
    if (!university) {
      return false;
    }

    // Convert id to number if it's a string containing a number
    const numId = typeof id === 'string' ? parseInt(id) : id;
    if (!Number.isNaN(numId)) {
      return this.universitiesMap.delete(numId);
    } else {
      // For string IDs (likely MongoDB ObjectIds), find and delete by ID
      for (const [key, value] of this.universitiesMap.entries()) {
        if (value.id.toString() === id.toString()) {
          return this.universitiesMap.delete(key);
        }
      }
    }
    
    return false;
  }
  
  // News methods
  async getAllNews(): Promise<News[]> {
    return Array.from(this.newsMap.values());
  }
  
  async getNewsBySlug(slug: string): Promise<News | undefined> {
    return Array.from(this.newsMap.values()).find(
      (newsItem) => newsItem.slug === slug,
    );
  }
  
  async getFeaturedNews(): Promise<News[]> {
    return Array.from(this.newsMap.values()).filter(
      (newsItem) => newsItem.isFeatured,
    );
  }
  
  async createNews(insertNews: InsertNews): Promise<News> {
    const id = this.currentNewsId++;
    const newsItem: News = { ...insertNews, id };
    this.newsMap.set(id, newsItem);
    return newsItem;
  }
  
  // Menu methods
  async getMenu(): Promise<Menu[]> {
    return Array.from(this.menuMap.values());
  }
  
  async createMenuItem(insertMenuItem: InsertMenu): Promise<Menu> {
    const id = this.currentMenuId++;
    const menuItem: Menu = { ...insertMenuItem, id };
    this.menuMap.set(id, menuItem);
    return menuItem;
  }
  
  // Search functionality
  async search(query: string): Promise<{
    scholarships: Scholarship[];
    articles: Article[];
    countries: Country[];
    universities: University[];
    news: News[];
  }> {
    const lowercaseQuery = query.toLowerCase();
    
    const scholarships = Array.from(this.scholarshipsMap.values()).filter(
      (scholarship) => 
        scholarship.title.toLowerCase().includes(lowercaseQuery) ||
        scholarship.description.toLowerCase().includes(lowercaseQuery)
    );
    
    const articles = Array.from(this.articlesMap.values()).filter(
      (article) => 
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery) ||
        article.summary.toLowerCase().includes(lowercaseQuery)
    );
    
    const countries = Array.from(this.countriesMap.values()).filter(
      (country) => 
        country.name.toLowerCase().includes(lowercaseQuery) ||
        country.description.toLowerCase().includes(lowercaseQuery)
    );
    
    const universities = Array.from(this.universitiesMap.values()).filter(
      (university) => 
        university.name.toLowerCase().includes(lowercaseQuery) ||
        university.description.toLowerCase().includes(lowercaseQuery)
    );
    
    const newsItems = Array.from(this.newsMap.values()).filter(
      (newsItem) => 
        newsItem.title.toLowerCase().includes(lowercaseQuery) ||
        newsItem.content.toLowerCase().includes(lowercaseQuery) ||
        newsItem.summary.toLowerCase().includes(lowercaseQuery)
    );
    
    return {
      scholarships,
      articles,
      countries,
      universities,
      news: newsItems,
    };
  }
}

export const storage = new MemStorage();
