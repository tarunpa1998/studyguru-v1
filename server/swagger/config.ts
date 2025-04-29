import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Study Guru API',
      version: '1.0.0',
      description: 'API documentation for the Study Guru platform',
      contact: {
        name: 'Study Guru Support',
        email: 'support@studyguru.com'
      }
    },
    servers: [
      {
        url: '/api',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication operations'
      },
      {
        name: 'Scholarships',
        description: 'Scholarship management operations'
      },
      {
        name: 'Countries',
        description: 'Country information operations'
      },
      {
        name: 'Universities',
        description: 'University information operations'
      },
      {
        name: 'Articles',
        description: 'Article management operations'
      },
      {
        name: 'News',
        description: 'News management operations'
      },
      {
        name: 'Menu',
        description: 'Navigation menu operations'
      },
      {
        name: 'Search',
        description: 'Search operations across all content'
      },
      {
        name: 'Administration',
        description: 'Admin operations'
      },
      {
        name: 'Development',
        description: 'Development and testing operations'
      }
    ]
  },
  apis: [
    './server/routes/*.ts',
    './server/swagger/schemas.ts'
  ]
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;