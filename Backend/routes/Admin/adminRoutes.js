const express = require('express');
const router = express.Router();

const auth = require('../../Middleware/verifyToken');
const validate = require('../../Middleware/validate');

const { resetDatabase } = require('../../Controllers/Admin/resetController');

// Simple Joi schema inline (no reuse needed)
const Joi = require('joi');
const resetSchema = Joi.object({
  confirm: Joi.string().valid('RESET_DATABASE').required()
});

// POST /api/admin/reset-db
router.post(
  '/reset-db',
  auth,
  validate(resetSchema),
  resetDatabase
);

module.exports = router;
