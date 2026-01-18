import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import authRoutes from './v1/components/authentication/auth.routes.js';
import { limiter } from './middleware/rate-limiter.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(limiter);

app.use('/api/v1/auth', authRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;