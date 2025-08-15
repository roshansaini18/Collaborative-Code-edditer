// const express = require('express');
// const router = express.Router();
// const { sendOtp, verifyOtp, setPassword, signIn } = require('../controllers/userController');

// // Step 1: Send OTP for sign-up
// router.post('/signup', sendOtp);

// // Step 2: Verify OTP
// router.post('/verify-otp', verifyOtp);

// // Step 3: Set password after OTP verification
// router.post('/set-password', setPassword);

// // Step 4: Sign in
// router.post('/signin', signIn);

// module.exports = router;


// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
    sendOtp, 
    verifyOtp, 
    setPassword, 
    signIn, 
    forgotPassword, 
    resetPassword 
} = require('../controllers/userController');

// === SIGN UP ROUTES ===
// Step 1: Send OTP for sign-up
router.post('/signup', sendOtp);
// Step 2: Verify OTP (used by both signup and forgot password)
router.post('/verify-otp', verifyOtp);
// Step 3: Set password after OTP verification
router.post('/set-password', setPassword);

// === SIGN IN ROUTE ===
router.post('/signin', signIn);

// === FORGOT PASSWORD ROUTES ===
// Step 1: Send OTP for password reset
router.post('/forgot-password', forgotPassword);
// Step 2: Set a new password after OTP verification
router.post('/reset-password', resetPassword);

module.exports = router;
