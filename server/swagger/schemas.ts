/**
 * @swagger
 * components:
 *   schemas:
 *     Scholarship:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - amount
 *         - deadline
 *         - country
 *         - tags
 *         - slug
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated MongoDB ID
 *         title:
 *           type: string
 *           description: The scholarship title
 *         description:
 *           type: string
 *           description: Detailed scholarship description
 *         amount:
 *           type: string
 *           description: The scholarship amount or financial support details
 *         deadline:
 *           type: string
 *           description: The application deadline
 *         country:
 *           type: string
 *           description: The country offering the scholarship
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Categories or tags for the scholarship
 *         slug:
 *           type: string
 *           description: URL-friendly version of the title
 *         link:
 *           type: string
 *           description: External link to more information or application
 *       example:
 *         _id: "60d21b4667d0d8992e610c85"
 *         title: "Fulbright Foreign Student Program"
 *         description: "The Fulbright Foreign Student Program enables graduate students to study in the United States."
 *         amount: "$40,000"
 *         deadline: "October 15, 2025"
 *         country: "United States"
 *         tags: ["Fully Funded", "Graduate", "Research"]
 *         slug: "fulbright-foreign-student-program"
 *         link: "https://foreign.fulbrightonline.org/"
 *
 *     Country:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - slug
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: The country name
 *         description:
 *           type: string
 *           description: Detailed country description
 *         universities:
 *           type: number
 *           description: Number of universities in the country
 *         acceptanceRate:
 *           type: string
 *           description: General acceptance rate information
 *         image:
 *           type: string
 *           description: URL to the country image
 *         slug:
 *           type: string
 *           description: URL-friendly version of the name
 *       example:
 *         _id: "60d21b4667d0d8992e610c86"
 *         name: "United States"
 *         description: "The United States hosts the most international students in the world."
 *         universities: 4500
 *         acceptanceRate: "High Acceptance Rate"
 *         image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29"
 *         slug: "usa"
 *
 *     University:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - country
 *         - slug
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated MongoDB ID
 *         name:
 *           type: string
 *           description: The university name
 *         description:
 *           type: string
 *           description: Detailed university description
 *         country:
 *           type: string
 *           description: The country where the university is located
 *         ranking:
 *           type: number
 *           description: University global ranking
 *         image:
 *           type: string
 *           description: URL to the university image
 *         slug:
 *           type: string
 *           description: URL-friendly version of the name
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: Key features of the university
 *       example:
 *         _id: "60d21b4667d0d8992e610c87"
 *         name: "Harvard University"
 *         description: "Harvard University is a private Ivy League research university in Cambridge, Massachusetts."
 *         country: "United States"
 *         ranking: 1
 *         image: "https://images.unsplash.com/photo-1512697230323-74151c14ad4a"
 *         slug: "harvard-university"
 *         features: ["World-class faculty", "Extensive research opportunities", "Global alumni network"]
 *
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - summary
 *         - slug
 *         - publishDate
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated MongoDB ID
 *         title:
 *           type: string
 *           description: The article title
 *         content:
 *           type: string
 *           description: Full article content
 *         summary:
 *           type: string
 *           description: Brief summary of the article
 *         slug:
 *           type: string
 *           description: URL-friendly version of the title
 *         publishDate:
 *           type: string
 *           description: Publication date
 *         author:
 *           type: string
 *           description: Author name
 *         authorTitle:
 *           type: string
 *           description: Author's title or role
 *         authorImage:
 *           type: string
 *           description: URL to author's image
 *         image:
 *           type: string
 *           description: URL to the article cover image
 *         category:
 *           type: string
 *           description: Article category
 *       example:
 *         _id: "60d21b4667d0d8992e610c88"
 *         title: "10 Tips to Ace Your Student Visa Interview"
 *         content: "Student visa interviews can be intimidating, but proper preparation can increase your chances of success."
 *         summary: "Expert advice on how to prepare for your visa interview."
 *         slug: "visa-interview-tips"
 *         publishDate: "May 15, 2025"
 *         author: "Sarah Johnson"
 *         authorTitle: "Visa Consultant"
 *         authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
 *         image: "https://images.unsplash.com/photo-1521791055366-0d553872125f"
 *         category: "Visa Tips"
 *
 *     News:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - summary
 *         - publishDate
 *         - slug
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated MongoDB ID
 *         title:
 *           type: string
 *           description: The news title
 *         content:
 *           type: string
 *           description: Full news content
 *         summary:
 *           type: string
 *           description: Brief summary of the news
 *         publishDate:
 *           type: string
 *           description: Publication date
 *         image:
 *           type: string
 *           description: URL to the news cover image
 *         category:
 *           type: string
 *           description: News category
 *         isFeatured:
 *           type: boolean
 *           description: Flag for featured news
 *         slug:
 *           type: string
 *           description: URL-friendly version of the title
 *       example:
 *         _id: "60d21b4667d0d8992e610c89"
 *         title: "Major Funding Initiative Announced for International STEM Students"
 *         content: "A consortium of leading universities has announced a new $50 million scholarship fund."
 *         summary: "New $50 million scholarship fund announced for STEM students."
 *         publishDate: "April 15, 2025"
 *         image: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4"
 *         category: "Breaking News"
 *         isFeatured: true
 *         slug: "major-funding-initiative"
 *
 *     MenuItem:
 *       type: object
 *       required:
 *         - title
 *         - url
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated MongoDB ID
 *         title:
 *           type: string
 *           description: Menu item title
 *         url:
 *           type: string
 *           description: URL path for the menu item
 *         children:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *           description: Child menu items
 *       example:
 *         _id: "60d21b4667d0d8992e610c8a"
 *         title: "Scholarships"
 *         url: "/scholarships"
 *         children: [
 *           {
 *             id: 1,
 *             title: "Undergraduate Scholarships",
 *             url: "/scholarships/undergraduate"
 *           },
 *           {
 *             id: 2,
 *             title: "Graduate Scholarships",
 *             url: "/scholarships/graduate"
 *           }
 *         ]
 *
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated MongoDB ID
 *         username:
 *           type: string
 *           description: User's username
 *         password:
 *           type: string
 *           description: User's hashed password
 *       example:
 *         _id: "60d21b4667d0d8992e610c8b"
 *         username: "admin"
 *         password: "[hashed password]"
 */