# Invex - Inventory Management System

A modern, full-stack inventory management system with role-based access control, built with React and Node.js. 

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin & Staff roles)
- Protected routes and API endpoints
- Session management

### 📦 Inventory Management
- Create, Read, Update, Delete (CRUD) operations for inventory items
- Real-time inventory tracking
- Low stock alerts and warnings
- Advanced filtering and search capabilities
- Price range filters

### 👥 User Management (Admin Only)
- User account creation and management
- Role assignment and modification
- Password reset functionality
- User activity tracking
- Secure user deletion

### 🎨 Modern UI/UX
- Dark theme with glass morphism effects
- Responsive design for all devices
- Intuitive navigation with React Router
- Real-time visual feedback
- Icon-based interface using React Icons

### 📚 API Documentation
- Interactive Swagger UI documentation
- Complete API endpoint reference
- Request/response examples
- Built-in API testing interface

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern UI library
- **React Router DOM 7.9.3** - Client-side routing
- **React Icons 5.5.0** - Icon library
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with glass morphism effects

### Backend
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web application framework
- **Sequelize 6.35.2** - ORM for database management
- **MySQL2** - Database driver
- **JWT (jsonwebtoken 9.0.2)** - Authentication tokens
- **bcryptjs 2.4.3** - Password hashing
- **Swagger** - API documentation

### Development Tools
- **Nodemon** - Auto-restart development server
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
Invex/
├── backend/
│   ├── config/
│   │   ├── database.js          # Database configuration
│   │   └── swagger.js            # Swagger/API documentation config
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── itemController.js    # Inventory item operations
│   │   └── userController.js    # User management operations
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── roleCheck.js         # Role-based authorization
│   ├── models/
│   │   ├── index.js             # Model exports
│   │   ├── Item.js              # Inventory item model
│   │   └── User.js              # User model
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   ├── itemRoutes.js        # Inventory endpoints
│   │   └── userRoutes.js        # User management endpoints
│   ├── utils/
│   │   ├── generateToken.js     # JWT token generation
│   │   ├── hashPassword.js      # Password hashing utilities
│   │   ├── seedAdmin.js         # Create admin user
│   │   ├── seedStaff.js         # Create staff user
│   │   └── seedItems.js         # Seed sample inventory
│   ├── .env                     # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                # Express server entry point
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Icons.js         # Icon component exports
│   │   │   └── Navbar.js        # Navigation bar component
│   │   ├── context/
│   │   │   └── AuthContext.js   # Authentication context
│   │   ├── pages/
│   │   │   ├── Dashboard.js     # User dashboard
│   │   │   ├── ErrorPages.js    # 403/404 error pages
│   │   │   ├── Forbidden.js     # Access denied page
│   │   │   ├── Items.js         # Inventory management
│   │   │   ├── Login.js         # Login page
│   │   │   ├── NotFound.js      # 404 page
│   │   │   └── Users.js         # User management (Admin)
│   │   ├── services/
│   │   │   └── api.js           # Axios instance & interceptors
│   │   ├── theme/
│   │   │   └── dark-theme.css   # Dark theme styles
│   │   ├── App.css              # Global app styles
│   │   ├── App.js               # Main app component
│   │   ├── index.css            # Base styles
│   │   ├── index.js             # React entry point
│   │   └── reportWebVitals.js   # Performance monitoring
│   ├── .gitignore
│   ├── package.json
│   └── README.md
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v5.7 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/invex.git
cd invex
```

2. **Setup Backend**

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=invex_db
DB_DIALECT=mysql

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Configuration
PORT=5000
NODE_ENV=development
```

3. **Setup Database**

Create the MySQL database:
```sql
CREATE DATABASE invex_db;
```

The application will automatically sync database tables on startup.

4. **Seed Initial Data** (Optional)

Create default admin user:
```bash
npm run seed:admin
```

Create default staff user:
```bash
npm run seed:staff
```

Seed sample inventory items:
```bash
npm run seed:items
```

5. **Setup Frontend**

```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start Backend Server**

```bash
cd backend
npm start          # Production mode
# or
npm run dev        # Development mode with nodemon
```

Backend will run on: `http://localhost:5000`
API Documentation: `http://localhost:5000/api-docs`

2. **Start Frontend Development Server**

```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:3000`

### Default User Credentials

