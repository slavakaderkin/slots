({
  UNITS: ['', ' Kb', ' Mb', ' Gb', ' Tb', ' Pb', ' Eb', ' Zb', ' Yb'],

  bytesToSize(bytes) {
    if (bytes === 0) return '0';
    const exp = Math.floor(Math.log(bytes) / Math.log(1000));
    const size = bytes / 1000 ** exp;
    const short = Math.round(size, 2);
    const unit = this.UNITS[exp];
    return short + unit;
  },

  UNIT_SIZES: {
    yb: 24, // yottabyte
    zb: 21, // zettabyte
    eb: 18, // exabyte
    pb: 15, // petabyte
    tb: 12, // terabyte
    gb: 9, // gigabyte
    mb: 6, // megabyte
    kb: 3, // kilobyte
  },

  sizeToBytes(size) {
    if (typeof size === 'number') return size;
    const [num, unit] = size.toLowerCase().split(' ');
    const exp = this.UNIT_SIZES[unit];
    const value = parseInt(num, 10);
    if (!exp) return value;
    return value * 10 ** exp;
  },

  encodeRef(str) {
    return Buffer.from(String(str).split('').reverse().join('')).toString('base64').replace(/=*$/, '');
  },

  decodeRef(encodedStr) {
    if (!encodedStr) return null;

    while (encodedStr.length % 4) {
      encodedStr += '=';
    }
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*?(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

    if (!base64Regex.test(encodedStr)) {
      return null;
    }
    try {
      const decodedStr = Buffer.from(encodedStr, 'base64').toString();
      if (decodedStr.includes('\ufffd')) return null;
      return decodedStr.split('').reverse().join('');
    } catch (e) {
      return null;
    }
  },
  
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

  toHumanDate: (datetime, timezone, lng = 'en') => {
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

  isoToCron: (isoString, includeSeconds = true) => {
    const date = new Date(isoString);
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid ISO date string');
    }
    
    const seconds = date.getSeconds();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Месяцы с 1
    const dayOfWeek = '?'; // Не указываем день недели для конкретных дат
    
    if (includeSeconds) {
      return `${seconds} ${minutes} ${hours} ${day} ${month} *`;
    } else {
      return `${minutes} ${hours} ${day} ${month} *`;
    }
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
  },

  setSpecificTime: (isoString, hours = 9, minutes = 0, timezone = 'UTC') => {
    const date = new Date(isoString);
    
    if (timezone === 'UTC') {
      date.setUTCHours(hours, minutes, 0, 0);
    } else {
      const localDateStr = date.toLocaleString('en-US', { timeZone: timezone });
      const localDate = new Date(localDateStr);
      localDate.setHours(hours, minutes, 0, 0);
      return localDate.toISOString();
    }
    
    return date.toISOString();
  },

  getTimeInfo: (datetimeISO, timezone) => {
    const date = new Date(datetimeISO);
    
    const userTime = date.toLocaleString('en-US', { 
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const [datePart, timePart] = userTime.split(', ');
    const [hours, minutes] = timePart.split(':').map(Number);
    
    const isNight = hours >= 23 || hours < 9;
    
    return {
      isNight,
      userTime: `${datePart} ${timePart}`,
      hours,
      minutes,
      timezone
    };
  }
});