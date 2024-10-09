const express = require('express');
const router = express.Router();

const controller = require('../controllers/task.controller');

router.get("/api/v1/tasks", controller.index);
router.get("/api/v1/tasks/detail/:id", controller.detail);

module.exports = router;