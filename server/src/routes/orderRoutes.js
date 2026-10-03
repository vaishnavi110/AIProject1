const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin routes (accessible directly under /api/orders or mounted under /api/admin/orders)
router.get('/', protect, admin, getAllOrders);
router.patch('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
