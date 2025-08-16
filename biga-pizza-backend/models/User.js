// models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    tokenVersion: { type: Number, default: 0 },
    passwordChangedAt: { type: Date },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatarStyle: { type: String, default: 'kaleido' },
    avatarSeed: { type: String, default: 'BigaPizza' },

    // RESET PASSWORD
    // If you don’t want the reset fields to come back in queries by default,
    // add select: false to them in the schema:
    // resetPasswordTokenHash: { type: String, select: false },
    // resetPasswordExpiresAt: { type: Date, select: false },

    resetPasswordTokenHash: String,
    resetPasswordExpiresAt: Date,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password.trim(), salt);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare((entered ?? '').trim(), this.password);
};

// helper: create a reset token (plain) and store its hash+expiry
userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordTokenHash = hash;
  this.resetPasswordExpiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 min
  return token; // send this plain token to the user
};

const User = mongoose.model('User', userSchema);
export default User;
