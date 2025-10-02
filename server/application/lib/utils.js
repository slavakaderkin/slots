({
  wait: async ({ delay }) => {
    return new Promise((resolve) => {
      setTimeout(resolve, delay, 'done');
    });
  },
  
  createCSV: (data) => {
    let csv = '';
    
    const headers = Object.keys(data[0]);
    csv += headers.join(',') + '\n';
    
    data.forEach(row => {
      const values = headers.map(header => {
        let value = row[header] || '';
        if (typeof value === 'string' && value.includes(',')) {
            value = `"${value}"`;
        }
        return value;
      });
      csv += values.join(',') + '\n';
    });
    
    return csv;
  },

  modTime: (iso, val, unit = 'mm') => {
    const date = !iso ? new Date() : new Date(iso);
    if (isNaN(date)) throw new Error('Invalid ISO string');
    
    const operations = {
      mm: d => d.setMinutes(d.getMinutes() + val),
      h: d => d.setHours(d.getHours() + val),
      d: d => d.setDate(d.getDate() + val)
    };
    
    operations[unit]?.(date);
    return date.toISOString();
  },

  toHumanDate: (datetime, timezone, lng = 'ru') => {
    const date = new Date(datetime);
    
    return date.toLocaleString(lng, {
      timeZone: timezone,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      weekday: 'long'
    });
  },

  dateForPlanner: (isoDate, formatType = 'datetime') => {
    const dateObject = new Date(isoDate);
    const timezoneOffsetMillis = dateObject.getTimezoneOffset() * 60 * 1000;
    const adjustedDate = new Date(dateObject.getTime() - timezoneOffsetMillis);
    const [date, time] = adjustedDate.toISOString().slice(0, 16).split('T');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = adjustedDate.getDate();
    const month = monthNames[adjustedDate.getMonth()];
    const year = adjustedDate.getFullYear();

    const ordinal =
      day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
        ? 'rd'
        : 'th';

    const formats = {
      object: { date, time },
      datetime: `${year} ${month} ${day}${ordinal} ${time}`,
      date: `${year} ${month} ${day}${ordinal}`,
    };

    return formats[formatType];
  },

  getTime9AM: (datetime, userTimeZone) => {
    const date = new Date(datetime);
    
    const userDateStr = date.toLocaleDateString('en-CA', { 
      timeZone: userTimeZone 
    });
    
    const server9AM = new Date(`${userDateStr}T09:00:00`);
    const userOffsetMs = lib.utils.getTimezoneOffsetMs(userTimeZone);
    const serverTimeForUser9AM = new Date(server9AM.getTime() + userOffsetMs);
    
    return serverTimeForUser9AM;
  },
  
  getTimezoneOffsetMs: (timeZone, date = new Date()) => {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone }));
    return utcDate.getTime() - tzDate.getTime();
  }
});