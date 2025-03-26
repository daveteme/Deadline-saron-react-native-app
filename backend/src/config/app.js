// Application configuration

const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  
  // Server
  port: process.env.PORT || 3001,
  
  // MongoDB
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/Immy Project',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'dev',
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};

module.exports = config;
