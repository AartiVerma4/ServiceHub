const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "servicehub_super_secret_jwt_key_2026";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "servicehub_super_secret_refresh_key_2026";

// Verify access token middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired access token." });
  }
};

// Role-based authorization middleware
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user?.role}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  authorizeRoles,
  JWT_SECRET,
  REFRESH_SECRET,
};
