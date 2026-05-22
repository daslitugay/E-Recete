const express = require('express');

const { isRedisReady } = require('../config/redis');
const { isRabbitReady } = require('../config/rabbitmq');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'E-Recete API is running',
    service: 'e-recete-backend',
    redis: isRedisReady() ? 'connected' : 'not_connected',
    rabbitmq: isRabbitReady() ? 'connected' : 'not_connected',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;