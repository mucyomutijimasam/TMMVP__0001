const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/verifyToken');
const { streamAssistantReply } = require('../../services/assistant/streamController');

router.use(auth);

// GET /api/assistant/stream?sessionId=123
router.get('/stream', streamAssistantReply);

module.exports = router;
