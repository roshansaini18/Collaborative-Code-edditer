const express = require('express');
const router = express.Router();
const { runCode } = require('../controllers/codeRunner');

// POST endpoint to handle code execution requests
router.post('/run-code', runCode);

module.exports = router;
