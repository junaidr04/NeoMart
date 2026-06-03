import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyOrders() {
    const { darkMode } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        axios.get("http://localhost:5000/api/orders/myorders", { withCredentials: true })
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user]);

    const statusColor = {
        pending: "bg-yellow-100 text-yellow-600",
        processing: "bg-blue-100 text-blue-600",
        shipped: "bg-purple-100 text-purple-600",
        delivered: "bg-green-100 text-green-600",
        cancelled: "bg-red-100 text-red-600"
    };

    return (
        <div className={`min-h-screen px-6 py-12 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-10 text-center">My Orders 📦</h1>

                {loading ? (
                    <p className="text-center text-blue-500">Loading...</p>
                ) : orders.length === 0 ? (
                    <div className="text-center">
                        <p className="text-gray-400 text-lg mb-6">No orders yet!</p>
                        <button
                            onClick={() => navigate("/products")}
                            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700"
                        >
                            Shop Now
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orders.map(order => (
                            <div
                                key={order._id}
                                className={`p-6 rounded-2xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            Order ID: {order._id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[order.status]}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-3 mb-4">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            {item.image && (
                                                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm">{item.name}</p>
                                                <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>x{item.quantity}</p>
                                            </div>
                                            <span className="font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className={`border-t pt-4 flex justify-between items-center ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                                    <div>
                                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            📍 {order.shippingAddress.city}
                                        </p>
                                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            📞 {order.shippingAddress.phone}
                                        </p>
                                    </div>
                                    <span className="text-xl font-extrabold text-blue-600">${order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;