const Coupon = require("../models/Coupon");

const createCoupon = async (req, res) => {
    try {
        const { code, discount, expiryDate } = req.body;
        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }
        const coupon = await Coupon.create({ code, discount, expiryDate });
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid coupon code" });
        }
        if (!coupon.isActive) {
            return res.status(400).json({ message: "Coupon is inactive" });
        }
        if (new Date() > new Date(coupon.expiryDate)) {
            return res.status(400).json({ message: "Coupon has expired" });
        }

        res.json({ discount: coupon.discount, message: `${coupon.discount}% discount applied! 🎉` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: "Coupon deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCoupon, validateCoupon, getAllCoupons, deleteCoupon, toggleCoupon };