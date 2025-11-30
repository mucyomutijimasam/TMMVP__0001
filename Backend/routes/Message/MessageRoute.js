const express = require('express');
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

router.use(auth);

// CREATE message
router.post('/:sessionId/messages', validate(messageSchema), sendMessage);

// GET all messages in session
router.get('/:sessionId/messages', getMessages);

// UPDATE message
router.put('/:sessionId/messages/:messageId', validate(messageSchema), updateMessage);

// DELETE message
router.delete('/:sessionId/messages/:messageId', deleteMessage);

module.exports = router;
