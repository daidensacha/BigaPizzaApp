import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en'; // import any locale(s) you want to support

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

// Detect user timezone
const userTimezone = dayjs.tz.guess();
dayjs.tz.setDefault(userTimezone);

// Optionally set locale dynamically (e.g., from browser)
const userLocale = navigator.language || 'en';
dayjs.locale(userLocale);

export default dayjs;

// Helpers you can import
export const toUtcIso = (localInput) =>
  // localInput like "YYYY-MM-DDTHH:mm" from <input type="datetime-local">
  dayjs(localInput).utc().toISOString();

export const utcIsoToLocalInput = (utcIso) =>
  // value for <input type="datetime-local"> (no seconds, no Z)
  dayjs.utc(utcIso).local().format('YYYY-MM-DDTHH:mm');

export const formatLocalLabel = (d) => {
  // Accepts Dayjs | string(ISO) | Date; returns pretty local label
  const dj = dayjs.isDayjs(d) ? d : dayjs.utc(d).local();
  return dj.format('ddd, MMM D • h:mm A');
};

export function getLocalDateTimePlus24h() {
  return dayjs().add(24, 'hour').format('YYYY-MM-DDTHH:mm');
}
