# Time Management Coach - Backend

A robust backend service for the **Time Management Coach** application, built with modern web technologies to help users manage their tasks, track focus sessions, and improve productivity.

## 🚀 Features

- ✅ **Google Sign-In Authentication** (JWT-based)
- ✅ **Task Management** (Full CRUD operations)
- ✅ **Quick Tasks** logging for unplanned interruptions
- ✅ **Focus Mode** sessions tracking with analytics
- ✅ **Priority Tags Editor** for advanced task classification
- ✅ **RESTful API** design with proper error handling
- ✅ **Clean modular architecture** for scalability
- ✅ **Database migrations** and seeding support

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Server runtime environment |
| **Express.js** | Web application framework |
| **Prisma ORM** | Database management and migrations |
| **MariaDB** | Primary database |
| **JWT** | Authentication and authorization |
| **bcryptjs** | Password hashing |
| **Google OAuth2** | Third-party authentication |

## 📂 Project Structure

```
Time-Management-Coach-backend/
├── controllers/           # Request handlers and business logic
│   ├── authController.js
│   ├── taskController.js
│   ├── focusController.js
│   └── tagController.js
├── routes/               # API route definitions
│   ├── auth.js
│   ├── tasks.js
│   ├── focus.js
│   └── tags.js
├── middleware/           # Authentication and validation middleware
│   ├── auth.js
│   └── validation.js
├── prisma/              # Database schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── config/              # Configuration files
│   └── database.js
├── utils/               # Helper functions and utilities
│   ├── jwt.js
│   └── responses.js
├── server.js            # Main server entry point
├── package.json         # Dependencies and scripts
└── .env.example         # Environment variables template
```

## ⚡ Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MariaDB** (v10.4 or higher)
- **Git**

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Gurunath-S/Time-Management-Coach-backend.git
cd Time-Management-Coach-backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/time_management_db"

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 4️⃣ Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# (Optional) Seed the database with sample data
npx prisma db seed
```

### 5️⃣ Start the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will be running at `http://localhost:5000`

## 📋 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/google` | Google OAuth login |
| `GET` | `/api/auth/profile` | Get user profile |

### Task Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all user tasks |
| `POST` | `/api/tasks` | Create new task |
| `GET` | `/api/tasks/:id` | Get task by ID |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |

### Quick Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/quick-tasks` | Get quick tasks log |
| `POST` | `/api/quick-tasks` | Log new quick task |
| `GET` | `/api/quick-tasks/analytics` | Quick tasks analytics |

### Focus Sessions

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/focus` | Get focus sessions |
| `POST` | `/api/focus/start` | Start focus session |
| `PUT` | `/api/focus/:id/end` | End focus session |
| `GET` | `/api/focus/stats` | Focus session statistics |

### Priority Tags

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tags` | Get all priority tags |
| `POST` | `/api/tags` | Create new tag |
| `PUT` | `/api/tags/:id` | Update tag |
| `DELETE` | `/api/tags/:id` | Delete tag |

