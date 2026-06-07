const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

// Create order
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, totalPrice } = req.body;

        const order = await Order.create({
            user: req.user._id,
            items,
            shippingAddress,
            totalPrice
        });

        // Send confirmation email
        const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">x${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join("");

        await sendEmail({
            to: req.user.email,
            subject: "✅ Order Confirmed - NeoMart",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🛒 NeoMart</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0;">Order Confirmation</p>
          </div>

          <h2 style="color: #1e293b;">Hi ${req.user.name}! 👋</h2>
          <p style="color: #64748b;">Your order has been placed successfully. Here's your order summary:</p>

          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">Order ID</p>
            <p style="margin: 5px 0 0; font-weight: bold; color: #1e293b;">#${order._id.toString().slice(-8).toUpperCase()}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f1f5f9;">
                <th style="padding: 12px; text-align: left; color: #64748b; font-size: 14px;">Product</th>
                <th style="padding: 12px; text-align: center; color: #64748b; font-size: 14px;">Qty</th>
                <th style="padding: 12px; text-align: right; color: #64748b; font-size: 14px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-size: 18px; font-weight: bold; color: #1e293b;">Total</span>
              <span style="font-size: 20px; font-weight: bold; color: #2563eb;">$${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px; color: #1e293b;">📍 Shipping Address</h3>
            <p style="margin: 0; color: #64748b;">${shippingAddress.fullName}</p>
            <p style="margin: 5px 0 0; color: #64748b;">${shippingAddress.address}, ${shippingAddress.city}</p>
            <p style="margin: 5px 0 0; color: #64748b;">📞 ${shippingAddress.phone}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://neo-mart-peach.vercel.app/my-orders" style="background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; padding: 14px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Track Your Order →
            </a>
          </div>

          <p style="color: #94a3b8; font-size: 13px; text-align: center; margin-top: 30px;">
            Thank you for shopping with NeoMart! ❤️<br/>
            If you have any questions, contact us at support@neomart.com
          </p>
        </div>
      `
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get my orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        ).populate("user", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Send status update email
        await sendEmail({
            to: order.user.email,
            subject: `📦 Order Update - ${req.body.status.toUpperCase()} - NeoMart`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb, #4f46e5); padding: 30px; border-radius: 16px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: white; margin: 0;">🛒 NeoMart</h1>
            <p style="color: #bfdbfe; margin: 10px 0 0;">Order Status Update</p>
          </div>
          <h2 style="color: #1e293b;">Hi ${order.user.name}! 👋</h2>
          <p style="color: #64748b;">Your order status has been updated.</p>
          <div style="background: #eff6ff; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #64748b;">Order #${order._id.toString().slice(-8).toUpperCase()}</p>
            <p style="margin: 10px 0 0; font-size: 24px; font-weight: bold; color: #2563eb;">${req.body.status.toUpperCase()} 🎉</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://neo-mart-peach.vercel.app/my-orders" style="background: linear-gradient(135deg, #2563eb, #4f46e5); color: white; padding: 14px 30px; border-radius: 50px; text-decoration: none; font-weight: bold;">
              View Order →
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 13px; text-align: center;">Thank you for shopping with NeoMart! ❤️</p>
        </div>
      `
        });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };