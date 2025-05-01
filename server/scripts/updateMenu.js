import mongoose from 'mongoose';

// MongoDB Connection URI - using the one from your application
const MONGODB_URI = 'mongodb+srv://Tarunpaa:Tarunlove%401998@replitdb.0m1olav.mongodb.net/Studyguru?retryWrites=true&w=majority&appName=replitdb';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  bufferCommands: false,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('Connected to MongoDB');
  updateMenuStructure();
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define Menu Schema
const MenuSchema = new mongoose.Schema({
  title: String,
  url: String,
  children: [{
    id: Number,
    title: String,
    url: String
  }]
});

// Create model
const Menu = mongoose.model('Menu', MenuSchema);

// New menu structure
const newMenuStructure = [
  {
    "id": 1,
    "title": "Home",
    "url": "/",
    "children": []
  },
  {
    "id": 2,
    "title": "Scholarships",
    "url": "/scholarships",
    "children": [
      {
        "id": 21,
        "title": "Merit-Based",
        "url": "/scholarships/merit-based"
      },
      {
        "id": 22,
        "title": "Need-Based",
        "url": "/scholarships/need-based"
      },
      {
        "id": 23,
        "title": "Govt Funded",
        "url": "/scholarships/govt-funded"
      },
      {
        "id": 24,
        "title": "University Grants",
        "url": "/scholarships/university-grants"
      },
      {
        "id": 25,
        "title": "Country-Based",
        "url": "/scholarships/country-based"
      },
      {
        "id": 26,
        "title": "Fully Funded",
        "url": "/scholarships/fully-funded"
      },
      {
        "id": 27,
        "title": "Partial Aid",
        "url": "/scholarships/partial-aid"
      }
    ]
  },
  {
    "id": 3,
    "title": "Articles",
    "url": "/articles",
    "children": [
      {
        "id": 31,
        "title": "Study Guide",
        "url": "/articles/study-guide"
      },
      {
        "id": 32,
        "title": "Visa Tips",
        "url": "/articles/visa-tips"
      },
      {
        "id": 33,
        "title": "Living Abroad",
        "url": "/articles/living-abroad"
      },
      {
        "id": 34,
        "title": "Part-Time Jobs",
        "url": "/articles/part-time-jobs"
      },
      {
        "id": 35,
        "title": "Applications",
        "url": "/articles/applications"
      },
      {
        "id": 36,
        "title": "Budgeting",
        "url": "/articles/budgeting"
      },
      {
        "id": 37,
        "title": "Housing",
        "url": "/articles/housing"
      }
    ]
  },
  {
    "id": 4,
    "title": "Countries",
    "url": "/countries",
    "children": [
      {
        "id": 41,
        "title": "USA",
        "url": "/countries/usa"
      },
      {
        "id": 42,
        "title": "UK",
        "url": "/countries/uk"
      },
      {
        "id": 43,
        "title": "Canada",
        "url": "/countries/canada"
      },
      {
        "id": 44,
        "title": "Australia",
        "url": "/countries/australia"
      },
      {
        "id": 45,
        "title": "Germany",
        "url": "/countries/germany"
      },
      {
        "id": 46,
        "title": "France",
        "url": "/countries/france"
      },
      {
        "id": 47,
        "title": "China",
        "url": "/countries/china"
      },
      {
        "id": 48,
        "title": "Japan",
        "url": "/countries/japan"
      }
    ]
  },
  {
    "id": 5,
    "title": "Universities",
    "url": "/universities",
    "children": [
      {
        "id": 51,
        "title": "Top Ranked",
        "url": "/universities/top-ranked"
      },
      {
        "id": 52,
        "title": "Engineering",
        "url": "/universities/engineering"
      },
      {
        "id": 53,
        "title": "Business",
        "url": "/universities/business"
      },
      {
        "id": 54,
        "title": "Medical",
        "url": "/universities/medical"
      },
      {
        "id": 55,
        "title": "Affordable",
        "url": "/universities/affordable"
      },
      {
        "id": 56,
        "title": "Online Degrees",
        "url": "/universities/online-degrees"
      },
      {
        "id": 57,
        "title": "Admission Guide",
        "url": "/universities/admission-guide"
      }
    ]
  },
  {
    "id": 6,
    "title": "News",
    "url": "/news",
    "children": [
      {
        "id": 61,
        "title": "New Scholarships",
        "url": "/news/new-scholarships"
      },
      {
        "id": 62,
        "title": "University Updates",
        "url": "/news/university-updates"
      },
      {
        "id": 63,
        "title": "Visa Changes",
        "url": "/news/visa-changes"
      },
      {
        "id": 64,
        "title": "Job Market",
        "url": "/news/job-market"
      },
      {
        "id": 65,
        "title": "Student Events",
        "url": "/news/student-events"
      },
      {
        "id": 66,
        "title": "Internships",
        "url": "/news/internships"
      },
      {
        "id": 67,
        "title": "Research",
        "url": "/news/research"
      },
      {
        "id": 68,
        "title": "Student Success",
        "url": "/news/student-success"
      },
      {
        "id": 69,
        "title": "Abroad Trends",
        "url": "/news/abroad-trends"
      }
    ]
  }
];

// Function to update menu structure
async function updateMenuStructure() {
  try {
    // First clear the existing menu collection
    await Menu.deleteMany({});
    console.log('Deleted existing menu items');

    // Insert new menu structure
    for (const menuItem of newMenuStructure) {
      await Menu.create({
        title: menuItem.title,
        url: menuItem.url,
        children: menuItem.children
      });
      console.log(`Added menu item: ${menuItem.title}`);
    }

    console.log('Menu structure updated successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error updating menu structure:', error);
    mongoose.connection.close();
    process.exit(1);
  }
}