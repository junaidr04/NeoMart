import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
const categoryEmoji = {
    "Electronics": {
        "iPhone": "📱", "Samsung": "📱", "MacBook": "💻", "Dell": "💻",
        "AirPods": "🎧", "iPad": "📱", "Sony": "🎧", "Apple Watch": "⌚",
        "default": "🔌"
    },
    "Fashion": {
        "T-Shirt": "👕", "Dress": "👗", "Jeans": "👖", "Handbag": "👜",
        "Running Shoes": "👟", "Heels": "👠", "Shirt": "👔", "Jacket": "🧥",
        "default": "👗"
    }
};

function getEmoji(product) {
    const cat = categoryEmoji[product.category];
    if (!cat) return "📦";
    for (const key of Object.keys(cat)) {
        if (key !== "default" && product.name.includes(key)) return cat[key];
    }
    return cat["default"];
}

function Products() {
    const { darkMode } = useTheme();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState({});
    const [activeCategory, setActiveCategory] = useState("All");
    const [search, setSearch] = useState("");

    useEffect(() => {
        api.get("/products").then(res => {
            setProducts(res.data);
            setLoading(false);
        })
            .catch(() => setLoading(false));
    }, []);

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        addToCart(product);
        setAdded(prev => ({ ...prev, [product._id]: true }));
        setTimeout(() => {
            setAdded(prev => ({ ...prev, [product._id]: false }));
        }, 1500);
    };

    const filtered = products
        .filter(p => activeCategory === "All" || p.category === activeCategory)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    const categories = ["All", "Electronics", "Fashion"];

    return (
        <div className={`min-h-screen px-6 py-12 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <h1 className="text-4xl font-extrabold text-center mb-2">Our Products</h1>
            <p className={`text-center mb-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Find the best deals on top products
            </p>

            {/* Search Bar */}
            <div className="flex justify-center mb-6">
                <div className={`flex items-center gap-3 px-5 py-3 rounded-full shadow-md w-full max-w-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <span className="text-xl">🔍</span>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className={`flex-1 outline-none bg-transparent ${darkMode ? "text-white placeholder-gray-400" : "text-gray-700 placeholder-gray-400"}`}
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">✕</button>
                    )}
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex justify-center gap-3 mb-10">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-full font-semibold text-sm transition-all ${activeCategory === cat
                            ? "bg-blue-600 text-white shadow-lg"
                            : darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                            }`}
                    >
                        {cat === "All" ? "🛍️ All" : cat === "Electronics" ? "⚡ Electronics" : "👗 Fashion"}
                    </button>
                ))}
            </div>

            {loading ? (
                <p className="text-center text-blue-500 text-lg">Loading...</p>
            ) : filtered.length === 0 ? (
                <p className="text-center text-gray-400 text-lg">No products found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {filtered.map(product => (
                        <div
                            key={product._id}
                            onClick={() => navigate(`/products/${product._id}`)}
                            className={`rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer ${darkMode ? "bg-gray-800" : "bg-white"}`}
                        >
                            <div className="h-48 overflow-hidden">
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className={`h-full flex items-center justify-center text-7xl ${product.category === "Electronics"
                                        ? "bg-gradient-to-br from-blue-100 to-indigo-100"
                                        : "bg-gradient-to-br from-pink-100 to-purple-100"
                                        }`}>
                                        {getEmoji(product)}
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${product.category === "Electronics"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-pink-100 text-pink-600"
                                    }`}>
                                    {product.category}
                                </span>
                                <h3 className="font-bold text-lg mt-2 mb-1">{product.name}</h3>
                                <p className={`text-xs mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    {product.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-blue-600 font-extrabold text-xl">${product.price}</span>
                                    <button
                                        onClick={(e) => handleAddToCart(e, product)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${added[product._id]
                                            ? "bg-green-500 text-white"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                            }`}
                                    >
                                        {added[product._id] ? "✓ Added!" : "Add to Cart"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Products;