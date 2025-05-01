import connectToDatabase from '../lib/mongodb';
import Article from '../models/Article';
import News from '../models/News';

/**
 * This script updates existing Article and News documents with new fields
 */
async function updateCollections() {
  console.log('Connecting to MongoDB...');
  const db = await connectToDatabase();
  
  if (!db) {
    console.error('Failed to connect to MongoDB');
    process.exit(1);
  }
  
  console.log('Connected to MongoDB successfully');
  
  try {
    // Update Articles
    console.log('Updating Articles collection...');
    
    const articles = await Article.find({});
    console.log(`Found ${articles.length} articles`);
    
    for (const article of articles) {
      // Generate table of contents from content
      const tableOfContents = generateTableOfContents(article.content);
      
      // Generate reading time based on content length
      const readingTime = calculateReadingTime(article.content);
      
      // Generate sample FAQs based on article content
      const faqs = generateFaqs(article.title, article.content);
      
      // Find related articles (excluding current article)
      const relatedArticles = await findRelatedArticles(article);
      
      // Update the article with new fields
      article.isFeatured = article.isFeatured || Math.random() > 0.7; // 30% chance to be featured
      article.relatedArticles = relatedArticles;
      article.seo = {
        metaTitle: `${article.title} | StudyGlobal`,
        metaDescription: article.summary,
        keywords: generateKeywords(article.title, article.category)
      };
      article.views = Math.floor(Math.random() * 1000); // Random views count
      article.readingTime = readingTime;
      article.helpful = {
        yes: Math.floor(Math.random() * 50),
        no: Math.floor(Math.random() * 10)
      };
      article.tableOfContents = tableOfContents;
      article.faqs = faqs;
      
      await article.save();
      console.log(`Updated article: ${article.title}`);
    }
    
    // Update News
    console.log('Updating News collection...');
    
    const newsItems = await News.find({});
    console.log(`Found ${newsItems.length} news items`);
    
    for (const newsItem of newsItems) {
      // Generate table of contents from content
      const tableOfContents = generateTableOfContents(newsItem.content);
      
      // Generate reading time based on content length
      const readingTime = calculateReadingTime(newsItem.content);
      
      // Generate sample FAQs based on news content
      const faqs = generateFaqs(newsItem.title, newsItem.content);
      
      // Find related articles
      const relatedArticles = await findRelatedNewsArticles(newsItem);
      
      // Update the news item with new fields
      newsItem.relatedArticles = relatedArticles;
      newsItem.seo = {
        metaTitle: `${newsItem.title} | StudyGlobal News`,
        metaDescription: newsItem.summary,
        keywords: generateKeywords(newsItem.title, newsItem.category)
      };
      newsItem.views = Math.floor(Math.random() * 500); // Random views count
      newsItem.readingTime = readingTime;
      newsItem.helpful = {
        yes: Math.floor(Math.random() * 30),
        no: Math.floor(Math.random() * 5)
      };
      newsItem.tableOfContents = tableOfContents;
      newsItem.faqs = faqs;
      
      await newsItem.save();
      console.log(`Updated news item: ${newsItem.title}`);
    }
    
    console.log('All collections updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating collections:', error);
    process.exit(1);
  }
}

/**
 * Generate table of contents from content
 */
function generateTableOfContents(content: string) {
  const headingRegex = /<h([2-4])[^>]*>(.*?)<\/h\1>/g;
  const tableOfContents = [];
  let match;
  let counter = 0;
  
  // Reset regex lastIndex
  headingRegex.lastIndex = 0;
  
  // If no headings found in the content, create some based on paragraphs
  if (!content.match(headingRegex)) {
    const paragraphs = content.split('\n\n').slice(0, 5);
    return paragraphs.map((para, index) => {
      const text = para.substring(0, 50).replace(/<[^>]*>/g, '').trim() + '...';
      return {
        id: `section-${index + 1}`,
        title: text,
        level: 2
      };
    });
  }
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const title = match[2].replace(/<[^>]*>/g, ''); // Remove any HTML tags inside the heading
    const id = `heading-${counter++}`;
    
    tableOfContents.push({
      id,
      title,
      level
    });
  }
  
  return tableOfContents;
}

/**
 * Calculate reading time based on content length
 */
function calculateReadingTime(content: string) {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  
  // Average reading speed is about 200-250 words per minute
  const wordCount = text.split(/\s+/).length;
  const readingTimeMinutes = Math.ceil(wordCount / 200);
  
  return `${readingTimeMinutes} min read`;
}

