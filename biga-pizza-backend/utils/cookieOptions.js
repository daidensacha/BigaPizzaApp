const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict', // or "lax" if strict causes issues
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

export default cookieOptions;
