import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import ScholarshipModel from '../models/Scholarship';
import CountryModel from '../models/Country';

// Load environment variables from project root .env file
dotenv.config({ path: path.resolve('..', '.env') });

// Update existing scholarship records with new fields
async function updateScholarships() {
  const dbUrl = process.env.DATABASE_URL;
  console.log('Connecting to MongoDB...', dbUrl ? 'Database URL found' : 'Database URL not found');
  
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  await mongoose.connect(dbUrl);
  console.log('Connected to MongoDB successfully');

  try {
    const scholarships = await ScholarshipModel.find({});
    console.log(`Found ${scholarships.length} scholarships to update`);

    for (const scholarship of scholarships) {
      console.log(`Updating scholarship: ${scholarship.title}`);

      // Set new fields with default values if they don't exist
      const updates: any = {
        overview: scholarship.overview || scholarship.description.substring(0, 150) + '...',
        highlights: scholarship.highlights || [],
        duration: scholarship.duration || '1 year',
        level: scholarship.level || 'Undergraduate, Graduate',
        fieldsCovered: scholarship.fieldsCovered || ['All Fields'],
        eligibility: scholarship.eligibility || 'Academic excellence and meeting university requirements',
        isRenewable: scholarship.isRenewable !== undefined ? scholarship.isRenewable : false,
        benefits: scholarship.benefits || ['Tuition coverage', 'Living stipend'],
        applicationProcedure: scholarship.applicationProcedure || 'Submit application through the official website'
      };

      // Sample scholarship data for Fulbright (if it exists)
      if (scholarship.title.includes('Fulbright')) {
        updates.overview = "The Fulbright Program offers fully-funded scholarships for graduate studies, research, and teaching in the U.S., aiming to improve intercultural relations and academic exchange.";
        updates.highlights = [
          "Fully funded by U.S. government",
          "Covers tuition, living expenses, health insurance, and travel",
          "Prestigious alumni network",
          "160+ participating countries"
        ];
        updates.duration = "1–2 years";
        updates.level = "Master's, PhD";
        updates.fieldsCovered = ["STEM", "Arts", "Social Sciences", "Humanities"];
        updates.eligibility = "Bachelor's degree, strong academic background, English proficiency";
        updates.isRenewable = false;
        updates.benefits = [
          "Full tuition coverage",
          "Monthly living stipend",
          "Travel allowance",
          "Health insurance"
        ];
        updates.applicationProcedure = "Submit online application, academic transcripts, letters of recommendation, and attend an interview.";
      }

      await ScholarshipModel.updateOne({ _id: scholarship._id }, { $set: updates });
    }

    console.log('All scholarships updated successfully');
  } catch (error) {
    console.error('Error updating scholarships:', error);
  }
}

// Update existing country records with new fields
async function updateCountries() {
  try {
    const countries = await CountryModel.find({});
    console.log(`Found ${countries.length} countries to update`);

    for (const country of countries) {
      console.log(`Updating country: ${country.name}`);

      // Set default values if fields don't exist
      const updates: any = {
        overview: country.overview || `${country.name} is a popular destination for international students seeking quality education and cultural experiences.`,
        highlights: country.highlights || [
          `Home to ${country.universities}+ universities and colleges`,
          `${country.acceptanceRate}`,
          "Diverse range of academic programs",
          "Strong international student support"
        ],
        language: country.language || getDefaultLanguage(country.name),
        currency: country.currency || getDefaultCurrency(country.name),
        averageTuition: country.averageTuition || getDefaultTuition(country.name),
        averageLivingCost: country.averageLivingCost || getDefaultLivingCost(country.name),
        visaRequirement: country.visaRequirement || `Student visa required for international students`,
        popularCities: country.popularCities || getDefaultCities(country.name),
        topUniversities: country.topUniversities || ["Various prestigious institutions"],
        educationSystem: country.educationSystem || "International standard education system",
        flag: country.flag || ""
      };

      // US specific data
      if (country.name === "United States") {
        updates.overview = "The United States is home to some of the world's most prestigious universities and research institutions. Known for academic excellence, cultural diversity, and vast opportunities, it attracts over a million international students annually.";
        updates.highlights = [
          "Over 4,500 accredited universities",
          "Wide range of scholarships and assistantships",
          "Top destination for STEM education",
          "Optional Practical Training (OPT) for international students"
        ];
        updates.language = "English";
        updates.currency = "USD";
        updates.averageTuition = "USD 20,000 - 50,000 per year";
        updates.averageLivingCost = "USD 10,000 - 18,000 per year";
        updates.visaRequirement = "F1 Student Visa required with I-20 form from university";
        updates.popularCities = ["New York", "Los Angeles", "Boston", "Chicago", "San Francisco"];
        updates.topUniversities = ["Harvard University", "Stanford University", "MIT"];
        updates.educationSystem = "Credit-based, flexible, and interdisciplinary";
        updates.flag = "https://flagcdn.com/us.svg";
      }

      await CountryModel.updateOne({ _id: country._id }, { $set: updates });
    }

    console.log('All countries updated successfully');
  } catch (error) {
    console.error('Error updating countries:', error);
  }
}

