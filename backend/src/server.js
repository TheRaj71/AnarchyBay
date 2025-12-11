// DEPENDENCIES
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

// Import utilities
import { logger } from './lib/logger.js';
import { initRedis, closeRedis } from './lib/redis.js';

// Import middleware
import { requestIdMiddleware } from './middleware/requestId.js';
import { httpLogger } from './middleware/httpLogger.js';
import { sanitizeInput } from './middleware/validation.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { rateLimiters } from './middleware/rateLimiter.js';

// Import routes
const { default: authRoutes } = await import('./routes/auth.route.js');
const { default: profileRoutes } = await import('./routes/profile.route.js');
const { default: productsRoutes } = await import('./routes/product.route.js');
const { default: fileRoutes } = await import('./routes/file.route.js');
const { default: purchaseRoutes } = await import('./routes/purchase.route.js');
const { default: discountRoutes } = await import('./routes/discount.route.js');
const { default: downloadRoutes } = await import('./routes/download.route.js');
const { default: licenseRoutes } = await import('./routes/license.route.js');
const { default: analyticsRoutes } = await import('./routes/analytics.route.js');
const { default: payoutRoutes } = await import('./routes/payout.route.js');
const { default: webhookRoutes } = await import('./routes/webhook.route.js');
const { default: adminRoutes } = await import('./routes/admin.route.js');
const { default: reviewRoutes } = await import('./routes/review.route.js');
const { default: wishlistRoutes } = await import('./routes/wishlist.route.js');
const { default: cartRoutes } = await import('./routes/cart.route.js');

const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';

const app = express();

// Initialize Redis connection
initRedis();

// Security middleware - helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Compression middleware for response compression
app.use(compression());

// CORS configuration
app.use(cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Request ID tracking - must be early in middleware chain
app.use(requestIdMiddleware);

// HTTP request/response logging
app.use(httpLogger);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization to prevent XSS
app.use(sanitizeInput);

// Health check endpoint (no rate limiting)
app.get('/health-check', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
});

// Webhook routes (no rate limiting, raw body for signature verification)
app.use('/api/webhooks', webhookRoutes);

// API routes with rate limiting
app.use('/api/auth', rateLimiters.auth, authRoutes);
app.use('/api/profile', rateLimiters.api, profileRoutes);
app.use('/api/products', rateLimiters.api, productsRoutes);
app.use('/api/files', rateLimiters.api, fileRoutes);
app.use('/api/purchases', rateLimiters.api, purchaseRoutes);
app.use('/api/discounts', rateLimiters.api, discountRoutes);
app.use('/api/downloads', rateLimiters.api, downloadRoutes);
app.use('/api/licenses', rateLimiters.api, licenseRoutes);
app.use('/api/analytics', rateLimiters.api, analyticsRoutes);
app.use('/api/payouts', rateLimiters.api, payoutRoutes);
app.use('/api/admin', rateLimiters.api, adminRoutes);
app.use('/api/reviews', rateLimiters.api, reviewRoutes);
app.use('/api/wishlist', rateLimiters.api, wishlistRoutes);
app.use('/api/cart', rateLimiters.api, cartRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
    logger.info(`Server listening on http://localhost:${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  logger.info(`${signal} received, starting graceful shutdown`);
  
  server.close(async () => {
    logger.info('HTTP server closed');
    
    // Close Redis connection
    await closeRedis();
    
    logger.info('All connections closed, exiting process');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));