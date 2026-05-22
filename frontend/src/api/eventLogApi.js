import api from './api';

export const getEventLogs = async (params = {}) => {
  const { data } = await api.get('/event-logs', { params });
  return data;
};

export const getEventLogById = async (eventLogId) => {
  const { data } = await api.get(`/event-logs/${eventLogId}`);
  return data;
};