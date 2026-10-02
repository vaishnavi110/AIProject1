const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Dedicated admin orders routes
router.get('/', protect, admin, getAllOrders);
router.patch('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id', protect, admin, updateOrderStatus);
router.patch('/:id', protect, admin, updateOrderStatus);

module.exports = router;
