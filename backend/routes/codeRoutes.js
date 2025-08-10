// backend/routes/codeRoutes.js
const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');

// Use PUT for updating an existing resource
router.put('/save-code/:roomId', codeController.saveCode);
router.get('/code/:roomId', codeController.getCode);

module.exports = router;