// Helper functions to get default values based on country names
function getDefaultLanguage(countryName: string): string {
  const languageMap: Record<string, string> = {
    "Australia": "English",
    "United Kingdom": "English",
    "Canada": "English, French",
    "United States": "English",
    "Germany": "German",
    "France": "French",
    "Japan": "Japanese",
    "China": "Mandarin Chinese",
    "India": "English, Hindi, and various regional languages"
  };
  
  return languageMap[countryName] || "Various languages";
}

function getDefaultCurrency(countryName: string): string {
  const currencyMap: Record<string, string> = {
    "Australia": "AUD",
    "United Kingdom": "GBP",
    "Canada": "CAD",
    "United States": "USD",
    "Germany": "EUR",
    "France": "EUR",
    "Japan": "JPY",
    "China": "CNY",
    "India": "INR"
  };
  
  return currencyMap[countryName] || "Local currency";
}

function getDefaultTuition(countryName: string): string {
  const tuitionMap: Record<string, string> = {
    "Australia": "AUD 20,000 - 45,000 per year",
    "United Kingdom": "GBP 10,000 - 38,000 per year",
    "Canada": "CAD 20,000 - 30,000 per year",
    "United States": "USD 20,000 - 50,000 per year",
    "Germany": "EUR 0 - 3,000 per year (many public universities are tuition-free)",
    "France": "EUR 3,000 - 10,000 per year",
    "Japan": "JPY 535,800 - 1,725,000 per year",
    "China": "CNY 15,000 - 60,000 per year",
    "India": "INR 1,50,000 - 10,00,000 per year"
  };
  
  return tuitionMap[countryName] || "Varies by institution and program";
}

function getDefaultLivingCost(countryName: string): string {
  const livingCostMap: Record<string, string> = {
    "Australia": "AUD 1,400 - 2,500 per month",
    "United Kingdom": "GBP 1,000 - 1,500 per month",
    "Canada": "CAD 1,000 - 1,800 per month",
    "United States": "USD 1,000 - 2,000 per month",
    "Germany": "EUR 800 - 1,000 per month",
    "France": "EUR 800 - 1,500 per month",
    "Japan": "JPY 80,000 - 120,000 per month",
    "China": "CNY 2,500 - 4,500 per month",
    "India": "INR 15,000 - 30,000 per month"
  };
  
  return livingCostMap[countryName] || "Varies by location";
}

function getDefaultCities(countryName: string): string[] {
  const citiesMap: Record<string, string[]> = {
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
    "United Kingdom": ["London", "Edinburgh", "Manchester", "Birmingham", "Oxford"],
    "Canada": ["Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary"],
    "United States": ["New York", "Los Angeles", "Boston", "Chicago", "San Francisco"],
    "Germany": ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"],
    "France": ["Paris", "Lyon", "Toulouse", "Marseille", "Bordeaux"],
    "Japan": ["Tokyo", "Kyoto", "Osaka", "Nagoya", "Fukuoka"],
    "China": ["Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Hangzhou"],
    "India": ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai"]
  };
  
  return citiesMap[countryName] || ["Major cities"];
}

// Main function
async function main() {
  try {
    await updateScholarships();
    await updateCountries();
    console.log('Database update completed successfully!');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Execute the main function
main();