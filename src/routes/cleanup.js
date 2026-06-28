const express = require('express');
const router = express.Router();
const cleanupController = require('../controllers/cleanupController');

router.post('/', cleanupController.runCleanup);

module.exports = router;
