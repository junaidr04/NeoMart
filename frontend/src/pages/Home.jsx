import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";

function Home() {
    const { darkMode } = useTheme();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 100);
    }, []);

    const features = [
        { icon: "🚀", title: "Fast Delivery", desc: "Get your orders delivered within 24 hours guaranteed" },
        { icon: "🔒", title: "Secure Payment", desc: "100% secure and encrypted transactions always" },
        { icon: "↩️", title: "Easy Returns", desc: "30-day hassle-free return policy, no questions asked" },
        { icon: "🎯", title: "Best Prices", desc: "Unbeatable prices on all premium products" },
    ];

    const stats = [
        { number: "10K+", label: "Happy Customers" },
        { number: "500+", label: "Products" },
        { number: "50+", label: "Brands" },
        { number: "24/7", label: "Support" },
    ];

    return (
        <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>

            {/* Hero Section */}
            <div className="relative overflow-hidden min-h-screen flex items-center">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-900"></div>
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full filter blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400 rounded-full filter blur-3xl animate-pulse-slow delay-300"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400 rounded-full filter blur-3xl animate-pulse-slow delay-500"></div>
                </div>

                <div className={`relative z-10 w-full max-w-6xl mx-auto px-6 py-20 ${visible ? "animate-fadeInUp" : "opacity-0"}`}>
                    <div className="flex flex-col items-center text-center">
                        <span className="glass text-white text-sm font-semibold px-6 py-2 rounded-full mb-8 animate-float">
                            ✨ Bangladesh's #1 Online Store
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-tight tracking-tight">
                            Shop
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                                Smarter.
                            </span>
                            <span className="block">Live Better.</span>
                        </h1>
                        <p className="text-blue-100 text-lg md:text-2xl max-w-2xl mb-12 leading-relaxed">
                            Discover thousands of premium products at unbeatable prices. Fast delivery, easy returns, amazing experience.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/products"
                                className="group bg-white text-blue-700 font-black px-10 py-5 rounded-full hover:bg-yellow-300 hover:text-blue-900 transition-all duration-300 shadow-2xl text-lg"
                            >
                                Shop Now →
                            </Link>
                            <Link
                                to="/register"
                                className="glass text-white font-bold px-10 py-5 rounded-full hover:bg-white/20 transition-all duration-300 text-lg border border-white/30"
                            >
                                Join Free ✨
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                        <div className="w-1 h-3 bg-white/70 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className={`py-16 px-6 ${darkMode ? "bg-gray-800" : "bg-blue-600"}`}>
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.number}</div>
                            <div className="text-blue-200 font-semibold">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features Section */}
            <div className={`py-24 px-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className={`text-4xl md:text-5xl font-black mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Why Choose <span className="gradient-text">NeoMart?</span>
                        </h2>
                        <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            We're committed to giving you the best shopping experience
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((item, i) => (
                            <div
                                key={i}
                                className={`p-8 rounded-3xl card-hover border ${darkMode
                                        ? "bg-gray-800 border-gray-700 hover:border-blue-500"
                                        : "bg-white border-gray-100 hover:border-blue-300"
                                    }`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="text-5xl mb-4 animate-float" style={{ animationDelay: `${i * 0.2}s` }}>{item.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className={`py-24 px-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className={`text-4xl md:text-5xl font-black mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                            Shop by Category
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link to="/products" className="group relative overflow-hidden rounded-3xl h-64 card-hover">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-700"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <span className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</span>
                                <h3 className="text-3xl font-black">Electronics</h3>
                                <p className="text-blue-200 mt-2">Phones, Laptops & More</p>
                            </div>
                        </Link>
                        <Link to="/products" className="group relative overflow-hidden rounded-3xl h-64 card-hover">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-700"></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                <span className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">👗</span>
                                <h3 className="text-3xl font-black">Fashion</h3>
                                <p className="text-pink-200 mt-2">Clothes, Shoes & More</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative overflow-hidden py-24 px-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700"></div>
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-300 rounded-full filter blur-3xl"></div>
                </div>
                <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
                    <h2 className="text-4xl md:text-6xl font-black mb-6">Ready to Start Shopping?</h2>
                    <p className="text-blue-100 text-xl mb-10">Join thousands of happy customers today. No credit card required.</p>
                    <Link
                        to="/register"
                        className="inline-block bg-white text-blue-700 font-black px-12 py-5 rounded-full hover:bg-yellow-300 hover:text-blue-900 transition-all duration-300 shadow-2xl text-xl"
                    >
                        Get Started Free →
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default Home;