/**
 * Generate FAQs based on title and content
 */
function generateFaqs(title: string, content: string) {
  // Extract potential keywords from title
  const keywords = title.split(' ')
    .filter(word => word.length > 3)
    .map(word => word.replace(/[^\w\s]/gi, ''));
  
  // Create FAQs using keywords
  const faqs = [
    {
      question: `What are the main points covered in "${title}"?`,
      answer: "This article covers key information, requirements, and tips related to the topic. You'll find comprehensive guidance and expert advice to help you navigate this important area."
    },
    {
      question: `How can I apply this information about ${keywords[0] || 'this topic'} in my education journey?`,
      answer: "You can apply this information by following the steps outlined in the article, researching further resources we've mentioned, and connecting with relevant institutions or programs for more specific guidance."
    },
    {
      question: `Are there any prerequisites for ${keywords[1] || 'this process'}?`,
      answer: "While specific prerequisites may vary depending on your situation, generally you should prepare all relevant documentation, research your options thoroughly, and plan ahead of deadlines to ensure a smooth process."
    },
    {
      question: `What are common challenges students face with ${keywords[2] || 'this aspect'} of studying abroad?`,
      answer: "Common challenges include navigating complex application procedures, meeting eligibility requirements, securing funding, and adapting to new educational environments. This article provides strategies to overcome these challenges."
    }
  ];
  
  return faqs;
}

/**
 * Find related articles based on category and keywords
 */
async function findRelatedArticles(currentArticle: any) {
  try {
    // Find articles in the same category, excluding the current one
    const relatedByCategoryQuery = {
      _id: { $ne: currentArticle._id },
      category: currentArticle.category
    };
    
    // Find up to 3 related articles
    const relatedArticles = await Article.find(relatedByCategoryQuery)
      .select('slug')
      .limit(3)
      .lean();
    
    // If we don't have enough related articles, find more based on different criteria
    if (relatedArticles.length < 3) {
      const needed = 3 - relatedArticles.length;
      const existingIds = relatedArticles.map(article => article._id);
      existingIds.push(currentArticle._id);
      
      const moreRelated = await Article.find({
        _id: { $nin: existingIds }
      })
        .select('slug')
        .limit(needed)
        .lean();
      
      relatedArticles.push(...moreRelated);
    }
    
    return relatedArticles.map(article => article.slug);
  } catch (error) {
    console.error('Error finding related articles:', error);
    return [];
  }
}

/**
 * Find related news articles and normal articles
 */
async function findRelatedNewsArticles(currentNews: any) {
  try {
    // Find news items in the same category, excluding the current one
    const relatedByCategory = {
      _id: { $ne: currentNews._id },
      category: currentNews.category
    };
    
    // Find up to 2 related news items
    const relatedNews = await News.find(relatedByCategory)
      .select('slug')
      .limit(2)
      .lean();
    
    // Find 1 related article
    const relatedArticle = await Article.find({
      category: { $regex: new RegExp(currentNews.category, 'i') }
    })
      .select('slug')
      .limit(1)
      .lean();
    
    // Combine both for up to 3 related items
    const combined = [
      ...relatedNews.map(news => news.slug),
      ...relatedArticle.map(article => article.slug)
    ];
    
    // If we still don't have 3, add more news
    if (combined.length < 3) {
      const needed = 3 - combined.length;
      const existingIds = relatedNews.map(news => news._id);
      existingIds.push(currentNews._id);
      
      const moreRelated = await News.find({
        _id: { $nin: existingIds }
      })
        .select('slug')
        .limit(needed)
        .lean();
      
      combined.push(...moreRelated.map(news => news.slug));
    }
    
    return combined;
  } catch (error) {
    console.error('Error finding related news:', error);
    return [];
  }
}

/**
 * Generate keywords based on title and category
 */
function generateKeywords(title: string, category: string) {
  const baseKeywords = ['study abroad', 'education', 'international students', 'global education'];
  
  // Add category-specific keywords
  const categoryKeywords = category.toLowerCase().split(/\s+/);
  
  // Add title keywords (excluding common words)
  const commonWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'about', 'of'];
  const titleKeywords = title.toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .map(word => word.replace(/[^\w\s]/gi, ''));
  
  // Combine all keywords and remove duplicates
  const allKeywords = [...baseKeywords, ...categoryKeywords, ...titleKeywords];
  const uniqueKeywords = [...new Set(allKeywords)];
  
  return uniqueKeywords.slice(0, 8); // Limit to 8 keywords
}

// Run the update script
updateCollections();