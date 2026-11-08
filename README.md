# AI-Powered SaaS Backend Platform

A feature-rich, subscription-based SaaS backend built with **Node.js, Express.js, and MongoDB**. This platform provides user authentication, subscription management, AI-powered tools, API key management, usage tracking, and admin controls.

## 🚀 Features

### 1. User Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected routes
- User profile management
- Logout functionality

### 2. Subscription Management
- Free, Starter, Pro, and Enterprise plans
- View available subscription plans
- Change or upgrade subscriptions
- Cancel subscriptions
- Plan-based access control

### 3. AI-Powered Tools
- AI Chat
- Code Generator
- Text Summarizer
- Email Writer
- Image Prompt Generator
- AI request history
- Delete AI requests
- Save and manage favorites

*Note: AI responses currently use mock response logic and can be integrated with a real AI provider in the future.*

### 4. Usage Tracking
- Daily request tracking
- Monthly usage statistics
- Token usage tracking
- Remaining daily request limits
- Tool usage history

### 5. API Key Management
- Generate API keys
- Regenerate API keys
- Delete API keys
- Secure API key hashing
- Track API key usage
- Authenticate AI requests using API keys

### 6. Admin Dashboard APIs
- View all users
- Block and unblock users
- Delete users
- Manage subscription plans
- Manage AI tools
- View subscriptions
- Monitor platform analytics

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | Database modeling |
| JWT | Authentication |
| bcrypt | Password hashing |
| dotenv | Environment configuration |
| CORS | Cross-origin resource sharing |

## 📁 Project Structure

```text
AI-SaaS-Backend/
│
├── config/
│   ├── connectDB.js
│   ├── seedPlans.js
│   ├── seedTools.js
│   └── createAdmin.js
│
├── controllers/
│   ├── userController.js
│   ├── planController.js
│   ├── subscriptionController.js
│   ├── aiController.js
│   ├── apiKeyController.js
│   └── adminController.js
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── subscriptionMiddleware.js
│   └── apiKeyMiddleware.js
│
├── models/
│   ├── User.js
│   ├── Plan.js
│   ├── Subscription.js
│   ├── AITool.js
│   ├── AIRequest.js
│   ├── APIKey.js
│   └── Favorite.js
│
├── routes/
│   ├── userRoutes.js
│   ├── planRoutes.js
│   ├── subscriptionRoutes.js
│   ├── aiRoutes.js
│   ├── apiKeyRoutes.js
│   └── adminRoutes.js
│
├── services/
│   ├── aiService.js
│   └── usageService.js
│
├── .env
├── .gitignore
├── index.js
└── package.json
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd AI-SaaS-Backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

Replace the example values with your actual credentials.

**Important:** Never upload your `.env` file or database credentials to GitHub.

### 5. Run the Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will run at:

```text
http://localhost:8000
```

## 🔗 API Endpoints

Base URL: `/api`

### User Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/user/signup` | Register user |
| POST | `/user/login` | Login user |
| POST | `/user/logout` | Logout user |
| GET | `/user/profile` | Get user profile |

### Plan Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/plans` | Get all plans |
| GET | `/plans/:id` | Get plan details |
| POST | `/plans` | Create plan (Admin) |
| PUT | `/plans/:id` | Update plan (Admin) |
| DELETE | `/plans/:id` | Delete plan (Admin) |

### Subscription Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/subscriptions` | Get current subscription |
| POST | `/subscriptions/change` | Change subscription |
| POST | `/subscriptions/cancel` | Cancel subscription |

### AI Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/ai/generate` | Generate AI response using JWT |
| POST | `/ai/api-generate` | Generate AI response using API key |
| GET | `/ai/history` | Get AI request history |
| DELETE | `/ai/history` | Delete all history |
| DELETE | `/ai/history/:id` | Delete specific request |
| GET | `/ai/favorites` | Get favorite requests |
| POST | `/ai/favorites/:id` | Add favorite |
| DELETE | `/ai/favorites/:id` | Remove favorite |
| GET | `/ai/usage` | Get usage statistics |

### API Key Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/keys/generate` | Generate API key |
| POST | `/keys/regenerate` | Regenerate API key |
| DELETE | `/keys/delete` | Delete API key |
| GET | `/keys` | Get API key information |
| GET | `/keys/usage` | Get API key usage |

### Admin Routes

Admin endpoints provide user management, AI tool management, subscription management, and platform analytics.

All protected admin endpoints require administrator authentication.

## 🔐 Authentication

JWT-protected endpoints require an authorization header:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

API-key authenticated AI requests use:

```text
x-api-key: YOUR_API_KEY
```

## 🗄️ Database

The project uses MongoDB Atlas for cloud database hosting.

Mongoose models manage:
- Users
- Plans
- Subscriptions
- AI Tools
- AI Requests
- API Keys
- Favorites

Default subscription plans and AI tools are seeded when the application starts.

## 🌐 Deployment

The backend can be deployed using Vercel.

Deployment requirements:
1. Upload the project to GitHub.
2. Import the repository into Vercel.
3. Configure environment variables in Vercel.
4. Connect the MongoDB Atlas database.
5. Deploy the application.
6. Test the live API endpoints using Postman.

**Live Deployment:** Add your Vercel URL here.

**GitHub Repository:** Add your GitHub repository URL here.

## 🧪 API Testing

The REST API can be tested using Postman.

Recommended testing sequence:

1. Register a new user.
2. Login and obtain a JWT token.
3. Retrieve available subscription plans.
4. Check the current subscription.
5. Generate an AI response.
6. View AI request history.
7. Generate an API key.
8. Test AI generation using the API key.
9. Check usage statistics.
10. Test admin endpoints using an administrator account.

## 🔮 Future Improvements

- Integrate real AI providers such as OpenAI or Gemini.
- Implement payment gateway integration.
- Add file upload and document processing.
- Add email verification and password reset.
- Build a frontend dashboard.
- Add team management for Enterprise subscriptions.
- Improve automated testing and API documentation.

## 👨‍💻 Author

**Muhammad Maaz Bin Aamir**

BS Computer Science Student | Backend Developer

### Technologies & Skills
Node.js · Express.js · MongoDB · Mongoose · JavaScript · REST APIs · JWT Authentication

---

⭐ If you find this project useful, consider giving the repository a star!
