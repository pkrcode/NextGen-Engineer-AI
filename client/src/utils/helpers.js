// src/utils/helpers.js

const toDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') {
    return value.toDate();
  }
  if (value instanceof Date) return value;
  return new Date(value);
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  const jsDate = toDate(date);
  if (isNaN(jsDate)) return 'Invalid Date';
  return jsDate.toLocaleString();
};

export const wasYesterday = (timestamp) => {
  if (!timestamp) return false;
  const date = toDate(timestamp);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  date.setHours(0, 0, 0, 0);
  return date.getTime() === yesterday.getTime();
};

export const wasToday = (timestamp) => {
  if (!timestamp) return false;
  const date = toDate(timestamp);
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date.getTime() === today.getTime();
};
