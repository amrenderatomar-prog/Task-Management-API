import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import { limiter } from './middleware/rate-limiter.js';
import authRoutes from './v1/components/authentication/auth.routes.js';
import taskRoutes from './v1/components/tasks/tasks.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(limiter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/tasks", taskRoutes);

export default app;