const Order = require("../models/Order");
const User = require("../models/User");

const sendEmail = require("../utils/sendEmail");

const formatOrderItems = (order) => {
    if (!order?.orderItems?.length) return "No items";

    return order.orderItems
        .map((item) => {
            const productName = item.productId?.name || "Product";
            return `<li style="padding:6px 0; border-bottom:1px solid #f0f0f0;">${productName} × ${item.quantity} <span style="float:right; color:#1f2937;">₹${item.price}</span></li>`;
        })
        .join("");
};

const buildOrderEmail = (order, eventType) => {
    const customerName = order.user?.name || "Customer";
    const orderId = order._id || "N/A";
    const total = order.totalPrice || 0;
    const paymentMethod = order.paymentMethod || "N/A";
    const statusText = order.status || "pending";

    let subject = "";
    let heading = "";
    let intro = "";
    let highlight = "";

    switch (eventType) {
        case "order-confirmed":
            subject = "Order confirmed - Abhishek Kirana Store";
            heading = "Order confirmed";
            intro = "Thank you for shopping with us. Your order has been received and is now being prepared.";
            highlight = `Order ID: <strong>${orderId}</strong><br />Payment Method: <strong>${paymentMethod}</strong><br />Total Amount: <strong>₹${total}</strong>`;
            break;
        case "payment-success":
            subject = "Payment successful - Abhishek Kirana Store";
            heading = "Payment successful";
            intro = "We have received your payment successfully and your order is now moving forward.";
            highlight = `Order ID: <strong>${orderId}</strong><br />Amount Paid: <strong>₹${total}</strong>`;
            break;
        case "order-cancelled":
            subject = "Order cancelled - Abhishek Kirana Store";
            heading = "Order cancelled";
            intro = "Your order has been cancelled as requested. We’re here if you need help.";
            highlight = `Order ID: <strong>${orderId}</strong><br />Cancelled Amount: <strong>₹${total}</strong>`;
            break;
        default:
            subject = `Order status updated - ${statusText}`;
            heading = "Order status updated";
            intro = `Your order status has been updated to <strong>${statusText}</strong>.`;
            highlight = `Order ID: <strong>${orderId}</strong><br />Current Status: <strong>${statusText}</strong>`;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; background:#f7f9fc; padding:24px; color:#111827;">
        <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">
          <div style="background:linear-gradient(135deg, #1f4f3d, #2e7d32); padding:24px 28px; color:#ffffff;">
            <h2 style="margin:0; font-size:24px;">Abhishek Kirana Store</h2>
            <p style="margin:6px 0 0; font-size:14px; opacity:0.95;">Fresh essentials, delivered with care</p>
          </div>
          <div style="padding:28px;">
            <h3 style="margin:0 0 10px; font-size:22px; color:#111827;">${heading}</h3>
            <p style="margin:0 0 14px; font-size:15px; line-height:1.6; color:#374151;">${intro}</p>
            <div style="background:#f8fafc; padding:14px 16px; border-radius:8px; margin-bottom:16px; font-size:14px; line-height:1.7; color:#111827;">
              ${highlight}
            </div>
            <div style="margin-bottom:12px; font-weight:600; color:#111827;">Order Items</div>
            <ul style="list-style:none; padding:0; margin:0 0 16px;">
              ${formatOrderItems(order)}
            </ul>
            <p style="margin:0; font-size:14px; color:#6b7280; line-height:1.6;">Thank you for choosing Abhishek Kirana Store. We appreciate your trust and look forward to serving you again.</p>
          </div>
          <div style="background:#f9fafb; padding:16px 28px; font-size:12px; color:#6b7280; text-align:center; border-top:1px solid #e5e7eb;">
            © 2026 Abhishek Kirana Store. All rights reserved.
          </div>
        </div>
      </div>
    `;

    return { subject, html };
};

const sendOrderEmail = async (order, eventType) => {
    if (!order?.user?.email) return;

    const { subject, html } = buildOrderEmail(order, eventType);
    await sendEmail(order.user.email, subject, html);
};

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

        const populatedOrder = await Order.findById(order._id).populate("user", "name email").populate("orderItems.productId", "name");
        await sendOrderEmail(populatedOrder, "order-confirmed");
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
        const order = await Order.findById(req.params.id).populate("user", "name email");

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const previousStatus = order.status;
        order.status = status;
        await order.save();

        if (previousStatus !== status) {
            try {
                if (status === "cancelled") {
                    await sendOrderEmail(order, "order-cancelled");
                } else {
                    await sendOrderEmail(order, "status-updated");
                }
            } catch (emailError) {
                console.error("Order status email failed:", emailError);
            }
        }

        res.json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

module.exports = {
    createOrder,
    myOrders,
    getOrders,
    updateOrderStatus
};