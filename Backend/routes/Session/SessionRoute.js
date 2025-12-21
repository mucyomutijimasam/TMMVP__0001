const express = require('express');
const router = express.Router();

const auth = require('../../Middleware/verifyToken');
const validate = require('../../Middleware/validate');

const messageSchema = require('../../Validation/messageCreate.Schema');

const { sendMessage } = require('../../Controllers/Message/MessageController');
const messageRoutes = require('../Message/MessageRoute');

const {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  endSession,
  deleteSession
} = require('../../Controllers/Session/SessionController');

router.use(auth);

// --- SESSION CRUD ---
router.post('/', createSession);
router.get('/', getSessions);
router.get('/:sessionId', getSessionById);
router.put('/:sessionId', updateSession);
router.patch('/:sessionId/end', endSession);
router.delete('/:sessionId', deleteSession);

// --- MESSAGE CREATION (AUTO SESSION LOGIC LIVES HERE) ---

// POST /api/sessions/messages
router.post('/messages', validate(messageSchema), sendMessage);

// POST /api/sessions/:sessionId/messages
router.post('/:sessionId/messages', validate(messageSchema), sendMessage);

// --- MESSAGE READ / UPDATE / DELETE ---
router.use(messageRoutes);

module.exports = router;
