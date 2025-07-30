import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (userId, userName) => {
  return jwt.sign({ id: userId, name: userName }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER USER
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // ✅ Generate JWT token
    const token = generateToken(user._id, user.name);

    // Send success response
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name },
      token,
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.name);

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name },
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export { register, loginUser };
