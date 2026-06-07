import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import toast from 'react-hot-toast'; // ইম্পোর্ট লাইনটি নিশ্চিত করা হলো

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
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "All";
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/products")
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // নতুন আপডেটেড handleAddToCart ফাংশন
  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart! 🛒`); // টোস্ট নোটিফিকেশন যুক্ত করা হলো
    setAdded(prev => ({ ...prev, [product._id]: true }));
    setTimeout(() => {
      setAdded(prev => ({ ...prev, [product._id]: false }));
    }, 1500);
  };

  const filtered = products
    .filter(p => activeCategory === "All" || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const categories = ["All", "Electronics", "Fashion", "Laptops", "Mobiles", "Headphones", "Mouse", "Keyboard"];

  const categoryLabel = {
    "All": "🛍️ All",
    "Electronics": "⚡ Electronics",
    "Fashion": "👗 Fashion",
    "Laptops": "💻 Laptops",
    "Mobiles": "📱 Mobiles",
    "Headphones": "🎧 Headphones",
    "Mouse": "🖱️ Mouse",
    "Keyboard": "⌨️ Keyboard"
  };

  const categoryBadgeColor = {
    "Electronics": "bg-blue-600/90",
    "Fashion": "bg-pink-600/90",
    "Laptops": "bg-indigo-600/90",
    "Mobiles": "bg-purple-600/90",
    "Headphones": "bg-orange-600/90",
    "Mouse": "bg-green-600/90",
    "Keyboard": "bg-red-600/90"
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>

      {/* Header */}
      <div className="relative overflow-hidden py-16 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full filter blur-3xl"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 animate-fadeInUp">
            Our Products
          </h1>
          <p className="text-blue-100 text-lg mb-8 animate-fadeInUp delay-100">
            Discover premium products at unbeatable prices
          </p>
          <div className="flex justify-center animate-fadeInUp delay-200">
            <div className="flex items-center gap-3 px-5 py-4 rounded-full shadow-2xl w-full max-w-lg glass">
              <span className="text-xl">🔍</span>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none bg-transparent text-white placeholder-white/70 font-medium"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-white/70 hover:text-white">✕</button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter - horizontally scrollable */}
      <div className={`py-4 px-4 sticky top-16 z-40 ${darkMode ? "bg-gray-900/95" : "bg-gray-50/95"} backdrop-blur-md`}>
        <div className="flex gap-2 overflow-x-auto pb-1 max-w-7xl mx-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-bold text-xs whitespace-nowrap flex-shrink-0 transition-all duration-300 ${activeCategory === cat
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                : darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-white text-gray-600 hover:bg-gray-100 shadow-sm"
                }`}
            >
              {categoryLabel[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className={`text-xl font-semibold ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {filtered.map((product, i) => (
              <div
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
                className={`group rounded-2xl overflow-hidden card-hover cursor-pointer border ${darkMode
                  ? "bg-gray-800 border-gray-700 hover:border-blue-500"
                  : "bg-white border-gray-100 hover:border-blue-300"
                  }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="relative h-40 overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-5xl bg-gradient-to-br from-blue-100 to-indigo-100">
                      {getEmoji(product)}
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${categoryBadgeColor[product.category] || "bg-blue-600/90"}`}>
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-sm mb-1 line-clamp-1">{product.name}</h3>
                  <p className={`text-xs mb-3 line-clamp-2 leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-black text-base">${product.price}</span>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${added[product._id]
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90"
                        }`}
                    >
                      {added[product._id] ? "✓" : "+ Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;