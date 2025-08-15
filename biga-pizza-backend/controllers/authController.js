//authController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import cookieOptions from '../utils/cookieOptions.js';
import { generateToken } from '../utils/generateToken.js';

// REGISTER USER
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const user = new User({
      name,
      email,
      password,
    });

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
        avatarStyle: user.avatarStyle || 'kaleido',
        avatarSeed: user.avatarSeed || 'BigaPizza',
        tokenVersion: user.tokenVersion || 0,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // DEBUG: log incoming credentials (remove later!)
  console.log('[loginUser] Incoming login attempt:');
  console.log('  Email:', email);
  console.log('  Password (raw):', password);

  try {
    console.log('Login attempt with email:', email);

    // Load password + whatever you'll return
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    // ✅ now pass full user so token includes tokenVersion
    const token = generateToken(user);

    // set cookie (unchanged)
    res.cookie('token', token, cookieOptions);

    // ✅ keep your payload, add tokenVersion (handy on client)
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio || '',
        avatarStyle: user.avatarStyle || 'kaleido',
        avatarSeed: user.avatarSeed || 'BigaPizza',
        tokenVersion: user.tokenVersion || 0, // ✅
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// LOGOUT USER
// controllers/authController.js
const logoutUser = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production',
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// controllers/authController.js
const changePassword = async (req, res) => {
  try {
    console.log('[changePassword] Request body:', req.body);
    console.log('[changePassword] req.user:', req.user);

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both fields are required' });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: 'New password must be at least 8 characters' });
    }

    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log('[changePassword] Found user:', {
      id: user._id,
      email: user.email,
    });

    const ok = await bcrypt.compare(currentPassword, user.password);
    console.log('[changePassword] Current password match:', ok);

    if (!ok) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    user.tokenVersion = (user.tokenVersion || 0) + 1;
    user.passwordChangedAt = new Date();
    await user.save();

    console.log(
      '[changePassword] Password successfully updated for:',
      user.email
    );

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change Password Error:', err);
    return res.status(500).json({ message: 'Server error changing password' });
  }
};

export { register, loginUser, logoutUser, changePassword };
