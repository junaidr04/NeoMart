import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import axios from "axios";

function ProductDetail() {
    const { id } = useParams();
    const { darkMode } = useTheme();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/${id}`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    if (loading) return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
            <p className="text-blue-500 text-lg">Loading...</p>
        </div>
    );

    if (!product) return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50"}`}>
            <p className="text-gray-400 text-lg">Product not found.</p>
        </div>
    );

    return (
        <div className={`min-h-screen px-6 py-12 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="max-w-4xl mx-auto">

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className={`mb-8 flex items-center gap-2 font-semibold hover:text-blue-500 transition-colors ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                    ← Back
                </button>

                <div className={`rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row ${darkMode ? "bg-gray-800" : "bg-white"}`}>

                    {/* Image */}
                    <div className="md:w-1/2 h-80 md:h-auto overflow-hidden">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className={`h-full flex items-center justify-center text-9xl ${product.category === "Electronics"
                                    ? "bg-gradient-to-br from-blue-100 to-indigo-100"
                                    : "bg-gradient-to-br from-pink-100 to-purple-100"
                                }`}>
                                📦
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="md:w-1/2 p-8 flex flex-col justify-between">
                        <div>
                            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${product.category === "Electronics"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-pink-100 text-pink-600"
                                }`}>
                                {product.category}
                            </span>
                            <h1 className="text-3xl font-extrabold mt-4 mb-3">{product.name}</h1>
                            <p className={`text-sm mb-6 leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {product.description}
                            </p>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl font-extrabold text-blue-600">${product.price}</span>
                                <span className={`text-sm ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                                    {product.stock > 0 ? `✓ In Stock (${product.stock})` : "✗ Out of Stock"}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`flex-1 py-4 rounded-full font-bold text-lg transition-all ${added
                                        ? "bg-green-500 text-white"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
                                    }`}
                            >
                                {added ? "✓ Added to Cart!" : "Add to Cart 🛒"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;