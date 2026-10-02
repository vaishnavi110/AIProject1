const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * @desc    Place a new order
 * @route   POST /api/orders
 * @access  Private/Customer
 */
const createOrder = async (req, res, next) => {
  try {
    const { products, shippingAddress } = req.body;

    // Validate products array
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one product'
      });
    }

    // Validate shipping address
    if (!shippingAddress || typeof shippingAddress !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'All shipping fields are required'
      });
    }

    const { name, phone, address, city, pincode } = shippingAddress;

    if (!name || !phone || !address || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'All shipping fields are required'
      });
    }

    if (typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters'
      });
    }

    const cleanedPhone = phone.toString().trim().replace(/[\s-]/g, '');
    if (!/^\+?[0-9]{10,15}$/.test(cleanedPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number'
      });
    }

    if (typeof address !== 'string' || !address.trim() ||
        typeof city !== 'string' || !city.trim() ||
        typeof pincode.toString() !== 'string' || !pincode.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: 'All shipping fields are required'
      });
    }

    // Validate product IDs and quantities, calculate server-side total
    const orderItems = [];
    let totalAmount = 0;

    for (const item of products) {
      const productId = item.product || item._id;

      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid product ID'
        });
      }

      const quantity = Number(item.quantity);
      if (!quantity || isNaN(quantity) || quantity < 1 || !Number.isInteger(quantity)) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be at least 1'
        });
      }

      // Fetch live product from DB to ensure tamper-proof price and check current stock
      const dbProduct = await Product.findById(productId);

      if (!dbProduct) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${productId}`
        });
      }

      if (dbProduct.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for: ${dbProduct.name}`
        });
      }

      const itemTotal = dbProduct.price * quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        price: dbProduct.price,
        quantity,
        image: dbProduct.image
      });
    }

    // Atomic Stock Decrement with rollback support for concurrency safety
    const decrementedItems = [];

    for (const item of orderItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        // Rollback any already decremented products
        for (const rolledBack of decrementedItems) {
          await Product.findByIdAndUpdate(rolledBack.product, {
            $inc: { stock: rolledBack.quantity }
          });
        }

        return res.status(400).json({
          success: false,
          message: `Insufficient stock for: ${item.name}`
        });
      }

      decrementedItems.push(item);
    }

    // Round totalAmount to 2 decimal places
    const finalTotalAmount = Math.round(totalAmount * 100) / 100;

    // Create Order Document
    const order = await Order.create({
      user: req.user._id,
      products: orderItems,
      totalAmount: finalTotalAmount,
      shippingAddress: {
        name: name.trim(),
        phone: cleanedPhone,
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.toString().trim()
      },
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/orders/my-orders
 * @access  Private/Customer
 */
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders across all customers
 * @route   GET /api/admin/orders, GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/admin/orders/:id/status, PATCH /api/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // If order was not cancelled previously and is now being cancelled, restore stock
    if (order.status !== 'Cancelled' && status === 'Cancelled') {
      for (const item of order.products) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    order.status = status;
    await order.save();
    await order.populate('user', 'name email');

    res.status(200).json({
      success: true,
      data: order,
      message: `Order status updated to ${status}`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
};
