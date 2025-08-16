// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import cookieOptions from '../utils/cookieOptions.js';
import { generateToken } from '../utils/generateToken.js';
import { sendEmail } from '../utils/emailService.js';

const normalizeEmail = (e) =>
  typeof e === 'string' ? e.trim().toLowerCase() : '';

export const register = async (req, res) => {
  try {
    const name = (req.body.name ?? '').trim();
    const email = normalizeEmail(req.body.email);
    const password = (req.body.password ?? '').trim();

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields required' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    await user.save();

    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio || '',
        avatarStyle: user.avatarStyle,
        avatarSeed: user.avatarSeed,
        tokenVersion: user.tokenVersion || 0,
      },
    });
  } catch (e) {
    console.error('Register Error:', e);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = (req.body.password ?? '').trim();

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio || '',
        avatarStyle: user.avatarStyle,
        avatarSeed: user.avatarSeed,
        tokenVersion: user.tokenVersion || 0,
      },
    });
  } catch (e) {
    console.error('Login Error:', e);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const changePassword = async (req, res) => {
  try {
    const currentPassword = (req.body.currentPassword ?? '').trim();
    const newPassword = (req.body.newPassword ?? '').trim();
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Both fields are required' });
    if (newPassword.length < 8)
      return res
        .status(400)
        .json({ message: 'New password must be at least 8 characters' });
    if (currentPassword === newPassword)
      return res.status(400).json({ message: 'New password must differ' });

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok)
      return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    user.passwordChangedAt = new Date();
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (e) {
    console.error('Change Password Error:', e);
    res.status(500).json({ message: 'Server error changing password' });
  }
};

// controllers/authController.js
// controllers/authController.js
export const requestPasswordReset = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ message: 'Email required' });

    const user = await User.findOne({ email });
    // Always respond OK to prevent user enumeration
    if (!user) {
      return res
        .status(200)
        .json({ message: 'If that account exists, an email has been sent.' });
    }

    // Generate a plain token and store its HASH + expiry on the user
    const token = user.createPasswordResetToken(); // <-- keep this name
    await user.save({ validateBeforeSave: false });

    // Build reset URL (support both env names)
    const baseUrl =
      process.env.FRONTEND_BASE_URL ||
      process.env.APP_BASE_URL ||
      'http://localhost:5173';

    // just before sendEmail(...)
    // const baseUrl = process.env.APP_BASE_URL || 'http://localhost:5173';
    const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(
      email
    )}`;

    console.log('[requestPasswordReset] resetUrl:', resetUrl);

    await sendEmail({
      to: email,
      subject: 'Reset your Biga Pizza password',
      html: `
    <p>We received a request to reset your password.</p>
    <p><a href="${resetUrl}">Click here to set a new password</a> (valid for 15 minutes).</p>
    <p>If you didn’t request this, you can safely ignore it.</p>
  `,
    });
    console.log('[requestPasswordReset] sendEmail() done for:', email);

    return res
      .status(200)
      .json({ message: 'If that account exists, an email has been sent.' });
  } catch (err) {
    console.error('[requestPasswordReset] Error:', err);
    return res
      .status(500)
      .json({ message: 'Server error requesting password reset' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const token = (req.body.token || '').trim();
    const newPassword = (req.body.newPassword || '').trim();

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password too short' });
    }

    // ✅ hash must match the model helper’s hashing
    const hash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      email,
      resetPasswordTokenHash: hash,
      resetPasswordExpiresAt: { $gt: new Date() },
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Token invalid or expired' });
    }

    user.password = newPassword; // pre-save hook will hash
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    user.passwordChangedAt = new Date();
    user.resetPasswordTokenHash = undefined; // clear reset fields
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: 'Password reset successful. Please log in.' });
  } catch (e) {
    console.error('[resetPassword]', e);
    return res.status(500).json({ message: 'Server error resetting password' });
  }
};

// // ★ NEW: request reset (sends email with token)
// export const requestPasswordReset = async (req, res) => {
//   try {
//     const email = normalizeEmail(req.body.email);
//     if (!email) return res.status(400).json({ message: 'Email required' });

//     const user = await User.findOne({ email });
//     // Always respond OK to avoid user enumeration
//     if (!user)
//       return res
//         .status(200)
//         .json({ message: 'If that account exists, an email has been sent.' });

//     const token = user.createPasswordResetToken();
//     await user.save({ validateBeforeSave: false });

//     const baseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
//     const resetUrl = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(
//       email
//     )}`;

//     await sendPasswordResetEmail({ to: email, resetUrl });
//     res
//       .status(200)
//       .json({ message: 'If that account exists, an email has been sent.' });
//   } catch (e) {
//     console.error('Request Reset Error:', e);
//     res.status(500).json({ message: 'Server error requesting password reset' });
//   }
// };

// // ★ NEW: perform reset with token
// export const resetPassword = async (req, res) => {
//   try {
//     const email = normalizeEmail(req.body.email);
//     const token = (req.body.token ?? '').trim();
//     const newPassword = (req.body.newPassword ?? '').trim();

//     if (!email || !token || !newPassword)
//       return res.status(400).json({ message: 'Missing fields' });
//     if (newPassword.length < 8)
//       return res.status(400).json({ message: 'Password too short' });

//     const hash = crypto.createHash('sha256').update(token).digest('hex');
//     const user = await User.findOne({
//       email,
//       resetPasswordTokenHash: hash,
//       resetPasswordExpiresAt: { $gt: new Date() },
//     }).select('+password');

//     if (!user)
//       return res.status(400).json({ message: 'Token invalid or expired' });

//     user.password = newPassword;
//     user.tokenVersion = (user.tokenVersion || 0) + 1;
//     user.passwordChangedAt = new Date();
//     user.resetPasswordTokenHash = undefined;
//     user.resetPasswordExpiresAt = undefined;
//     await user.save();

//     res
//       .status(200)
//       .json({ message: 'Password reset successful. Please log in.' });
//   } catch (e) {
//     console.error('Reset Password Error:', e);
//     res.status(500).json({ message: 'Server error resetting password' });
//   }
// };
