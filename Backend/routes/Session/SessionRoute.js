// routes/sessionRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/verifyToken');
const validate = require('../../Middleware/validate');
const { endSessionSchema } = require('../../Validation/sessionSchemas');
const {
  startSession,
  endSession,
  getUserSessions,
  getSessionDetail,
  deleteSession
} = require('../../Controllers/Session/SessionController');

router.use(auth);

router.post('/', startSession); // start session
router.get('/', getUserSessions); // list sessions for user
router.get('/:sessionId', getSessionDetail);
router.patch('/:sessionId/end', validate(endSessionSchema), endSession);
router.delete('/:sessionId', deleteSession);

module.exports = router;


