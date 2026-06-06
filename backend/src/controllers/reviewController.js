const Review = require("../models/Review");

const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;

        const existing = await Review.findOne({ product: productId, user: req.user._id });
        if (existing) {
            return res.status(400).json({ message: "You already reviewed this product" });
        }

        const review = await Review.create({
            product: productId,
            user: req.user._id,
            name: req.user.name,
            rating,
            comment
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addReview, getProductReviews };