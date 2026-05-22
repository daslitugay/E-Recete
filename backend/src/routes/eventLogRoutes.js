const express = require('express');

const {
  getEventLogs,
  getEventLogById,
} = require('../controllers/eventLogController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/', getEventLogs);
router.get('/:id', getEventLogById);

module.exports = router;