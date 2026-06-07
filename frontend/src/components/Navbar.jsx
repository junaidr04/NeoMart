import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function Navbar() {
    const { darkMode, toggleDarkMode } = useTheme();
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const { wishlist } = useWishlist();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className={`px-6 py-4 sticky top-0 z-50 backdrop-blur-md shadow-sm ${darkMode ? "bg-gray-900/90 text-white" : "bg-white/90 text-gray-900"}`}>
            <div className="flex justify-between items-center max-w-7xl mx-auto">

                {/* Logo */}
                <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    NeoMart
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-4">
                    <Link to="/products" className={`font-semibold text-sm px-4 py-2 rounded-full transition-all ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
                        Products
                    </Link>

                    <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-all ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>
                        {darkMode ? "☀️" : "🌙"}
                    </button>

                    {/* Wishlist icon */}
                    <Link to="/wishlist" className="relative">
                        <span className="text-2xl">❤️</span>
                        {wishlist.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {wishlist.length}
                            </span>
                        )}
                    </Link>

                    {/* Cart icon */}
                    <Link to="/cart" className="relative">
                        <span className="text-2xl">🛒</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <>
                            <Link to="/my-orders" className={`font-semibold text-sm px-4 py-2 rounded-full transition-all ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
                                My Orders
                            </Link>
                            {user.role === "admin" && (
                                <Link to="/admin" className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-700 transition-all text-sm">
                                    Admin Panel
                                </Link>
                            )}
                            <span className={`font-semibold text-sm ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                                Hi, {user.name.split(" ")[0]} 👋
                            </span>
                            <Link to="/change-password" className={`font-semibold text-sm px-4 py-2 rounded-full transition-all ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
                                🔒 Password
                            </Link>
                            <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-600 transition-all text-sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`font-semibold px-4 py-2 rounded-full transition-all text-sm ${darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}>
                                Login
                            </Link>
                            <Link to="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:opacity-90 transition-all text-sm shadow-md">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile right side */}
                <div className="flex md:hidden items-center gap-3">
                    <button onClick={toggleDarkMode} className={`p-2 rounded-full transition-all ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        {darkMode ? "☀️" : "🌙"}
                    </button>
                    <Link to="/wishlist" className="relative">
                        <span className="text-xl">❤️</span>
                        {wishlist.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {wishlist.length}
                            </span>
                        )}
                    </Link>
                    <Link to="/cart" className="relative">
                        <span className="text-xl">🛒</span>
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`p-2 rounded-full transition-all ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className={`md:hidden mt-4 p-4 rounded-2xl flex flex-col gap-3 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                    <Link to="/products" onClick={() => setMenuOpen(false)} className={`font-semibold px-4 py-3 rounded-xl ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
                        🛍️ Products
                    </Link>
                    {user ? (
                        <>
                            <Link to="/my-orders" onClick={() => setMenuOpen(false)} className={`font-semibold px-4 py-3 rounded-xl ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
                                📦 My Orders
                            </Link>
                            <Link to="/change-password" onClick={() => setMenuOpen(false)} className={`font-semibold px-4 py-3 rounded-xl ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
                                🔒 Change Password
                            </Link>
                            <Link to="/wishlist" onClick={() => setMenuOpen(false)} className={`font-semibold px-4 py-3 rounded-xl ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}>
                                ❤️ Wishlist
                            </Link>
                            {user.role === "admin" && (
                                <Link to="/admin" onClick={() => setMenuOpen(false)} className="bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold text-center">
                                    🛠️ Admin Panel
                                </Link>
                            )}
                            <div className={`px-4 py-2 font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                                Hi, {user.name.split(" ")[0]} 👋
                            </div>
                            <button onClick={() => { logout(); setMenuOpen(false); }} className="bg-red-500 text-white px-4 py-3 rounded-xl font-semibold">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setMenuOpen(false)} className={`font-semibold px-4 py-3 rounded-xl ${darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}>
                                Login
                            </Link>
                            <Link to="/register" onClick={() => setMenuOpen(false)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl font-semibold text-center">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;