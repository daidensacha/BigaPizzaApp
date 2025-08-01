import dayjs from '@utils/dayjsConfig';

export function formatScheduleTime(time, format = 'ddd, MMM D • h:mm A') {
  return dayjs.isDayjs(time) ? time.format(format) : '–';
}

export function formatDateTime(date) {
  const pad = (n) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
