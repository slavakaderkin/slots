// utils/time.js (создайте этот файл)
import i18n from '../i18n';

export const formatDate = (date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  const week = date.toLocaleDateString(i18n.language, { weekday: 'long' });
  const day = date.toLocaleDateString(i18n.language, {
    day: 'numeric', 
    month: 'short',
  });

  if (isToday) return [i18n.t('common.today'), day];
  else if (isTomorrow) return [i18n.t('common.tomorrow'), day];
  else return [week, day];
};

export const getLocalTimeFromUTC = (utcDateString) => {
  const date = new Date(utcDateString);
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();
  
  const clientOffsetHours = -new Date().getTimezoneOffset() / 60;
  let localHours = utcHours + clientOffsetHours;
  if (localHours < 0) localHours += 24;
  if (localHours >= 24) localHours -= 24;
  
  return `${localHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`;
};

export const createUTCDateFromLocal = (localTime, selectedDate) => {
  const [localHours, localMinutes] = localTime.split(':').map(Number);

  const clientOffsetHours = -new Date().getTimezoneOffset() / 60;

  let utcHours = localHours - clientOffsetHours;
  if (utcHours < 0) utcHours += 24;
  if (utcHours >= 24) utcHours -= 24;
  
  const utcDate = new Date(Date.UTC(
    selectedDate.getUTCFullYear(),
    selectedDate.getUTCMonth(),
    selectedDate.getUTCDate(),
    utcHours,
    localMinutes,
    0
  ));
  
  return utcDate.toISOString();
};

export const getClientTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};