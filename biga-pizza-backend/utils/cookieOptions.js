const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // false in dev
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/', // ensure it's sent on all routes
};

export default cookieOptions;
