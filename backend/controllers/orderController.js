const Order = require("../models/Order");

const sendEmail = require("../utils/SendEmail");

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
    const { orderItems, totalPrice, address, paymentMethod } = req.body;
    if (!orderItems || orderItems.length === 0 || !totalPrice || !address) {
        return res.status(400).json({ message: "Invalid order data" });
    } 
    else {
        const order = new Order({
            user: req.user._id,
            orderItems,
            totalPrice,
            address, 
            paymentMethod,   
        });
        await order.save();
        const message = `Dear ${req.user.name},\n\nThank you for your order! Your order has been successfully placed.\n\nOrder Details:\nOrder ID: ${order._id}\nTotal Price: $${order.totalPrice}\n\nWe will notify you once your order is shipped.\n\nBest regards,\nAbhishek Kirana Store`;

        await sendEmail(req.user.email, "Order Confirmation", message);
        res.status(201).json({ message: "Order created successfully", order });
    }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const myOrders = async (req, res) => {
    try {
       const orders = await Order.find({ user: req.user._id }).populate(`orderItems.productId`, `name price`);
       res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrders = async (req, res) =>{
     try {
        const orders = await Order.find().populate(`user`, `id name`);
        res.status(200).json({ orders });
     } catch (error) {
        res.status(500).json({ message: error.message });
     }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);
        if(order) {
            order.status = status;
            await order.save();
            res.json({ message: 'Order status updated', order});
        } else {
            res.status(404).json({ message: 'Order not found'});
        }
    } catch (error) {
        res.status(500).json({ message : 'Error updating order status', error});
    }
};

module.exports = {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus
};