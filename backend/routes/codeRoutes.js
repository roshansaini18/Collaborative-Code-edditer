const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');

// NEW: Route to create a new room
router.post('/create-room', codeController.createRoom);

// NEW: Route to check if a room exists before joining
router.get('/check-room/:roomId', codeController.checkRoom);

// Existing routes
router.put('/save-code/:roomId', codeController.saveCode);
router.get('/code/:roomId', codeController.getCode);

module.exports = router;
