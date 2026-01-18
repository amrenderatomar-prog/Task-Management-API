import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { testConnection } from './src/db/config.js';

app.listen(process.env.PORT || 3000, async () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
    await testConnection();
});