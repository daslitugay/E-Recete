const amqp = require('amqplib');

let connection = null;
let channel = null;

const EXCHANGE_NAME = process.env.RABBITMQ_EXCHANGE || 'e_recete.events';

const EVENT_TYPES = {
  PRESCRIPTION_CREATED: 'PRESCRIPTION_CREATED',
};

const ROUTING_KEYS = {
  [EVENT_TYPES.PRESCRIPTION_CREATED]: 'prescription.created',
};

const QUEUES = {
  PRESCRIPTION_CREATED: 'prescription.created.queue',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectRabbitMQ = async () => {
  const rabbitUrl = process.env.RABBITMQ_URL;

  if (!rabbitUrl) {
    console.log('RabbitMQ disabled: RABBITMQ_URL is not defined');
    return null;
  }

  if (channel) {
    return channel;
  }

  const maxRetries = 10;
  const retryDelayMs = 3000;

  for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
    try {
      connection = await amqp.connect(rabbitUrl);
      channel = await connection.createChannel();

      await channel.assertExchange(EXCHANGE_NAME, 'topic', {
        durable: true,
      });

      await channel.assertQueue(QUEUES.PRESCRIPTION_CREATED, {
        durable: true,
      });

      await channel.bindQueue(
        QUEUES.PRESCRIPTION_CREATED,
        EXCHANGE_NAME,
        ROUTING_KEYS[EVENT_TYPES.PRESCRIPTION_CREATED]
      );

      connection.on('error', (error) => {
        console.error(`RabbitMQ connection error: ${error.message}`);
      });

      connection.on('close', () => {
        console.log('RabbitMQ connection closed');
        connection = null;
        channel = null;
      });

      console.log('RabbitMQ connected');

      return channel;
    } catch (error) {
      console.error(
        `RabbitMQ connection failed. Attempt ${attempt}/${maxRetries}: ${error.message}`
      );

      if (attempt < maxRetries) {
        await sleep(retryDelayMs);
      }
    }
  }

  console.error('RabbitMQ connection could not be established');
  return null;
};

const getRabbitChannel = () => {
  return channel;
};

const isRabbitReady = () => {
  return Boolean(channel);
};

const publishEvent = async (eventType, payload) => {
  const routingKey = ROUTING_KEYS[eventType];

  if (!routingKey) {
    console.error(`Unknown event type: ${eventType}`);
    return false;
  }

  let activeChannel = getRabbitChannel();

  if (!activeChannel) {
    activeChannel = await connectRabbitMQ();
  }

  if (!activeChannel) {
    return false;
  }

  const event = {
    eventType,
    payload,
    occurredAt: new Date().toISOString(),
  };

  activeChannel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(event)),
    {
      persistent: true,
      contentType: 'application/json',
    }
  );

  return true;
};

const consumePrescriptionCreated = async (handler) => {
  const activeChannel = await connectRabbitMQ();

  if (!activeChannel) {
    throw new Error('RabbitMQ channel is not available');
  }

  await activeChannel.consume(
    QUEUES.PRESCRIPTION_CREATED,
    async (message) => {
      if (!message) {
        return;
      }

      try {
        const event = JSON.parse(message.content.toString());

        await handler(event);

        activeChannel.ack(message);
      } catch (error) {
        console.error(`Worker message processing error: ${error.message}`);

        activeChannel.nack(message, false, false);
      }
    },
    {
      noAck: false,
    }
  );

  console.log(`Worker consuming queue: ${QUEUES.PRESCRIPTION_CREATED}`);
};

const closeRabbitMQ = async () => {
  try {
    if (channel) {
      await channel.close();
    }

    if (connection) {
      await connection.close();
    }
  } catch (error) {
    console.error(`RabbitMQ close error: ${error.message}`);
  } finally {
    channel = null;
    connection = null;
  }
};

module.exports = {
  EVENT_TYPES,
  connectRabbitMQ,
  publishEvent,
  consumePrescriptionCreated,
  closeRabbitMQ,
  isRabbitReady,
};