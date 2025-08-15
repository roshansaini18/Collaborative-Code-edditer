// const User = require('../models/User');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const bcrypt = require('bcryptjs');

// const JWT_SECRET = 'your-super-secret-key';
// const EMAIL_USER = 'ce220004038@iiti.ac.in';
// const EMAIL_PASS = 'tqjq qzax mony kelb';

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: EMAIL_USER,
//     pass: EMAIL_PASS,
//   },
// });

// // Generate a 6-digit OTP
// const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// /**
//  * Step 1: Send OTP to email
//  */
// const sendOtp = async (req, res) => {
//   const { email, userName } = req.body;
//   console.log('Signup request for:', email);

//   try {
//     let user = await User.findOne({ email });

//     // If already verified, stop signup
//     if (user && user.isVerified) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const otp = generateOtp();

//     if (!user) {
//       user = new User({ email, userName, otp, isVerified: false });
//     } else {
//       user.otp = otp;
//       user.isVerified = false;
//     }
//     await user.save();

//     const mailOptions = {
//       from: `"Collaborative Editor" <${EMAIL_USER}>`,
//       to: email,
//       subject: 'Your OTP for Collaborative Editor',
//       html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: 'OTP sent successfully. Check your email.' });
//   } catch (error) {
//     console.error('Error in sendOtp:', error);
//     res.status(500).json({ message: 'Server error during OTP request' });
//   }
// };

// /**
//  * Step 2: Verify OTP
//  */
// const verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;
//   console.log(`Verifying OTP for ${email}`);

//   try {
//     const user = await User.findOne({ email, otp, isVerified: false });
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid OTP' });
//     }

//     user.isVerified = true;
//     user.otp = undefined;
//     await user.save();

//     res.status(200).json({ message: 'OTP verified successfully' });
//   } catch (error) {
//     console.error('Error in verifyOtp:', error);
//     res.status(500).json({ message: 'Server error during OTP verification' });
//   }
// };

// /**
//  * Step 3: Set password after verification
//  */
// const setPassword = async (req, res) => {
//   const { email, password } = req.body;
//   console.log(`Setting password for ${email}`);

//   try {
//     const user = await User.findOne({ email, isVerified: true });
//     if (!user) {
//       return res.status(400).json({ message: 'User not found or not verified' });
//     }

//     // Password hashing handled by pre-save hook in User model
//     user.password = password;
//     await user.save();

//     res.status(200).json({ message: 'Password set successfully. You can now sign in.' });
//   } catch (error) {
//     console.error('Error in setPassword:', error);
//     res.status(500).json({ message: 'Server error during password setting' });
//   }
// };

// /**
//  * Step 4: Sign in
//  */
// const signIn = async (req, res) => {
//   const { email, password } = req.body;
//   console.log(`Signin request for ${email}`);

//   try {
//     const user = await User.findOne({ email });
//     if (!user || !user.isVerified) {
//       return res.status(400).json({ message: 'Invalid email or account not verified' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password || '');
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid email or password' });
//     }

//     const token = jwt.sign(
//       { userId: user._id, email: user.email },
//       JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     res.status(200).json({ message: 'Signed in successfully', token });
//   } catch (error) {
//     console.error('Error in signIn:', error);
//     res.status(500).json({ message: 'Server error during sign-in' });
//   }
// };

// module.exports = {
//   sendOtp,
//   verifyOtp,
//   setPassword,
//   signIn,
// };


// backend/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const JWT_SECRET = 'your-super-secret-key';
const EMAIL_USER = 'your-email@gmail.com'; // Replace with your email
const EMAIL_PASS = 'your-app-password';   // Replace with your Gmail App Password

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: `"CodeRoom" <${EMAIL_USER}>`,
        to: email,
        subject: 'Your One-Time Password (OTP)',
        html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    };
    await transporter.sendMail(mailOptions);
};

// SIGN UP FLOW
const sendOtp = async (req, res) => {
    const { email, userName } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user && user.isVerified) {
            return res.status(400).json({ message: 'User already exists with this email.' });
        }
        const otp = generateOtp();
        if (!user) {
            user = new User({ email, userName, otp, isVerified: false });
        } else {
            user.otp = otp;
            user.isVerified = false;
        }
        await user.save();
        await sendOtpEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully. Check your email.' });
    } catch (error) {
        console.error('Error in sendOtp:', error);
        res.status(500).json({ message: 'Server error during OTP request' });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email, otp });
        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }
        user.isVerified = true;
        user.otp = undefined; // Clear OTP after verification
        await user.save();
        res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (error) {
        console.error('Error in verifyOtp:', error);
        res.status(500).json({ message: 'Server error during OTP verification' });
    }
};

const setPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, isVerified: true });
        if (!user) {
            return res.status(400).json({ message: 'User not found or not verified.' });
        }
        user.password = password;
        await user.save();
        res.status(200).json({ message: 'Password set successfully. You can now sign in.' });
    } catch (error) {
        console.error('Error in setPassword:', error);
        res.status(500).json({ message: 'Server error during password setting' });
    }
};

// SIGN IN FLOW
const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !user.isVerified || !user.password) {
            return res.status(400).json({ message: 'Invalid credentials or account not fully set up.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Signed in successfully', token, avatar: user.avatar });
    } catch (error) {
        console.error('Error in signIn:', error);
        res.status(500).json({ message: 'Server error during sign-in' });
    }
};

// FORGOT PASSWORD FLOW
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email, isVerified: true });
        if (!user) {
            return res.status(404).json({ message: 'No verified user found with this email.' });
        }
        const otp = generateOtp();
        user.otp = otp; // Reuse the OTP field for password reset
        await user.save();
        await sendOtpEmail(email, otp);
        res.status(200).json({ message: 'Password reset OTP sent. Check your email.' });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Here we trust that the user has just been verified via OTP,
        // because the OTP is cleared upon verification.
        const user = await User.findOne({ email, isVerified: true });
        if (!user) {
            return res.status(400).json({ message: 'User not found or not verified.' });
        }
        user.password = password;
        await user.save();
        res.status(200).json({ message: 'Password has been reset successfully. You can now sign in.' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    sendOtp,
    verifyOtp,
    setPassword,
    signIn,
    forgotPassword,
    resetPassword,
};
