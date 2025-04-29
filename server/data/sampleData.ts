// Sample data for MongoDB collections

// Menu items with children categories
export const menuItems = [
  {
    title: "Home",
    url: "/",
    children: []
  },
  {
    title: "Scholarships",
    url: "/scholarships",
    children: [
      { id: 1, title: "Undergraduate Scholarships", url: "/scholarships/undergraduate" },
      { id: 2, title: "Graduate Scholarships", url: "/scholarships/graduate" },
      { id: 3, title: "Research Grants", url: "/scholarships/research" },
      { id: 4, title: "Merit-Based Awards", url: "/scholarships/merit" }
    ]
  },
  {
    title: "Countries",
    url: "/countries",
    children: [
      { id: 1, title: "Study in USA", url: "/countries/usa" },
      { id: 2, title: "Study in UK", url: "/countries/uk" },
      { id: 3, title: "Study in Canada", url: "/countries/canada" },
      { id: 4, title: "Study in Australia", url: "/countries/australia" },
      { id: 5, title: "Study in Germany", url: "/countries/germany" }
    ]
  },
  {
    title: "Universities",
    url: "/universities",
    children: [
      { id: 1, title: "Top 100 Universities", url: "/universities/top-100" },
      { id: 2, title: "Affordable Universities", url: "/universities/affordable" },
      { id: 3, title: "Universities by Country", url: "/universities/by-country" }
    ]
  },
  {
    title: "Articles",
    url: "/articles",
    children: [
      { id: 1, title: "Application Tips", url: "/articles/application-tips" },
      { id: 2, title: "Student Visas", url: "/articles/student-visas" },
      { id: 3, title: "Accommodation", url: "/articles/accommodation" },
      { id: 4, title: "Student Life", url: "/articles/student-life" }
    ]
  },
  {
    title: "News",
    url: "/news",
    children: [
      { id: 1, title: "Education News", url: "/news/education" },
      { id: 2, title: "Visa Updates", url: "/news/visa-updates" },
      { id: 3, title: "University Rankings", url: "/news/rankings" }
    ]
  }
];

// Scholarships data
export const scholarships = [
  {
    title: "Fulbright Foreign Student Program",
    description: "The Fulbright Foreign Student Program enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States. The Fulbright Foreign Student Program operates in more than 160 countries worldwide.",
    amount: "$40,000",
    deadline: "October 15, 2025",
    country: "United States",
    tags: ["Fully Funded", "Merit-Based", "Graduate"],
    slug: "fulbright-foreign-student-program",
    link: "https://foreign.fulbrightonline.org/"
  },
  {
    title: "Chevening Scholarships",
    description: "Chevening Scholarships are the UK government's global scholarship program, funded by the Foreign, Commonwealth & Development Office (FCDO) and partner organizations. The scholarships offer full financial support for future leaders to study for any eligible master's degree at any UK university.",
    amount: "Full tuition + stipend",
    deadline: "November 2, 2025",
    country: "United Kingdom",
    tags: ["Fully Funded", "Leadership", "Masters"],
    slug: "chevening-scholarships",
    link: "https://www.chevening.org/"
  },
  {
    title: "DAAD Scholarships",
    description: "The German Academic Exchange Service (DAAD) offers scholarships for international students to study in Germany. DAAD scholarships are highly competitive and cover tuition, living expenses, and travel costs.",
    amount: "€850/month + benefits",
    deadline: "December 1, 2025",
    country: "Germany",
    tags: ["Partially Funded", "Research", "Graduate"],
    slug: "daad-scholarships",
    link: "https://www.daad.de/en/"
  },
  {
    title: "Commonwealth Scholarships",
    description: "Commonwealth Scholarships for master's and PhD study in the UK are offered for citizens of developing Commonwealth countries. These scholarships are funded by the UK Department for International Development.",
    amount: "Full funding",
    deadline: "January 10, 2026",
    country: "United Kingdom",
    tags: ["Fully Funded", "Development", "Commonwealth"],
    slug: "commonwealth-scholarships",
    link: "https://cscuk.fcdo.gov.uk/scholarships/"
  },
  {
    title: "Australia Awards Scholarships",
    description: "Australia Awards Scholarships are long-term development awards administered by the Department of Foreign Affairs and Trade. They aim to contribute to the development needs of Australia's partner countries.",
    amount: "Full tuition + living expenses",
    deadline: "April 30, 2026",
    country: "Australia",
    tags: ["Fully Funded", "Development", "Undergraduate", "Graduate"],
    slug: "australia-awards",
    link: "https://australiaawards.gov.au/"
  }
];

