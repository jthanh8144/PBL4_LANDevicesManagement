const express = require('express');
const router = express.Router();

const devicesController = require('../app/controllers/DevicesController');

router.get('/:slug', devicesController.detail);
router.get('/', devicesController.index);

module.exports = router;
