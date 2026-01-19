import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import { limiter } from './middleware/rate-limiter.js';
import v1Routes from './routes/v1/routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(limiter);

// doc api
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// routes api
app.use('/api/v1', v1Routes);

export default app;