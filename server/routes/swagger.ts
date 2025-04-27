import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger/config';

const router = Router();

// Serve Swagger UI at /api-docs
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerSpec));

// Serve swagger.json for consumption
router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

export default router;