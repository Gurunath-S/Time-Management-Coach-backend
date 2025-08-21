# Time Management Coach - Backend

A robust backend service for the **Time Management Coach** application, built with modern web technologies to help users manage their tasks, track focus sessions, and improve productivity.

## 🚀 Features

- ✅ **Google Sign-In Authentication** (JWT-based)
- ✅ **Task Management** (Full CRUD operations)
- ✅ **Quick Tasks** logging for unplanned interruptions
- ✅ **Focus Mode** sessions tracking with analytics
- ✅ **Priority Tags Editor** for advanced task classification

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Server runtime environment |
| **Express.js** | Web application framework |
| **Prisma ORM** | Database management and migrations |
| **MariaDB** | Primary database |
| **JWT** | Authentication and authorization |
| **bcryptjs** | Password hashing |
| **Google OAuth2** | authentication |

## 📂 Project Structure

## ⚡ Quick Start
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
