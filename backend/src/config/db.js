const mongoose = require('mongoose');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI is not defined in .env file');
    process.exit(1);
  }

  const maxRetries = Number(process.env.MONGO_RETRY_COUNT) || 10;
  const retryDelayMs = Number(process.env.MONGO_RETRY_DELAY_MS) || 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      const conn = await mongoose.connect(mongoUri);

      console.log(`MongoDB connected: ${conn.connection.host}`);

      return conn;
    } catch (error) {
      console.error(
        `MongoDB connection failed. Attempt ${attempt}/${maxRetries}: ${error.message}`
      );

      if (attempt < maxRetries) {
        await sleep(retryDelayMs);
      }
    }
  }

  console.error('MongoDB connection could not be established');
  process.exit(1);
};

module.exports = connectDB;