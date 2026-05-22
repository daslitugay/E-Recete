const asyncHandler = require('express-async-handler');

const { EventLog } = require('../models/EventLog');

const getEventLogs = asyncHandler(async (req, res) => {
  const {
    eventType,
    status,
    aggregateType,
    page = 1,
    limit = 20,
  } = req.query;

  const query = {};

  if (eventType) {
    query.eventType = eventType;
  }

  if (status) {
    query.status = status;
  }

  if (aggregateType) {
    query.aggregateType = aggregateType;
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const skip = (pageNumber - 1) * limitNumber;

  const [logs, total] = await Promise.all([
    EventLog.find(query)
      .populate('actor', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),
    EventLog.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: logs.length,
    total,
    page: pageNumber,
    pages: Math.ceil(total / limitNumber),
    logs,
  });
});

const getEventLogById = asyncHandler(async (req, res) => {
  const log = await EventLog.findById(req.params.id).populate(
    'actor',
    'name email role'
  );

  if (!log) {
    res.status(404);
    throw new Error('Event log not found');
  }

  res.status(200).json({
    success: true,
    log,
  });
});

module.exports = {
  getEventLogs,
  getEventLogById,
};