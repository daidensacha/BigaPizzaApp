// loadEnv.js
import dotenvFlow from 'dotenv-flow';

dotenvFlow.config({
  // ensure we load from the backend project root
  path: process.cwd(),
  silent: true, // avoid noisy warnings
});

// Optional: quick debug if you still have trouble
if (!process.env.EMAIL_PROVIDER) {
  console.warn(
    '[env] EMAIL_PROVIDER is not set. Check you have a file named `.env.development` (exact name) in the BACKEND root.'
  );
}