// Countries data
export const countries = [
  {
    name: "United States",
    description: "The United States hosts the most international students in the world. American universities are known for their quality education, diverse programs, and extensive research opportunities. The higher education system offers a flexible approach to studies with many programs allowing students to explore a wide range of subjects before declaring a major.",
    universities: 4500,
    acceptanceRate: "High Acceptance Rate",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    slug: "usa"
  },
  {
    name: "United Kingdom",
    description: "The UK is home to some of the world's most prestigious universities, including Oxford and Cambridge. British higher education has a reputation for world-class research, distinguished faculty, and high student satisfaction. Most undergraduate programs take three years to complete, while master's programs last for one year, making it a cost-effective choice for international students.",
    universities: 160,
    acceptanceRate: "Moderate Acceptance",
    image: "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    slug: "uk"
  },
  {
    name: "Canada",
    description: "Canada offers quality education at affordable tuition rates with globally recognized programs. Canadian universities consistently rank among the top institutions worldwide. The country is known for its safety, multiculturalism, and welcoming attitude toward international students. What's more, Canada offers excellent post-graduation work opportunities and pathways to immigration.",
    universities: 100,
    acceptanceRate: "High Acceptance Rate",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    slug: "canada"
  },
  {
    name: "Australia",
    description: "Australia provides a unique blend of world-class education with a relaxed and high quality of living. Australian universities are known for their innovative research, state-of-the-art facilities, and strong industry connections. The country offers a diverse range of environments, from cosmopolitan cities to regional centers with their own unique character and atmosphere.",
    universities: 43,
    acceptanceRate: "Moderate Acceptance",
    image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    slug: "australia"
  },
  {
    name: "Germany",
    description: "Germany is becoming increasingly popular with international students, offering high-quality education, innovative research opportunities, and tuition-free or low-cost education at public universities. German universities emphasize both theoretical knowledge and practical skills through close ties with industry. The country offers a high quality of life, diverse cultural experiences, and a central location for exploring Europe.",
    universities: 380,
    acceptanceRate: "Moderate Acceptance",
    image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    slug: "germany"
  }
];

