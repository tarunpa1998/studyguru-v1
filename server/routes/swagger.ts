import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger/config';

const router = Router();

// Serve swagger documentation at /api-docs
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Study Guru API Documentation',
}));

// Serve swagger spec as JSON at /api-docs.json
router.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

export default router;