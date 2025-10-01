# Changelog

All notable changes to the Invex project are documented in this file.

## [1.0.0] - 2025-10-02

### 🎨 UI/UX Enhancements
- **Dark Theme Implementation**: Implemented comprehensive dark theme across all pages
  - Background color: `#080f25`
  - Card/panel color: `#101935`
  - Accent/button color: `#6c72ff`
- **Glass Morphism Design**: Added modern glass morphism effects with backdrop-filter blur
- **Icon System**: Replaced all emoji with professional icons from react-icons library
  - Added `Icons.js` component with centralized icon exports
  - Icons include: Users, Admin, Staff, Dashboard, Items, Edit, Delete, Key, Check, Times, Search, Warning
- **Consistent Styling**: Applied uniform styling across all pages:
  - Login page
  - Dashboard page
  - Items page
  - Users page
  - Navigation bar
  - Error pages (403, 404)

### 🐛 Bug Fixes
- **Password Reset Fix**: Fixed critical bug where passwords were being hashed twice
  - Issue: Password hashing occurred in both controller and model hook
  - Solution: Removed manual hashing from controllers, now handled by Sequelize `beforeUpdate` hook
  - Affected functions: `updateUserPassword()` and `updateMyPassword()`
  - Impact: Password reset and user password updates now work correctly

### 🧹 Code Cleanup
- **Removed Test/Debug Files**: Deleted unused test and debugging scripts
  - Backend: `testBothLogins.js`, `testPasswordReset.js`, `testStaffLogin.js`, `loginTestNative.js`
  - Backend: `checkPasswordForUser.js`, `fixStaffPassword.js`, `fixStaffRole.js`, `listUsers.js`
  - Frontend: `App.test.js`, `setupTests.js`, `logo.svg`
- **Organized Utilities**: Streamlined backend/utils directory to essential files only:
  - `generateToken.js` - JWT token generation
  - `hashPassword.js` - Password hashing utilities
  - `seedAdmin.js` - Admin user seeding
  - `seedStaff.js` - Staff user seeding
  - `seedItems.js` - Inventory item seeding

### 📚 Documentation
- **Comprehensive README**: Created detailed documentation including:
  - Project overview and features
  - Complete technology stack
  - Detailed project structure
  - Installation and setup instructions
  - API documentation with examples
  - Design system and color palette
  - Security features
  - User roles and permissions
  - Troubleshooting guide
- **API Documentation**: Swagger UI available at `/api-docs` with:
  - Interactive API testing
  - Request/response schemas
  - Authentication examples

### 🔐 Security & Authentication
- **Role-Based Access Control**: Properly implemented RBAC for Admin and Staff roles
- **JWT Authentication**: Secure token-based authentication system
- **Password Security**: bcrypt hashing with 10 salt rounds
- **Protected Routes**: Frontend and backend route protection

### 🎯 Features
- **User Management** (Admin only):
  - Create, edit, and delete users
  - Role assignment (Admin/Staff)
  - Password reset functionality
  - User activity tracking
- **Inventory Management**:
  - Full CRUD operations for items
  - Advanced search and filtering
  - Price range filters
  - Low stock warnings
  - Quantity updates (Staff can update quantities)
- **Dashboard**:
  - Role-specific permission displays
  - System statistics
  - Quick action cards

### 🛠️ Technical Improvements
- **Database**: Sequelize ORM with MySQL
- **API Structure**: RESTful API design with proper error handling
- **Code Organization**: Clean separation of concerns (MVC pattern)
- **Middleware**: Authentication and role-checking middleware
- **Error Handling**: Consistent error responses across API

### 📦 Dependencies
- **Frontend**:
  - React 19.1.1
  - React Router DOM 7.9.3
  - React Icons 5.5.0
  - Axios for API calls
- **Backend**:
  - Express 4.18.2
  - Sequelize 6.35.2
  - MySQL2 3.6.5
  - JWT (jsonwebtoken 9.0.2)
  - bcryptjs 2.4.3
  - Swagger documentation tools

### 🎨 Design System
- **Color Palette**:
  - Primary: `#6c72ff` (Vibrant purple)
  - Background: `#080f25` (Deep navy)
  - Surface: `#101935` (Dark blue)
  - Success: `#4ade80` (Green)
  - Danger: `#ff6b6b` (Red)
  - Warning: `#fbbf24` (Amber)
- **Typography**: Inter font family with proper hierarchy
- **Components**: Consistent border-radius, padding, and spacing

---

## Previous Versions

### Initial Development
- Basic CRUD functionality for inventory
- User authentication system
- MySQL database integration
- React frontend with routing
