import { useTheme } from "../context/ThemeContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

function Wishlist() {
    const { darkMode } = useTheme();
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    return (
        <div className={`min-h-screen px-4 py-12 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-black mb-2">Wishlist ❤️</h1>
                <p className={`mb-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}
                </p>

                {wishlist.length === 0 ? (
                    <div className={`text-center py-20 rounded-3xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <p className="text-7xl mb-6">❤️</p>
                        <h2 className="text-2xl font-black mb-3">Your wishlist is empty!</h2>
                        <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Save products you love for later</p>
                        <Link to="/products" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all">
                            Browse Products →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {wishlist.map(product => (
                            <div
                                key={product._id}
                                className={`rounded-2xl overflow-hidden border card-hover ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                            >
                                <div className="relative h-40 overflow-hidden cursor-pointer" onClick={() => navigate(`/products/${product._id}`)}>
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-5xl bg-gradient-to-br from-blue-100 to-indigo-100">📦</div>
                                    )}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); removeFromWishlist(product._id); }}
                                        className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-all font-bold text-sm"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-sm mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-blue-600 font-black text-base mb-3">${product.price}</p>
                                    <button
                                        onClick={() => { addToCart(product); removeFromWishlist(product._id); }}
                                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-full text-xs font-bold hover:opacity-90 transition-all"
                                    >
                                        Move to Cart 🛒
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Wishlist;