// Articles data
export const articles = [
  {
    title: "10 Tips to Ace Your Student Visa Interview",
    content: "Student visa interviews can be intimidating, but proper preparation can increase your chances of success. This article provides actionable advice to help you navigate the visa interview process successfully. Start by thoroughly researching the requirements specific to your destination country. Prepare all required documentation meticulously and make sure to organize them systematically. Practice answers to common interview questions, focusing on your academic goals, financial capacity, and ties to your home country. Dress professionally for the interview to make a positive first impression. Speak clearly and confidently, maintaining eye contact throughout the conversation. Be honest in all your responses as inconsistencies can raise suspicion. Demonstrate your knowledge about the program you're entering and the institution you'll be attending. Clearly articulate your post-graduation plans, especially how you intend to use your education back in your home country. Arrive early to manage stress and last-minute complications. Finally, remain calm and composed throughout the interview process.",
    summary: "Expert advice on how to prepare for and succeed in your student visa interview with practical examples and preparation strategies.",
    slug: "visa-interview-tips",
    publishDate: "May 15, 2025",
    author: "Sarah Johnson",
    authorTitle: "Visa Consultant",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    image: "https://images.unsplash.com/photo-1521791055366-0d553872125f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Visa Tips"
  },
  {
    title: "How to Budget for Your Study Abroad Experience",
    content: "Creating a comprehensive budget is essential for a successful study abroad experience. Begin by researching the cost of living in your destination country, including accommodation, food, transportation, and entertainment. Factor in tuition fees, which vary significantly between countries and institutions. Consider additional academic expenses like textbooks, supplies, and technology requirements. Research scholarship opportunities systematically—many go unclaimed each year due to lack of applicants. Open a local bank account to avoid foreign transaction fees, and investigate student banking packages which often include perks. Budget for health insurance, which may be mandatory for international students. Allow funds for travel and exploration, as experiencing the local culture is a valuable part of studying abroad. Create an emergency fund for unexpected expenses, ideally covering at least one month's living costs. Track your spending meticulously using budgeting apps to stay on track. Finally, explore part-time work opportunities if allowed on your student visa to supplement your income.",
    summary: "A comprehensive guide to managing your finances while studying in a foreign country, including budgeting tips and money-saving strategies.",
    slug: "study-abroad-budget",
    publishDate: "June 3, 2025",
    author: "Michael Chen",
    authorTitle: "Financial Advisor",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Budgeting"
  },
  {
    title: "The Ultimate Guide to Finding Student Accommodation Abroad",
    content: "Securing suitable accommodation is one of the most important aspects of studying abroad. Begin your search early, ideally 3-6 months before your arrival. University housing is often the most convenient option for first-year international students, providing a supportive environment and built-in community. Private off-campus housing may offer more independence and potentially lower costs, but requires more research and local knowledge. Shared apartments are popular among international students, offering cost savings and social opportunities. Consider temporary accommodation for your first few weeks if you prefer to search for permanent housing after arrival. Research neighborhoods thoroughly, considering factors like safety, proximity to campus, public transportation access, and available amenities. Be aware of common rental scams targeting international students, and never transfer money without verifying the legitimacy of the listing. Understand the terms of your lease fully before signing, including duration, payment terms, and break clauses. Budget realistically for all housing-related expenses, including utilities, internet, and security deposits. Finally, explore housing assistance services offered by your university's international student office.",
    summary: "Discover the best options for student housing and tips for securing your ideal living situation in a new country.",
    slug: "housing-guide",
    publishDate: "April 28, 2025",
    author: "Emma Rodriguez",
    authorTitle: "Housing Specialist",
    authorImage: "https://images.unsplash.com/photo-1558203728-00f45181dd84?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Housing"
  },
  {
    title: "Navigating Cultural Adjustment as an International Student",
    content: "Cultural adjustment is a natural process that every international student experiences. Understanding the stages of cultural adjustment—honeymoon, culture shock, adjustment, and adaptation—can help you navigate this journey more effectively. Before departure, research your host country's cultural norms, social etiquette, and common practices to minimize initial surprises. Upon arrival, maintain an open mind and avoid quick judgments about cultural differences. Connect with other international students who can relate to your experiences, as well as local students who can provide cultural insights. Participate in orientation programs and cultural workshops offered by your institution. Develop a routine to create a sense of normalcy and stability in your new environment. Stay connected with family and friends from home, but balance this with immersion in your new setting. Take care of your physical and mental well-being through regular exercise, proper nutrition, and sufficient rest. Seek support from university counseling services if you experience persistent feelings of distress. Remember that cultural adaptation is a skill that develops over time and will benefit you throughout your life and career.",
    summary: "How to overcome culture shock and thrive in a new academic environment when studying abroad.",
    slug: "cultural-adjustment",
    publishDate: "July 10, 2025",
    author: "Dr. James Wong",
    authorTitle: "Cross-Cultural Psychologist",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Student Life"
  },
  {
    title: "Top Language Learning Strategies for Academic Success Abroad",
    content: "Proficiency in the language of instruction is crucial for academic success when studying abroad. Begin language preparation as early as possible, ideally 6-12 months before your program starts. Immerse yourself in the language through films, podcasts, music, and news in your target language. Practice consistently rather than in intensive bursts, as regular exposure is more effective for language acquisition. Utilize language learning apps and online platforms that offer structured courses and interactive practice. Find a language exchange partner or conversation group to practice speaking in a low-pressure environment. Focus on academic vocabulary specific to your field of study, which often differs from conversational language. Attend pre-sessional language courses offered by many universities for international students. Don't be afraid to make mistakes—they are an essential part of the learning process. During lectures, record (with permission) and review difficult content to improve comprehension. Seek help from university language support services, including writing centers and language tutors. Finally, view language learning as a long-term process that continues throughout your academic program.",
    summary: "Effective techniques to improve your language skills for better academic performance in international education settings.",
    slug: "language-learning-strategies",
    publishDate: "August 5, 2025",
    author: "Akiko Tanaka",
    authorTitle: "Language Acquisition Specialist",
    authorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    category: "Academic Tips"
  }
];

