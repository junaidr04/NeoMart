const express = require("express");
const router = express.Router();
const { addReview, getProductReviews } = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.post("/:id/reviews", protect, addReview);
router.get("/:id/reviews", getProductReviews);

module.exports = router;