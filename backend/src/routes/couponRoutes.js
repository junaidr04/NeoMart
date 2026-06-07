const express = require("express");
const router = express.Router();
const { createCoupon, validateCoupon, getAllCoupons, deleteCoupon, toggleCoupon } = require("../controllers/couponController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.post("/validate", protect, validateCoupon);
router.post("/", protect, adminOnly, createCoupon);
router.get("/", protect, adminOnly, getAllCoupons);
router.delete("/:id", protect, adminOnly, deleteCoupon);
router.put("/:id/toggle", protect, adminOnly, toggleCoupon);

module.exports = router;