/**
 * 📅 Date/Time Conventions — BigaPizzaApp
 *
 * GOAL:
 *   Always store and transmit times in UTC.
 *   Always display and edit times in the user's local timezone.
 *
 * STORAGE (backend, DB, API payloads):
 *   - All date/times are ISO 8601 UTC strings (e.g., "2025-08-14T18:30:00Z")
 *   - No timezone offsets stored, Z-suffix means UTC.
 *
 * INPUTS (<input type="datetime-local">):
 *   - Controlled by strings in format "YYYY-MM-DDTHH:mm" (local time, no TZ).
 *   - When saving, convert to UTC ISO string via `toUtcIso(localInput)`.
 *   - When loading, convert UTC ISO to local input string via `utcIsoToLocalInput(utcIso)`.
 *
 * DAYJS HELPERS:
 *   - `toLocalDayjs(any)` → always returns a Dayjs object in local TZ.
 *   - `formatLocalLabel(any, fmt?)` → pretty label in local TZ for UI.
 *   - `toUtcIso(localInput)` → local input string → UTC ISO string.
 *   - `utcIsoToLocalInput(utcIso)` → UTC ISO string → local input string.
 *
 * RENDERING:
 *   - Any stored UTC time must be run through `formatLocalLabel()` before display.
 *   - Timelines, schedules, and previews should NEVER display raw UTC.
 *
 * WHY:
 *   - UTC storage avoids cross-timezone drift.
 *   - Local display makes times meaningful to the user.
 *   - This separation prevents "off-by-hours" bugs in scheduling.
 */
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/en';

// ── Plugins ───────────────────────────────────────────────────────────────────
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);

// ── Environment defaults (client-side) ───────────────────────────────────────
const userTz = dayjs.tz.guess();
dayjs.tz.setDefault(userTz); // show times in user’s tz by default
const userLocale = navigator?.language || 'en';
dayjs.locale(userLocale);

// ── Core helpers (canonical) ─────────────────────────────────────────────────

// Normalize any “time-ish” input (ISO, Date, number, Dayjs) to a *local* Dayjs
export const toLocalDayjs = (input) => {
  if (!input) return dayjs.invalid();
  if (dayjs.isDayjs(input)) return input; // assume already local
  if (typeof input === 'string') return dayjs.utc(input).local(); // ISO from DB -> local
  return dayjs(input); // Date or timestamp -> local
};

// Pretty label for UI (always local)
export const formatLocalLabel = (input, fmt = 'ddd, MMM D • h:mm A') => {
  const d = toLocalDayjs(input);
  return d.isValid() ? d.format(fmt) : '–';
};

// Convert local input (e.g., "YYYY-MM-DDTHH:mm" from <input type="datetime-local">)
// to a UTC ISO string for storage.
export const toUtcIso = (localInput) => dayjs(localInput).utc().toISOString();

// Convert a stored UTC ISO string to a value usable by <input type="datetime-local">
export const utcIsoToLocalInput = (utcIso) =>
  dayjs.utc(utcIso).local().format('YYYY-MM-DDTHH:mm');

// Convenience: one day ahead in local “datetime-local” format
export const getLocalDateTimePlus24h = () =>
  dayjs().add(24, 'hour').format('YYYY-MM-DDTHH:mm');

export default dayjs;
