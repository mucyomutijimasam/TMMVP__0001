const express = require('express');
const router = express.Router();

const auth = require('../../Middleware/verifyToken');
const validate = require('../../Middleware/validate');

const updateSchema = require('../../Validation/messageUpdate.schema');
const paramsSchema = require('../../Validation/messageParams.schema');

const {
  getMessages,
  updateMessage,
  deleteMessage
} = require('../../Controllers/Message/MessageController');

router.use(auth);

// GET /api/sessions/:sessionId/messages
router.get(
  '/:sessionId/messages',
  validate(paramsSchema, 'params'),
  getMessages
);

// PUT /api/sessions/:sessionId/messages/:messageId
router.put(
  '/:sessionId/messages/:messageId',
  validate(paramsSchema, 'params'),
  validate(updateSchema),
  updateMessage
);

// DELETE /api/sessions/:sessionId/messages/:messageId
router.delete(
  '/:sessionId/messages/:messageId',
  validate(paramsSchema, 'params'),
  deleteMessage
);

module.exports = router;
