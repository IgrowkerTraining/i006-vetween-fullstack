const cors = require('cors');
const bodyParser = require('body-parser');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://backend-vetween.onrender.com',
  // Add production frontend URL here when deployed
];

const setupMiddleware = (app) => {
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }));
  app.use(bodyParser.json());
  
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
};

module.exports = { setupMiddleware };
