import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function OrderSuccess() {
    const { darkMode } = useTheme();

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className={`p-12 rounded-3xl shadow-xl text-center max-w-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <div className="text-8xl mb-6">🎉</div>
                <h1 className="text-3xl font-extrabold mb-3">Order Placed!</h1>
                <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Your order has been placed successfully. We'll deliver it soon!
                </p>
                <div className="flex flex-col gap-3">
                    <Link
                        to="/my-orders"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-full font-bold hover:opacity-90 transition-all"
                    >
                        View My Orders
                    </Link>
                    <Link
                        to="/products"
                        className={`py-3 rounded-full font-bold transition-all ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default OrderSuccess;