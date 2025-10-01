# 🚀 Quick Start Guide - Invex

This guide will help you get the Invex Inventory Management System up and running in minutes.

## Prerequisites Checklist

- [ ] Node.js v16+ installed
- [ ] MySQL installed and running
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## 5-Minute Setup

### Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/yourusername/invex.git
cd invex

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Database Setup (1 minute)

```bash
# Open MySQL command line or MySQL Workbench
mysql -u root -p

# Create database
CREATE DATABASE invex_db;
exit;
```

### Step 3: Configure Environment (1 minute)

Create `backend/.env` file:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=invex_db
DB_DIALECT=mysql
JWT_SECRET=your_secret_key_min_32_characters_long
PORT=5000
NODE_ENV=development
```

### Step 4: Seed Data & Run (1 minute)

```bash
# Terminal 1 - Backend
cd backend
npm run seed:admin    # Creates admin user
npm run seed:staff    # Creates staff user
npm run seed:items    # Creates sample inventory
npm start            # Start backend server

# Terminal 2 - Frontend
cd frontend
npm start            # Start frontend server
```

## 🎉 You're Ready!

Open your browser and visit:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api-docs

## Default Login Credentials

### Admin Access (Full permissions)
```
Username: admin
Password: admin123
```

### Staff Access (Limited permissions)
```
Username: staff
Password: staff123
```

## Quick Feature Test Checklist

### As Admin (admin/admin123)
- [ ] Login to dashboard
- [ ] View inventory items
- [ ] Create a new item
- [ ] Edit an item
- [ ] Delete an item
- [ ] Navigate to Users page
- [ ] Create a new user
- [ ] Edit user role
- [ ] Reset user password
- [ ] Delete a user

### As Staff (staff/staff123)
- [ ] Login to dashboard
- [ ] View inventory items
- [ ] Update item quantity
- [ ] Search for items
- [ ] Try to access Users page (should see "Access Denied")
- [ ] Try to create an item (should not see the button)

## Common Issues & Solutions

### Backend won't start
```bash
# Check if MySQL is running
mysql -u root -p

# Check if port 5000 is in use
netstat -ano | findstr :5000   # Windows
lsof -i :5000                   # Mac/Linux

# Re-install dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000   # Windows
lsof -i :3000                   # Mac/Linux

# Re-install dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Database connection error
1. Verify MySQL is running
2. Check credentials in `.env` file
3. Ensure database `invex_db` exists
4. Check MySQL user has proper permissions

### Can't login
1. Run seed scripts again:
   ```bash
   cd backend
   npm run seed:admin
   npm run seed:staff
   ```
2. Check browser console for errors
3. Verify backend is running on port 5000

## Development Mode

For development with auto-reload:

```bash
# Backend with nodemon
cd backend
npm run dev

# Frontend (already has hot reload)
cd frontend
npm start
```

## Project Structure Overview

```
Invex/
├── backend/           # Node.js + Express API
│   ├── config/       # Database & Swagger config
│   ├── controllers/  # Business logic
│   ├── middleware/   # Auth & authorization
│   ├── models/       # Sequelize models
│   ├── routes/       # API routes
│   └── utils/        # Helper functions & seeds
└── frontend/         # React application
    └── src/
        ├── components/  # Reusable components
        ├── context/     # Auth context
        ├── pages/       # Page components
        ├── services/    # API service
        └── theme/       # CSS styling
```

## Next Steps

1. **Explore the API**: Visit http://localhost:5000/api-docs
2. **Customize**: Modify colors in `frontend/src/theme/dark-theme.css`
3. **Add Features**: Extend models, controllers, and pages
4. **Deploy**: Follow deployment guides for your platform

## Useful Commands

```bash
# Backend
npm start              # Run production server
npm run dev           # Run with nodemon
npm run seed:admin    # Create admin user
npm run seed:staff    # Create staff user
npm run seed:items    # Seed inventory items

# Frontend
npm start             # Start dev server
npm run build         # Create production build
```

## Getting Help

- Check `README.md` for detailed documentation
- Review `CHANGELOG.md` for recent changes
- Check API documentation at http://localhost:5000/api-docs
- Review console logs for error messages

## Production Deployment Tips

1. **Environment Variables**: Use production values for JWT_SECRET and database
2. **Database**: Use managed MySQL service (AWS RDS, Azure Database, etc.)
3. **Frontend Build**: Run `npm run build` in frontend directory
4. **Backend**: Use PM2 or similar process manager
5. **Security**: Enable HTTPS, update CORS settings
6. **Environment**: Set `NODE_ENV=production`

---

**Happy Coding! 🎉**

For detailed documentation, see [README.md](README.md)
