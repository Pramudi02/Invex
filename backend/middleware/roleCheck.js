/**
 * Middleware to check if user has required role(s)
 * @param  {...string} allowedRoles - Roles that are allowed to access the route
 */
const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (should be set by authenticate middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        requiredRole: allowedRoles,
        yourRole: req.user.role
      });
    }

    next();
  };
};

/**
 * Middleware to check if user is ADMIN
 */
const isAdmin = roleCheck('admin');

/**
 * Middleware to check if user is ADMIN or STAFF
 */
const isAdminOrStaff = roleCheck('admin', 'staff');

module.exports = {
  roleCheck,
  isAdmin,
  isAdminOrStaff
};