# Task Management API 

A robust and scalable RESTful API for managing tasks with role-based access control, built with Node.js, Express, and Supabase.

##  Features

- **User Authentication & Authorization**
  - JWT-based authentication with access and refresh tokens
  - Role-based access control (Admin/User)
  - Secure password hashing with bcrypt
  
- **Task Management**
  - Create, read, update, and delete tasks
  - Filter tasks by status, priority, and search queries
  - Assign tasks to users
  - Set task priorities and due dates
  
- **Admin Panel**
  - User management (view, update, delete users)
  - System-wide task oversight
  - Role assignment capabilities

- **Security & Performance**
  - Rate limiting to prevent abuse
  - CORS enabled for cross-origin requests
  - Input validation and sanitization
  - JWT token-based authentication

- **API Documentation**
  - Interactive Swagger UI documentation
  - Comprehensive endpoint descriptions

##  Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** Supabase (PostgreSQL)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **API Documentation:** Swagger (swagger-jsdoc, swagger-ui-express)
- **Validation:** Custom validators
- **Security:** express-rate-limit, CORS
- **Environment Variables:** dotenv

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- A Supabase account and project

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amrenderatomar-prog/Task-Management-API.git
   cd Task-Management-API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key

   ```

4. **Database Setup**
   
   Create the following tables in your Supabase database:

   **Users Table:**
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role VARCHAR(50) DEFAULT 'user',
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **Tasks Table:**
   ```sql
   CREATE TABLE tasks (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     title VARCHAR(255) NOT NULL,
     description TEXT,
     status VARCHAR(50) DEFAULT 'pending',
     priority VARCHAR(50) DEFAULT 'medium',
     due_date TIMESTAMP,
     created_by UUID REFERENCES users(id),
     assigned_to UUID REFERENCES users(id),
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **Refresh Tokens Table:**
   ```sql
   CREATE TABLE refresh_tokens (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES users(id),
     token TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

##  Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Documentation

Once the server is running, access the interactive Swagger documentation at:
```
http://localhost:3000/api-docs
```

##  API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user

### Tasks
- `GET /api/v1/tasks` - Get all tasks (filtered by user or admin)
- `GET /api/v1/tasks/:id` - Get task by ID
- `POST /api/v1/tasks` - Create a new task
- `PUT /api/v1/tasks/:id` - Update a task
- `DELETE /api/v1/tasks/:id` - Delete a task

**Query Parameters for GET /api/v1/tasks:**
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `search` - Search tasks by title

### Admin
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/users/:id` - Get user by ID
- `PUT /api/v1/admin/users/:id` - Update user details
- `DELETE /api/v1/admin/users/:id` - Delete a user

##  Authentication

The API uses JWT tokens for authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

##  User Roles

- **User:** Can create, view, update, and delete their own tasks or tasks assigned to them
- **Admin:** Has full access to all tasks and user management

##  Project Structure

```
Task-Management-API/
├── src/
│   ├── app.js                      # Express app configuration
│   ├── db/
│   │   └── config.js               # Supabase configuration
│   ├── docs/
│   │   └── swagger.js              # Swagger documentation setup
│   ├── middleware/
│   │   ├── auth-handler.js         # JWT authentication middleware
│   │   ├── authorization.js        # Role-based authorization
│   │   └── rate-limiter.js         # Rate limiting configuration
│   ├── routes/
│   │   └── v1/
│   │       └── routes.js           # API route definitions
│   ├── utils/
│   │   ├── helpers.js              # Utility functions
│   │   └── jwt-token.js            # JWT token generation
│   └── v1/
│       └── components/
│           ├── admin/              # Admin module
│           ├── authentication/     # Auth module
│           └── tasks/              # Tasks module
├── server.js                       # Application entry point
├── package.json                    # Dependencies and scripts
└── .env                           # Environment variables
```

##  Author

**Amrender Tomar**
- GitHub: [@amrenderatomar-prog](https://github.com/amrenderatomar-prog)