// News data
export const newsItems = [
  {
    title: "Major Funding Initiative Announced for International STEM Students",
    content: "A consortium of leading universities across the United States, United Kingdom, and Australia has announced a new $50 million scholarship fund specifically for international students pursuing degrees in Science, Technology, Engineering, and Mathematics (STEM) fields. The initiative, named 'Global STEM Futures,' aims to address the growing demand for skilled STEM professionals worldwide while enhancing international collaboration in research and innovation. Starting in the 2026 academic year, the program will provide full tuition and living stipends for up to 500 undergraduate and graduate students annually. The scholarships will target students from developing nations and underrepresented regions in global higher education. 'This initiative represents our commitment to nurturing the next generation of global scientific leaders,' said Dr. Eleanor Hughes, chairperson of the consortium. Applications will open in January 2026, with the first cohort of scholars beginning their studies in September 2026. The consortium has also announced plans for internship placements with leading technology companies for scholarship recipients.",
    summary: "A consortium of universities has announced a new $50 million scholarship fund for international students pursuing degrees in Science, Technology, Engineering, and Mathematics (STEM) fields.",
    publishDate: "April 15, 2025",
    image: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    category: "Breaking News",
    isFeatured: true,
    slug: "major-funding-initiative"
  },
  {
    title: "UK Simplifies Student Visa Application Process",
    content: "The United Kingdom Home Office has announced significant changes to the student visa application process, aiming to streamline procedures for international students planning to study at UK universities. The new measures include a simplified online application system, reduced documentation requirements, and faster processing times. Under the new system, which will be implemented from June 2025, students from a wider range of countries will be eligible for streamlined processing. The mandatory financial evidence period has been reduced from six months to three months, and students with strong academic backgrounds may qualify for reduced financial requirements. 'These changes reflect our commitment to attracting the brightest minds from around the world to study in the UK,' said the Minister for Immigration. Universities UK, representing British higher education institutions, has welcomed the changes, noting that they will help the UK remain competitive in the global education market. The government estimates that the new measures will reduce visa processing times by up to 40% for many applicants.",
    summary: "New changes aim to streamline the visa application process for international students planning to study in the United Kingdom.",
    publishDate: "March 10, 2025",
    image: "https://images.unsplash.com/photo-1535231540604-72e8fbaf8cdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "Visa Updates",
    isFeatured: false,
    slug: "uk-simplifies-process"
  },
  {
    title: "Latest Global University Rankings Released",
    content: "The 2025 edition of the prestigious World University Rankings has been released, showing significant changes in the landscape of global higher education. American and British institutions continue to dominate the top spots, but universities from China, Singapore, and Switzerland have made remarkable advances. Massachusetts Institute of Technology (MIT) maintained its position at the top of the rankings for the fifth consecutive year, followed by Stanford University and Harvard University. The University of Oxford and University of Cambridge rounded out the top five. The most notable shifts came from Asian universities, with five Chinese universities now placing in the top 50, up from just two in 2020. Tsinghua University achieved its highest-ever ranking at number 18. The rankings, which evaluate institutions on research output, teaching quality, international outlook, and industry connections, also highlighted the growing strength of specialized technology and science-focused universities. The report noted that institutions with strong STEM programs and research partnerships with industry showed the most significant improvements in their rankings positions.",
    summary: "The new rankings show significant changes in the top international education destinations, with Asian universities making notable advances.",
    publishDate: "February 27, 2025",
    image: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "University Updates",
    isFeatured: false,
    slug: "global-rankings"
  },
  {
    title: "Canada Expands Post-Graduation Work Permit Program",
    content: "The Canadian government has announced a significant expansion of its Post-Graduation Work Permit Program (PGWPP), offering international students more opportunities to gain work experience and pathways to permanent residency. Under the new provisions, international graduates from eligible Canadian institutions will be able to obtain work permits for up to five years, extended from the current three-year maximum. Additionally, the program will now include graduates from a wider range of programs, including shorter diploma and certificate courses from accredited institutions. 'International students contribute immensely to Canada's economy and cultural fabric,' said the Minister of Immigration, Refugees and Citizenship. 'These enhancements will help Canada attract and retain global talent.' The expanded program also includes new pathways to permanent residency for international graduates working in sectors with labor shortages, particularly in healthcare, technology, and skilled trades. Industry leaders have welcomed the changes, noting that they will help address Canada's growing workforce needs while providing valuable opportunities for international graduates.",
    summary: "New policy changes offer international students in Canada extended work permits and additional pathways to permanent residency after graduation.",
    publishDate: "January 15, 2025",
    image: "https://images.unsplash.com/photo-1509118796018-30cc4ce216f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "Immigration News",
    isFeatured: true,
    slug: "canada-expands-work-permits"
  },
  {
    title: "Study Reveals Academic Benefits of International Education",
    content: "A comprehensive new study conducted across multiple countries has highlighted the significant academic and career benefits of international education experiences. The research, which followed more than 5,000 students over a ten-year period, found that those who studied abroad achieved higher grades upon returning to their home institutions and were more likely to pursue advanced degrees. According to the findings, international students developed enhanced critical thinking skills, greater cultural awareness, and improved language abilities that translated into academic advantages. The study also revealed long-term career benefits, with internationally educated graduates reporting higher starting salaries and faster career advancement compared to peers who did not study abroad. 'This research confirms what many educators have long believed—that international education provides benefits that extend far beyond the classroom,' said Dr. Maria Gonzalez, the study's lead researcher. University administrators are citing the research as evidence for expanding international exchange programs and study abroad opportunities for students.",
    summary: "New research demonstrates that studying abroad leads to improved academic performance and better career outcomes for students.",
    publishDate: "January 5, 2025",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    category: "Research",
    isFeatured: false,
    slug: "academic-benefits-study"
  }
];

