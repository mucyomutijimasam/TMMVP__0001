// routes/Message/MessageRoute.js

const express = require('express');
// We use { mergeParams: true } because we want this router to inherit the :sessionId 
// parameter if it were nested under '/:sessionId' path, but since we are moving the 
// POST routes, we can just use a standard router.
const router = express.Router(); 
const auth = require('../../Middleware/verifyToken');

const validate = require('../../Middleware/validate');
const messageSchema = require('../../Validation/MessageSchema');

const { 
  sendMessage, 
  getMessages, 
  updateMessage,
  deleteMessage
} = require('../../Controllers/Message/MessageController');

// All message routes require authentication
router.use(auth);

// --- NOTE: Removed the POST routes for clarity and moved them to sessionRoutes.js ---

// GET all messages in session
// Path will be /api/sessions/:sessionId/messages
router.get('/:sessionId/messages', getMessages);

// UPDATE message
// Path will be /api/sessions/:sessionId/messages/:messageId
router.put('/:sessionId/messages/:messageId', validate(messageSchema), updateMessage);

// DELETE message
// Path will be /api/sessions/:sessionId/messages/:messageId
router.delete('/:sessionId/messages/:messageId', deleteMessage);

module.exports = router;