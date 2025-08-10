const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, setPassword, signIn } = require('../controllers/userController');

// Step 1: Send OTP for sign-up
router.post('/signup', sendOtp);

// Step 2: Verify OTP
router.post('/verify-otp', verifyOtp);

// Step 3: Set password after OTP verification
router.post('/set-password', setPassword);

// Step 4: Sign in
router.post('/signin', signIn);

module.exports = router;