// Universities data
export const universities = [
  {
    name: "Harvard University",
    description: "Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Established in 1636, it is the oldest institution of higher learning in the United States. Harvard consistently ranks among the top universities worldwide and has produced numerous Nobel laureates, world leaders, and innovators. The university offers a wide range of undergraduate, graduate, and professional programs across various disciplines through its numerous schools and faculties.",
    country: "United States",
    ranking: 1,
    image: "https://images.unsplash.com/photo-1512697230323-74151c14ad4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    slug: "harvard-university",
    features: ["World-class faculty", "Extensive research opportunities", "Global alumni network", "Generous financial aid", "Historic campus"]
  },
  {
    name: "University of Oxford",
    description: "The University of Oxford is a collegiate research university in Oxford, England. Founded in 1096, it is the oldest university in the English-speaking world and the world's second-oldest university in continuous operation. Oxford is composed of 39 semi-autonomous constituent colleges and offers a unique educational experience where students benefit from both the college system and university resources. The university's strengths span the full spectrum of academic disciplines, from sciences to humanities.",
    country: "United Kingdom",
    ranking: 2,
    image: "https://images.unsplash.com/photo-1580491883528-bdd97b95c4e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    slug: "university-of-oxford",
    features: ["Historic institution", "Tutorial-based learning", "Prestigious scholarship programs", "Collegiate system", "World-leading research"]
  },
  {
    name: "University of Toronto",
    description: "The University of Toronto is a public research university in Toronto, Ontario, Canada. Founded in 1827, it is Canada's oldest and most prestigious university. The university is known for its research innovations, including the discovery of insulin and stem cells. With three distinct campuses and 18 divisions and faculties, the University of Toronto offers an extraordinary range of academic opportunities. The university is consistently ranked as one of the top public universities globally and is renowned for its diverse and inclusive community.",
    country: "Canada",
    ranking: 18,
    image: "https://images.unsplash.com/photo-1585503507680-93f1d71efaa5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    slug: "university-of-toronto",
    features: ["Diverse student body", "Strong research funding", "Urban campus", "Comprehensive programs", "Post-graduation work opportunities"]
  },
  {
    name: "ETH Zurich",
    description: "ETH Zurich (Swiss Federal Institute of Technology) is a public research university in Zurich, Switzerland. Founded in 1854, it focuses primarily on science, technology, engineering, and mathematics. ETH Zurich is consistently ranked among the top universities in the world, particularly in scientific and technological disciplines. The university has produced 21 Nobel Prize winners, including Albert Einstein. ETH Zurich maintains strong connections with industry and offers innovative programs that combine academic excellence with practical applications.",
    country: "Switzerland",
    ranking: 8,
    image: "https://images.unsplash.com/photo-1558434809-9a9e7dea47cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    slug: "eth-zurich",
    features: ["Leading technical institution", "Strong industry connections", "State-of-the-art research facilities", "Multilingual environment", "Beautiful Alpine location"]
  },
  {
    name: "National University of Singapore",
    description: "The National University of Singapore (NUS) is the oldest and most prestigious university in Singapore. Founded in 1905, it is a comprehensive research university offering a wide array of disciplines across 17 faculties and schools. NUS is known for its innovative approach to education, including its Yale-NUS College, a collaboration with Yale University. The university combines Asian and Western intellectual traditions, providing a unique educational perspective. NUS is consistently ranked as one of the top universities in Asia and is among the leading institutions globally.",
    country: "Singapore",
    ranking: 11,
    image: "https://images.unsplash.com/photo-1630920272088-1b5577c0a105?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    slug: "national-university-singapore",
    features: ["Asia's leading university", "Global focus", "Entrepreneurship hub", "Residential college system", "Research excellence"]
  }
];