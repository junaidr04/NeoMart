import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
    const { darkMode, toggleDarkMode } = useTheme();
    const { user, logout } = useAuth();
    const { totalItems } = useCart();

    return (
        <nav className={`px-8 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md shadow-sm ${darkMode ? "bg-gray-900/90 text-white" : "bg-white/90 text-gray-900"}`}>

            {/* Logo */}
            <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                NeoMart
            </Link>

            {/* Middle links */}
            <Link
                to="/products"
                className={`font-semibold text-sm px-4 py-2 rounded-full transition-all ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}
            >
                Products
            </Link>

            {/* Right side */}
            <div className="flex gap-4 items-center">
                <button
                    onClick={toggleDarkMode}
                    className={`p-2 rounded-full transition-all ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
                >
                    {darkMode ? "☀️" : "🌙"}
                </button>

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
                        <Link
                            to="/my-orders"
                            className={`font-semibold text-sm px-4 py-2 rounded-full transition-all ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}
                        >
                            My Orders
                        </Link>
                        {user.role === "admin" && (
                            <Link
                                to="/admin"
                                className="bg-purple-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-700 transition-all text-sm"
                            >
                                Admin Panel
                            </Link>
                        )}
                        <span className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                            Hi, {user.name.split(" ")[0]} 👋
                        </span>
                        <button
                            onClick={logout}
                            className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-600 transition-all text-sm"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className={`font-semibold px-4 py-2 rounded-full transition-all text-sm ${darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"}`}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:opacity-90 transition-all text-sm shadow-md"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;