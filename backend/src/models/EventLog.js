const mongoose = require('mongoose');

const EVENT_LOG_STATUS = {
  PROCESSED: 'PROCESSED',
  FAILED: 'FAILED',
};

const eventLogSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    aggregateType: {
      type: String,
      required: true,
      index: true,
    },
    aggregateId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(EVENT_LOG_STATUS),
      default: EVENT_LOG_STATUS.PROCESSED,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    errorMessage: {
      type: String,
      default: '',
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  EventLog: mongoose.model('EventLog', eventLogSchema),
  EVENT_LOG_STATUS,
};