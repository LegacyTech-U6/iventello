//backend
const express = require('express');
const router = express.Router();
const WorkersController = require('../controller/workers.controller');
const authenticateUser = require('../middleware/AuthenticatedUser');
// Create

 router.use(authenticateUser)

router.post('/', WorkersController.createWorker);

// Get all
router.get('/', WorkersController.getAllWorkers);

// Get one
router.get('/:id', WorkersController.getWorkerById);

// Update
router.put('/:id', WorkersController.updateWorker);

// Delete
router.delete('/:id', WorkersController.deleteWorker);

module.exports = router;
