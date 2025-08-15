
const express = require('express');
const router = express.Router();
const { 
    sendOtp, 
    verifyOtp, 
    setPassword, 
    signIn,
    forgotPassword,
    verifyResetOtp,
    resetPassword
} = require('../controllers/userController');

// Step 1: Send OTP for sign-up
router.post('/signup', sendOtp);

// Step 2: Verify OTP
router.post('/verify-otp', verifyOtp);

// Step 3: Set password after OTP verification
router.post('/set-password', setPassword);

// Step 4: Sign in
router.post('/signin', signIn);

// --- Forgot Password Flow ---

// Step 1: Send OTP for password reset
router.post('/forgot-password', forgotPassword);

// Step 2: Verify the OTP for password reset
router.post('/verify-reset-otp', verifyResetOtp);

// Step 3: Reset the password after OTP verification
router.post('/reset-password', resetPassword);


module.exports = router;



