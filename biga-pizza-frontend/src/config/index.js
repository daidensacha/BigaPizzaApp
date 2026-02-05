// src/config/index.js

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || '/api';

export const TIME_FORMAT = 'ddd, MMM D • h:mm A';

export const DEFAULT_AVATAR = '/images/default-avatar.png';

export const APP_NAME = 'Biga Pizza';

export const ENV = import.meta.env.MODE || 'development';
