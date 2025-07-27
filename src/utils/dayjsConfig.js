import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
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

// Detect user timezone
const userTimezone = dayjs.tz.guess();
dayjs.tz.setDefault(userTimezone);

// Optionally set locale dynamically (e.g., from browser)
const userLocale = navigator.language || 'en';
dayjs.locale(userLocale);

export default dayjs;
