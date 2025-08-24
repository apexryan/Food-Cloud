/*const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Add this import at the very top of your authController.js file
const { sendPasswordResetEmail } = require('../services/emailServices');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });
    
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    
    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Request password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    console.log(`🔍 Password reset requested for: ${email}`);
    
    // Find user by email (dynamic - works for any registered user)
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log(`❌ User not found: ${email}`);
      return res.status(404).json({ 
        message: 'User with this email does not exist' 
      });
    }
    
    console.log(`✅ User found: ${user.name} (${user.email})`);
    
    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    
    // Save token to database
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpiry;
    await user.save();
    
    console.log('🔑 Reset token generated and saved to database');
    
    // Send email with user's name for personalization
    try {
      const emailResult = await sendPasswordResetEmail(
        user.email, 
        resetToken, 
        user.name
      );
      
      console.log(`📧 Email sent successfully to: ${user.email}`);
      
      res.status(200).json({ 
        message: 'Password reset email sent successfully. Please check your email.',
        details: {
          recipient: user.email,
          messageId: emailResult.messageId
        }
      });
      
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      
      // Clear the token since email failed
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      
      res.status(500).json({ 
        message: 'Failed to send password reset email. Please check your email configuration.',
        error: emailError.message
      });
    }
    
  } catch (err) {
    console.error('❌ Password reset error:', err);
    res.status(500).json({ 
      message: 'Internal server error during password reset',
      error: err.message 
    });
  }
};

// ✅ Reset password using token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password and clear reset token
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    res.status(200).json({ message: 'Password reset successful' });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Change password (for authenticated users)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // From JWT token
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash and save new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    
    res.status(200).json({ message: 'Password changed successfully' });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};*/

const User = require("../models/userModel");
const NGO = require("../models/ngoModel");
const Volunteer = require("../models/volunteerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../services/emailServices");

// For now, we'll handle admin login through a separate route
// Admin users will need to use the admin-specific login endpoint

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// User Registration
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    // Check if user already exists in any model
    let existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      existingUser = await NGO.findOne({ email: email.toLowerCase() });
    }
    if (!existingUser) {
      existingUser = await Volunteer.findOne({ email: email.toLowerCase() });
    }

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;

    // Create user based on userType
    if (userType === "ngo") {
      newUser = new NGO({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        organizationName: name,
      });
    } else if (userType === "volunteer") {
      newUser = new Volunteer({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
    } else {
      // Default to regular user
      newUser = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      });
    }

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, userType },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        userType,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

// User Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = null;
    let userType = "";

    // Search across all models
    user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      userType = "user";
    }

    if (!user) {
      user = await NGO.findOne({ email: email.toLowerCase() });
      if (user) {
        userType = "ngo";
      }
    }

    if (!user) {
      user = await Volunteer.findOne({ email: email.toLowerCase() });
      if (user) {
        userType = "volunteer";
      }
    }

    // Note: Admin login is handled through a separate endpoint
    // Admin users should use /api/admin/login instead

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Determine the role for the JWT token
    const userRole = user.role || "user";

    console.log(`🔐 Login successful for ${userType}:`, {
      email: user.email,
      userType: userType,
      role: userRole,
      userId: user._id,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        userType: userType,
        role: userRole,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name || user.organizationName,
        email: user.email,
        userType,
        role: user.role || "user",
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Change Password (for authenticated users)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;
    const userType = req.user.userType;

    let user = null;

    // Find user based on userType from token
    if (userType === "user") {
      user = await User.findById(userId);
    } else if (userType === "ngo") {
      user = await NGO.findById(userId);
    } else if (userType === "volunteer") {
      user = await Volunteer.findById(userId);
    }
    // Note: Admin password change is handled through admin-specific endpoints

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
      userType,
    });
  } catch (err) {
    console.error("Change password error:", err);
    res
      .status(500)
      .json({ message: "Failed to change password", error: err.message });
  }
};

// Dynamic password reset for ALL user types (User, NGO, Volunteer)
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    console.log(`🔍 Password reset requested for: ${email}`);

    let user = null;
    let userType = "";

    // Search across ALL models to find the user
    // Check User model first
    user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      userType = "user";
      console.log(`✅ Found in User model: ${user.name} (${user.email})`);
    }

    // If not found in User, check NGO model
    if (!user) {
      user = await NGO.findOne({ email: email.toLowerCase() });
      if (user) {
        userType = "ngo";
        console.log(
          `✅ Found in NGO model: ${user.name || user.organizationName} (${
            user.email
          })`
        );
      }
    }

    // If not found in NGO, check Volunteer model
    if (!user) {
      user = await Volunteer.findOne({ email: email.toLowerCase() });
      if (user) {
        userType = "volunteer";
        console.log(
          `✅ Found in Volunteer model: ${user.name} (${user.email})`
        );
      }
    }

    // If user not found in any model
    if (!user) {
      console.log(`❌ User not found in any model: ${email}`);
      return res.status(404).json({
        message: "User with this email does not exist",
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Save token to the appropriate model
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = resetTokenExpiry;
    await user.save();

    console.log(
      `🔑 Reset token generated and saved for ${userType}: ${user.email}`
    );

    // Send email via SendGrid with user's name and type
    try {
      const userName = user.name || user.organizationName || "User";
      const emailResult = await sendPasswordResetEmail(
        user.email,
        resetToken,
        userName,
        userType // Pass user type for personalized email
      );

      console.log(
        `📧 SendGrid email sent successfully to ${userType}: ${user.email}`
      );

      res.status(200).json({
        message:
          "Password reset email sent successfully. Please check your email.",
        details: {
          recipient: user.email,
          userType: userType,
          service: "SendGrid",
          messageId: emailResult.messageId,
        },
      });
    } catch (emailError) {
      console.error("❌ SendGrid email failed:", emailError.message);

      // Clear the token since email failed
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();

      res.status(500).json({
        message:
          "Failed to send password reset email. Please check email configuration.",
        error: emailError.message,
      });
    }
  } catch (err) {
    console.error("❌ Password reset error:", err);
    res.status(500).json({
      message: "Internal server error during password reset",
      error: err.message,
    });
  }
};

// Updated reset password function for multiple models
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    console.log(
      `🔍 Password reset attempt with token: ${token.substring(0, 8)}...`
    );

    let user = null;
    let userType = "";

    // Search for valid reset token across ALL models
    // Check User model
    user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (user) {
      userType = "user";
    }

    // Check NGO model if not found in User
    if (!user) {
      user = await NGO.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
      });
      if (user) {
        userType = "ngo";
      }
    }

    // Check Volunteer model if not found in NGO
    if (!user) {
      user = await Volunteer.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: Date.now() },
      });
      if (user) {
        userType = "volunteer";
      }
    }

    if (!user) {
      console.log("❌ Invalid or expired reset token");
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    console.log(`✅ Valid token found for ${userType}: ${user.email}`);

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    console.log(
      `🔐 Password successfully reset for ${userType}: ${user.email}`
    );

    res.status(200).json({
      message: "Password reset successful",
      userType: userType,
    });
  } catch (err) {
    console.error("❌ Password reset error:", err);
    res.status(500).json({ message: err.message });
  }
};
