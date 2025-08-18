import bcrypt from 'bcrypt';
import User from '../models/User.js';

// GET /api/user/me
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

// PATCH /api/user/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatarStyle, avatarSeed } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (typeof name === 'string') user.name = name;
    if (typeof bio === 'string') user.bio = bio;
    if (typeof avatarStyle === 'string') user.avatarStyle = avatarStyle;
    if (typeof avatarSeed === 'string') user.avatarSeed = avatarSeed;

    await user.save();

    // return a safe view
    const safe = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio || '',
      avatarStyle: user.avatarStyle || 'kaleido',
      avatarSeed: user.avatarSeed || 'BigaPizza',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({ message: 'Profile updated', user: safe });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// POST /api/user/change-password (optional, if you haven’t already)
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid current password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('changePassword error:', err);
    res.status(500).json({ message: 'Server error changing password' });
  }
};
