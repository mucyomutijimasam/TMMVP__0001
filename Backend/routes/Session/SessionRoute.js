// routes/sessionRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/verifyToken');

// Import the message router for non-POST actions
const messageRoutes = require("../Message/MessageRoute");

const validate = require('../../Middleware/validate'); // <--- Must be imported here
const messageSchema = require('../../Validation/MessageSchema'); // <--- Must be imported here

const { sendMessage } = require('../../Controllers/Message/MessageController'); // <--- Import only sendMessage

const {
  createSession,
  getSessions,
  getSessionById,
  updateSession,
  endSession,
  deleteSession
} = require('../../Controllers/Session/SessionController');

// Apply auth middleware to all session routes
router.use(auth);

// --- SESSION ROUTES ---

// POST /api/sessions (Create a session explicitly)
router.post('/', createSession);

// GET /api/sessions (Get all user sessions)
router.get('/', getSessions);

// GET /api/sessions/:sessionId
router.get('/:sessionId', getSessionById);

// PUT /api/sessions/:sessionId
router.put('/:sessionId', updateSession);

// PATCH /api/sessions/:sessionId/end
router.patch('/:sessionId/end', endSession);

// DELETE /api/sessions/:sessionId
router.delete('/:sessionId', deleteSession);


// --- MESSAGE POST ROUTES (Handles Automatic Session Creation) ---

// 1. POST /api/sessions/messages 
// Used when sessionId is UNKNOWN (triggers automatic session creation/reuse in sendMessage)
router.post('/messages', validate(messageSchema), sendMessage);

// 2. POST /api/sessions/:sessionId/messages
// Used when sessionId IS KNOWN (triggers explicit session validation in sendMessage)
router.post('/:sessionId/messages', validate(messageSchema), sendMessage);


// --- NESTED MESSAGE ROUTES (GET, PUT, DELETE) ---

// Mount the remaining message routes from messageRoutes.js
// The paths defined in messageRoutes.js will be accessible under the /api/sessions/ base path.
// For example, messageRoutes.js's router.get('/:sessionId/messages', getMessages) becomes:
// /api/sessions/:sessionId/messages
router.use(messageRoutes);

module.exports = router;