After running the seed scripts:

**Admin Account:**
- Username: `admin`
- Password: `admin123`
- Access: Full system access

**Staff Account:**
- Username: `staff`
- Password: `staff123`
- Access: View items, update quantities only

## 📖 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User (Admin Only)
```http
POST /api/auth/register
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "username": "newuser",
  "password": "password123",
  "role": "staff"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  }
}
```

### User Management Endpoints (Admin Only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer <admin_token>
```

#### Update User Role
```http
PUT /api/users/:id/role
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "role": "admin"
}
```

#### Reset User Password
```http
PUT /api/users/:id/password
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "newPassword": "newpassword123"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

### Inventory Endpoints

#### Get All Items
```http
GET /api/items
Authorization: Bearer <token>
```

Query Parameters:
- `search` - Search by name or SKU
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter

#### Create Item (Admin Only)
```http
POST /api/items
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Product Name",
  "sku": "SKU123",
  "description": "Product description",
  "quantity": 100,
  "price": 29.99,
  "lowStockThreshold": 10
}
```

#### Update Item (Admin Only)
```http
PUT /api/items/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Updated Name",
  "quantity": 150,
  "price": 34.99
}
```

#### Delete Item (Admin Only)
```http
DELETE /api/items/:id
Authorization: Bearer <admin_token>
```

### Interactive API Documentation

Visit `http://localhost:5000/api-docs` for interactive Swagger UI documentation where you can:
- View all available endpoints
- See request/response schemas
- Test API calls directly from the browser
- View authentication requirements

## 🎨 Design System

### Color Palette

- **Background**: `#080f25` - Deep navy blue
- **Card/Panel**: `#101935` - Dark blue with glass effect
- **Accent/Primary**: `#6c72ff` - Vibrant purple
- **Text Primary**: `#ffffff` - Pure white
- **Text Muted**: `#8892a6` - Light gray
- **Success**: `#4ade80` - Green
- **Danger**: `#ff6b6b` - Red
- **Warning**: `#fbbf24` - Amber

### Glass Morphism Effect

The UI features a modern glass morphism design with:
- `backdrop-filter: blur(20px)` for frosted glass effect
- Semi-transparent backgrounds with rgba colors
- Subtle borders and shadows
- Smooth transitions and hover effects

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt (10 salt rounds)
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Separate permissions for Admin and Staff
- **Protected Routes**: Frontend route guards
- **API Middleware**: Backend endpoint protection
- **SQL Injection Prevention**: Sequelize ORM with parameterized queries
- **CORS Configuration**: Cross-origin request handling

## 👤 User Roles & Permissions

### Admin Role
✅ View all inventory items  
✅ Create new items  
✅ Update item details  
✅ Delete items  
✅ Manage users (create, edit, delete)  
✅ Reset user passwords  
✅ Assign user roles  
✅ Access all system features  

### Staff Role
✅ View all inventory items  
✅ Update item quantities  
✅ Search and filter items  
❌ Cannot create/delete items  
❌ Cannot manage users  
❌ Cannot access user management page  

## 🧪 Development

### Available Scripts

**Backend:**
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (auto-reload)
npm run seed:admin # Create admin user
npm run seed:staff # Create staff user
npm run seed:items # Seed inventory items
```

**Frontend:**
```bash
npm start          # Start development server
npm run build      # Create production build
npm test           # Run tests
```

### Environment Variables

Create a `.env` file in the backend directory with these variables:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=invex_db
DB_DIALECT=mysql

# JWT
JWT_SECRET=your_secret_key_min_32_characters_long

# Server
PORT=5000
NODE_ENV=development
```

## 🐛 Troubleshooting

### Backend won't start
- Ensure MySQL is running
- Check database credentials in `.env`
- Verify port 5000 is not in use
- Run `npm install` to ensure dependencies are installed

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check CORS configuration in `backend/server.js`
- Ensure API base URL in `frontend/src/services/api.js` is correct

### Database sync issues
- Delete and recreate the database
- Check Sequelize model definitions
- Review server.js sync configuration

### Login issues
- Verify user exists (run seed scripts)
- Check password format (min 6 characters)
- Review JWT_SECRET in `.env`
- Check browser console and network tab

## 📝 License

ISC License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please open an issue in the repository.

---

**Built with ❤️ using React and Node.js**