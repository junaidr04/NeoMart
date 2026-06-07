import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const { darkMode } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
        setLoading(false);
    };

    return (
        <div className={`min-h-screen flex ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>

            {/* Left side */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-900"></div>
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400 rounded-full filter blur-3xl animate-pulse-slow delay-300"></div>
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
                    <Link to="/" className="text-4xl font-black mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        NeoMart
                    </Link>
                    <h2 className="text-3xl font-black mb-4 text-center">Welcome Back!</h2>
                    <p className="text-blue-200 text-center text-lg leading-relaxed max-w-sm">
                        Sign in to access your orders, wishlist, and exclusive deals.
                    </p>
                    <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
                        {["🚀 Fast Delivery", "🔒 Secure Pay", "↩️ Easy Returns", "🎯 Best Prices"].map((item, i) => (
                            <div key={i} className="glass rounded-2xl p-4 text-center text-sm font-semibold">{item}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
                <div className="w-full max-w-md animate-fadeInUp">
                    <div className="lg:hidden text-center mb-8">
                        <Link to="/" className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            NeoMart
                        </Link>
                    </div>

                    <h1 className={`text-3xl font-black mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                        Sign In 👋
                    </h1>
                    <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 font-bold hover:underline">Register free</Link>
                    </p>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm font-semibold animate-fadeIn">
                            ⚠️ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className={`text-sm font-bold mb-2 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className={`w-full border-2 p-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 placeholder-gray-400"
                                    }`}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className={`text-sm font-bold mb-2 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    className={`w-full border-2 p-4 pr-12 rounded-2xl focus:outline-none focus:border-blue-500 transition-all font-medium ${darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "border-gray-200 placeholder-gray-400"
                                        }`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? "👁️" : "🙈"}
                                </button>
                            </div>
                        </div>

                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline font-semibold">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all hover:scale-105 mt-2 shadow-lg disabled:opacity-50 disabled:scale-100"
                        >
                            {loading ? "Signing in..." : "Sign In →"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;