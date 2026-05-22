const dotenv = require('dotenv');

const connectDB = require('../config/db');
const {
  closeRabbitMQ,
  consumePrescriptionCreated,
} = require('../config/rabbitmq');
const { EventLog, EVENT_LOG_STATUS } = require('../models/EventLog');

dotenv.config();

const handlePrescriptionCreated = async (event) => {
  const payload = event.payload || {};

  await EventLog.create({
    eventType: event.eventType,
    aggregateType: 'Prescription',
    aggregateId: payload.prescriptionId,
    actor: payload.actorId || payload.doctorId || null,
    status: EVENT_LOG_STATUS.PROCESSED,
    payload,
    processedAt: new Date(),
  });

  console.log(
    `Event logged: ${event.eventType} prescription=${payload.prescriptionId}`
  );
};

const startWorker = async () => {
  await connectDB();

  await consumePrescriptionCreated(handlePrescriptionCreated);

  console.log('Prescription worker started');
};

process.on('SIGINT', async () => {
  console.log('Prescription worker shutting down...');
  await closeRabbitMQ();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Prescription worker shutting down...');
  await closeRabbitMQ();
  process.exit(0);
});

startWorker().catch((error) => {
  console.error(`Prescription worker failed: ${error.message}`);
  process.exit(1);
});