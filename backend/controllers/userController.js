const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'your-super-secret-key';
const EMAIL_USER = 'ce220004038@iiti.ac.in';
const EMAIL_PASS = 'tqjq qzax mony kelb';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Step 1: Send OTP to email
 */
const sendOtp = async (req, res) => {
  const { email, userName } = req.body;
  console.log('Signup request for:', email);

  try {
    let user = await User.findOne({ email });

    // If already verified, stop signup
    if (user && user.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = generateOtp();

    if (!user) {
      user = new User({ email, userName, otp, isVerified: false });
    } else {
      user.otp = otp;
      user.isVerified = false;
    }
    await user.save();

    const mailOptions = {
      from: `"Collaborative Editor" <${EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Collaborative Editor',
      html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent successfully. Check your email.' });
  } catch (error) {
    console.error('Error in sendOtp:', error);
    res.status(500).json({ message: 'Server error during OTP request' });
  }
};

/**
 * Step 2: Verify OTP
 */
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log(`Verifying OTP for ${email}`);

  try {
    const user = await User.findOne({ email, otp, isVerified: false });
    if (!user) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

/**
 * Step 3: Set password after verification
 */
const setPassword = async (req, res) => {
  const { email, password } = req.body;
  console.log(`Setting password for ${email}`);

  try {
    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      return res.status(400).json({ message: 'User not found or not verified' });
    }

    // Password hashing handled by pre-save hook in User model
    user.password = password;
    await user.save();

    res.status(200).json({ message: 'Password set successfully. You can now sign in.' });
  } catch (error) {
    console.error('Error in setPassword:', error);
    res.status(500).json({ message: 'Server error during password setting' });
  }
};

/**
 * Step 4: Sign in
 */
const signIn = async (req, res) => {
  const { email, password } = req.body;
  console.log(`Signin request for ${email}`);

  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'Invalid email or account not verified' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Signed in successfully', token });
  } catch (error) {
    console.error('Error in signIn:', error);
    res.status(500).json({ message: 'Server error during sign-in' });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  setPassword,
  signIn,
};


