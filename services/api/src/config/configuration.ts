export default () => ({
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  apiUrl: process.env.API_URL || 'http://localhost:4000',

  database: {
    url: process.env.DATABASE_URL,
  },

  mongodb: {
    uri: process.env.MONGODB_URI,
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },

  elasticsearch: {
    url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'changeme',
  },

  jwt: {
    accessSecret:
      process.env.JWT_ACCESS_SECRET ||
      'diamond-factory-access-secret-change-in-production-min-32-chars',
    refreshSecret:
      process.env.JWT_REFRESH_SECRET ||
      'diamond-factory-refresh-secret-change-in-production-min-32-chars',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4000/auth/google/callback',
  },

  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },

  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'ap-south-1',
    s3Bucket: process.env.AWS_S3_BUCKET || 'diamondfactory-media',
    cloudfrontDomain: process.env.AWS_CLOUDFRONT_DOMAIN || 'cdn.diamondfactory.in',
    sesFromEmail: process.env.AWS_SES_FROM_EMAIL || 'noreply@diamondfactory.in',
    sesFromName: process.env.AWS_SES_FROM_NAME || 'Diamond Factory',
  },
});
