import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Home() {
    const { darkMode } = useTheme();

    return (
        <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900"></div>
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32">
                    <span className="bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full mb-6 backdrop-blur-sm">
                        🛍️ Welcome to the Future of Shopping
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                        Shop Smarter <br />
                        <span className="text-blue-200">Live Better</span>
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl max-w-xl mb-10">
                        Discover thousands of products at unbeatable prices. Fast delivery, easy returns.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            to="/products"
                            className="bg-white text-blue-700 font-bold px-8 py-4 rounded-full hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
                        >
                            Shop Now →
                        </Link>
                        <Link
                            to="/register"
                            className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all"
                        >
                            Join Free
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className={`py-20 px-6 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
                <h2 className="text-3xl font-bold text-center mb-12">Why Choose NeoMart?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {[
                        { icon: "🚀", title: "Fast Delivery", desc: "Get your orders delivered within 24 hours" },
                        { icon: "🔒", title: "Secure Payment", desc: "100% secure and encrypted transactions" },
                        { icon: "↩️", title: "Easy Returns", desc: "30-day hassle-free return policy" },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className={`p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-all ${darkMode ? "bg-gray-700" : "bg-white"}`}
                        >
                            <div className="text-5xl mb-4">{item.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                            <p className={`${darkMode ? "text-gray-300" : "text-gray-500"}`}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-6 text-center text-white">
                <h2 className="text-4xl font-extrabold mb-4">Ready to Start Shopping?</h2>
                <p className="text-blue-100 text-lg mb-8">Join thousands of happy customers today.</p>
                <Link
                    to="/register"
                    className="bg-white text-blue-700 font-bold px-10 py-4 rounded-full hover:bg-blue-50 transition-all shadow-lg"
                >
                    Get Started Free →
                </Link>
            </div>

        </div>
    );
}

export default Home;