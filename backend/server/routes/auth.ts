import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.ts";
import { authenticateToken } from "../middleware/auth.ts";
//import { mockDb } from "../config/mockDb.ts";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

const generateVoterId = () => {
  return "IV-" + Math.random().toString(36).substr(2, 6).toUpperCase();
};

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, aadhaarNumber } = req.body;
    const voterId = generateVoterId();

    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      return res.status(400).json({ message: "Valid 12-digit Aadhaar number is required." });
    }

    // if (mockDb.isUsingMockDb) {
    //   const existingUser = mockDb.users.find(u => u.email === email || u.aadhaarNumber === aadhaarNumber);
    //   if (existingUser) {
    //     return res.status(400).json({ message: "User with this email or Aadhaar number already exists." });
    //   }

    //   const hashedPassword = await bcrypt.hash(password, 10);
    //   const role = mockDb.users.length === 0 || email === "pranavverma889@gmail.com" ? "admin" : "user";
    //   const user = {
    //     _id: String(mockDb.users.length + 1),
    //     name,
    //     email,
    //     password: hashedPassword,
    //     voterId,
    //     aadhaarNumber,
    //     role,
    //     hasVoted: false,
    //    isVerified: true
    //   };
    //   mockDb.users.push(user);

    //   return res.status(201).json({
    //       message: "Signup successful! Your identity has been verified via Aadhaar.",
    //     user: { id: user._id, name: user.name, email: user.email, role: user.role, voterId: user.voterId, hasVoted: user.hasVoted, isVerified: user.isVerified }
    //   });
    // }

  const existingUser = await User.findOne({ $or: [{ email }, { aadhaarNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or Aadhaar number already exists." });
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const userCount = await User.countDocuments();
    const role = userCount === 0 || email === "pranavverma889@gmail.com" ? "admin" : "user";

    const user = new User({
      name,
      email,
      password: hashedPassword,
      voterId,
      aadhaarNumber,
      role,
      isVerified: true
    });
    await user.save();

    res.status(201).json({
      message: "Signup successful! Your identity has been verified via Aadhaar.",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, voterId: user.voterId, hasVoted: user.hasVoted, isVerified: user.isVerified }
    });
  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(500).json({ message: `Error creating user: ${err.message}` });
  }
});

// DigiLocker Auth URL
router.get("/digilocker/url", (req, res) => {
  const redirectUri = `${process.env.APP_URL || "http://localhost:3000"}/api/auth/digilocker/callback`;
  
  // Mock DigiLocker Auth URL
  const params = new URLSearchParams({
    client_id: process.env.DIGILOCKER_CLIENT_ID || "mock_client_id",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "read_profile",
    state: Math.random().toString(36).substring(7)
  });

  const authUrl = `https://accounts.digitallocker.gov.in/public/oauth2/1/authorize?${params.toString()}`;
  res.json({ url: authUrl });
});

// DigiLocker Callback
router.get("/digilocker/callback", async (req, res) => {
  const { code } = req.query;

  res.send(`
    <html>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc;">
        <div style="text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
          <h2 style="color: #ea580c;">DigiLocker Verified!</h2>
          <p style="color: #64748b;">Authentication successful. Closing window...</p>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'DIGILOCKER_AUTH_SUCCESS', 
                payload: { 
                  email: 'digilocker_user@example.com',
                  name: 'DigiLocker User',
                  digiLockerId: 'DL-' + Math.random().toString(36).substr(2, 8).toUpperCase()
                } 
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
        </div>
      </body>
    </html>
  `);
});


// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // if (mockDb.isUsingMockDb) {
    //   const user = mockDb.users.find(u => u.email === email);
    //   if (!user) return res.status(400).json({ message: "Invalid email or password." });

    //   const validPassword = await bcrypt.compare(password, user.password);
    //   if (!validPassword) return res.status(400).json({ message: "Invalid email or password." });

    //   const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
    //   return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, voterId: user.voterId, hasVoted: user.hasVoted, isVerified: user.isVerified } });
    // }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Invalid email or password." });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, voterId: user.voterId, hasVoted: user.hasVoted, isVerified: user.isVerified } });
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Get Me
router.get("/me", authenticateToken, async (req: any, res) => {
  try {
    // if (mockDb.isUsingMockDb) {
    //   const user = mockDb.users.find(u => u._id === req.user.id);
    //   if (!user) return res.status(404).json({ message: "User not found" });
    //   const { password, ...userWithoutPassword } = user;
    //   return res.json(userWithoutPassword);
    // }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const resetToken = Math.random().toString(36).substr(2, 12);
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // if (mockDb.isUsingMockDb) {
    //   const user = mockDb.users.find(u => u.email === email);
    //   if (!user) return res.status(404).json({ message: "User with this email not found." });

    //   user.resetPasswordToken = resetToken;
    //   user.resetPasswordExpires = expires; return res.json({ message: "Password reset token generated (Demo).", resetToken });
    // }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User with this email not found." });

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = expires;
    await user.save();

    res.json({ message: "Password reset token generated (Demo).", resetToken });
  } catch (err) {
    res.status(500).json({ message: "Error processing request" });
  }
});

// Reset Password
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // if (mockDb.isUsingMockDb) {
    //   const user = mockDb.users.find(u =>
    //     u.resetPasswordToken === token &&
    //     u.resetPasswordExpires > new Date()
    //   );
    //   if (!user) return res.status(400).json({ message: "Invalid or expired reset token." });

    //   user.password = await bcrypt.hash(password, 10);
    //   user.resetPasswordToken = undefined;
    //   user.resetPasswordExpires = undefined;
    //   return res.json({ message: "Password reset successful!" });
    // }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired reset token." });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password" });
  }
});

export default router;
