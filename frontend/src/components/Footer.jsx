import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Footer() {
    const { darkMode } = useTheme();

    return (
        <footer className={`mt-20 py-12 px-8 ${darkMode ? "bg-gray-900 text-gray-300" : "bg-gray-900 text-gray-300"}`}>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-3">
                        NeoMart
                    </h2>
                    <p className="text-sm text-gray-400">
                        Your one-stop shop for Electronics and Fashion. Quality products at unbeatable prices.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
                        <li><Link to="/products" className="hover:text-blue-400 transition-colors">Products</Link></li>
                        <li><Link to="/cart" className="hover:text-blue-400 transition-colors">Cart</Link></li>
                        <li><Link to="/register" className="hover:text-blue-400 transition-colors">Register</Link></li>
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="text-white font-bold mb-4">Categories</h3>
                    <ul className="space-y-2 text-sm">
                        <li className="hover:text-blue-400 transition-colors cursor-pointer">⚡ Electronics</li>
                        <li className="hover:text-blue-400 transition-colors cursor-pointer">👗 Fashion</li>
                        <li className="hover:text-blue-400 transition-colors cursor-pointer">📱 Smartphones</li>
                        <li className="hover:text-blue-400 transition-colors cursor-pointer">💻 Laptops</li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-white font-bold mb-4">Contact</h3>
                    <ul className="space-y-2 text-sm">
                        <li>📧 support@neomart.com</li>
                        <li>📞 +1 (555) 123-4567</li>
                        <li>📍 Dhaka, Bangladesh</li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
                © 2026 NeoMart. All rights reserved. Made with ❤️ by Jack
            </div>
        </footer>
    );
}

export default Footer;