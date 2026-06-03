import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
function Checkout() {
    const { darkMode } = useTheme();
    const { cartItems, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        address: "",
        city: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!user) {
        navigate("/login");
        return null;
    }

    if (cartItems.length === 0) {
        navigate("/cart");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const items = cartItems.map(item => ({
                product: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            }));

            await api.post("/orders", { items, shippingAddress: form, totalPrice });
            clearCart();
            navigate("/order-success");
        } catch (err) {
            setError(err.response?.data?.message || "Order failed!");
        }
        setLoading(false);
    };

    return (
        <div className={`min-h-screen px-6 py-12 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-10 text-center">Checkout 🛍️</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Shipping Form */}
                    <div className={`p-8 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={form.fullName}
                                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                className={`border p-3 rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Address"
                                value={form.address}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className={`border p-3 rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                                required
                            />
                            <input
                                type="text"
                                placeholder="City"
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                className={`border p-3 rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className={`border p-3 rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all mt-2"
                            >
                                {loading ? "Placing Order..." : "Place Order →"}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className={`p-8 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                        <div className="flex flex-col gap-4">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex items-center gap-4">
                                    {item.image && (
                                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                                    )}
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            x{item.quantity}
                                        </p>
                                    </div>
                                    <span className="font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className={`border-t mt-6 pt-6 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold">Total:</span>
                                <span className="text-2xl font-extrabold text-blue-600">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;