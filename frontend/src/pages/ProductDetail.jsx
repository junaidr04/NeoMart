import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api";

function StarRating({ rating, onRate, interactive = false }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(star => (
                <button
                    key={star}
                    onClick={() => interactive && onRate(star)}
                    onMouseEnter={() => interactive && setHover(star)}
                    onMouseLeave={() => interactive && setHover(0)}
                    className={`text-2xl transition-all ${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
                >
                    {star <= (hover || rating) ? "⭐" : "☆"}
                </button>
            ))}
        </div>
    );
}

function ProductDetail() {
    const { id } = useParams();
    const { darkMode } = useTheme();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState("");

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        api.get(`/products/${id}/reviews`)
            .then(res => setReviews(res.data));
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        setReviewError("");
        try {
            const res = await api.post(`/products/${id}/reviews`, { rating, comment });
            setReviews([res.data, ...reviews]);
            setComment("");
            setRating(5);
        } catch (err) {
            setReviewError(err.response?.data?.message || "Failed to submit review");
        }
        setReviewLoading(false);
    };

    const avgRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    if (loading) return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!product) return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50"}`}>
            <p className="text-gray-400 text-lg">Product not found.</p>
        </div>
    );

    return (
        <div className={`min-h-screen px-4 py-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="max-w-5xl mx-auto">

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className={`mb-6 flex items-center gap-2 font-semibold hover:text-blue-500 transition-colors ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                    ← Back
                </button>

                {/* Product Card */}
                <div className={`rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row mb-10 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <div className="md:w-1/2 h-72 md:h-auto overflow-hidden">
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="h-full flex items-center justify-center text-9xl bg-gradient-to-br from-blue-100 to-indigo-100">📦</div>
                        )}
                    </div>

                    <div className="md:w-1/2 p-8 flex flex-col justify-between">
                        <div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${product.category === "Electronics" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"
                                }`}>
                                {product.category}
                            </span>
                            <h1 className="text-3xl font-extrabold mt-4 mb-2">{product.name}</h1>

                            {/* Rating summary */}
                            <div className="flex items-center gap-2 mb-4">
                                <StarRating rating={Math.round(avgRating)} />
                                <span className="font-bold text-lg">{avgRating}</span>
                                <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>({reviews.length} reviews)</span>
                            </div>

                            <p className={`text-sm mb-6 leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {product.description}
                            </p>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl font-extrabold text-blue-600">${product.price}</span>
                                <span className={`text-sm font-semibold ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                                    {product.stock > 0 ? `✓ In Stock (${product.stock})` : "✗ Out of Stock"}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`w-full py-4 rounded-full font-bold text-lg transition-all ${added
                                    ? "bg-green-500 text-white"
                                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
                                }`}
                        >
                            {added ? "✓ Added to Cart!" : "Add to Cart 🛒"}
                        </button>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className={`rounded-3xl p-8 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg`}>
                    <h2 className="text-2xl font-black mb-6">Customer Reviews ⭐</h2>

                    {/* Add Review Form */}
                    {user ? (
                        <form onSubmit={handleReviewSubmit} className={`p-6 rounded-2xl mb-8 ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <h3 className="font-bold text-lg mb-4">Write a Review</h3>
                            {reviewError && <p className="text-red-500 text-sm mb-3">{reviewError}</p>}
                            <div className="mb-4">
                                <label className="text-sm font-semibold mb-2 block">Your Rating</label>
                                <StarRating rating={rating} onRate={setRating} interactive={true} />
                            </div>
                            <textarea
                                placeholder="Share your experience..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className={`w-full border-2 p-4 rounded-2xl focus:outline-none focus:border-blue-500 resize-none h-28 ${darkMode ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400" : "border-gray-200"
                                    }`}
                                required
                            />
                            <button
                                type="submit"
                                disabled={reviewLoading}
                                className="mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all"
                            >
                                {reviewLoading ? "Submitting..." : "Submit Review →"}
                            </button>
                        </form>
                    ) : (
                        <div className={`p-6 rounded-2xl mb-8 text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <p className={`mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Login to write a review</p>
                            <button onClick={() => navigate("/login")} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700">
                                Login →
                            </button>
                        </div>
                    )}

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                        <p className={`text-center py-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            No reviews yet. Be the first to review!
                        </p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {reviews.map(review => (
                                <div key={review._id} className={`p-5 rounded-2xl border ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold">{review.name}</p>
                                            <StarRating rating={review.rating} />
                                        </div>
                                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className={`text-sm mt-2 leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                                        {review.comment}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;