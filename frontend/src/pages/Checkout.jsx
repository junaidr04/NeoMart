import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ form, cartItems, totalPrice, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Create payment intent
            const { data } = await api.post("/payment/create-intent", { amount: totalPrice });

            // Confirm payment
            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: form.fullName,
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
                setLoading(false);
                return;
            }

            if (result.paymentIntent.status === "succeeded") {
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || "Payment failed!");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="p-4 border-2 border-gray-200 rounded-2xl bg-white">
                <CardElement options={{
                    style: {
                        base: {
                            fontSize: "16px",
                            color: "#1e293b",
                            "::placeholder": { color: "#94a3b8" }
                        }
                    }
                }} />
            </div>
            {error && <p className="text-red-500 text-sm font-semibold">⚠️ {error}</p>}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-700">
                <p className="font-bold mb-1">🧪 Test Card Details:</p>
                <p>Card: <span className="font-mono font-bold">4242 4242 4242 4242</span></p>
                <p>Expiry: <span className="font-mono font-bold">12/34</span> | CVC: <span className="font-mono font-bold">123</span></p>
            </div>
            <button
                type="submit"
                disabled={!stripe || loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-full font-black text-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-50"
            >
                {loading ? "Processing..." : `Pay $${totalPrice.toFixed(2)} →`}
            </button>
        </form>
    );
}

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
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!user) { navigate("/login"); return null; }
    if (cartItems.length === 0) { navigate("/cart"); return null; }

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handlePaymentSuccess = async () => {
        setLoading(true);
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
            setError("Order placement failed!");
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen px-6 py-12 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-black mb-4 text-center">Checkout 🛍️</h1>

                {/* Steps indicator */}
                <div className="flex justify-center gap-4 mb-10">
                    {["Shipping", "Payment"].map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${step > i + 1 ? "bg-green-500 text-white" :
                                    step === i + 1 ? "bg-blue-600 text-white" :
                                        darkMode ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-500"
                                }`}>
                                {step > i + 1 ? "✓" : i + 1}
                            </div>
                            <span className={`font-semibold text-sm ${step === i + 1 ? "text-blue-600" : darkMode ? "text-gray-400" : "text-gray-500"}`}>{s}</span>
                            {i === 0 && <span className={darkMode ? "text-gray-600" : "text-gray-300"}>→</span>}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left side */}
                    <div className={`p-8 rounded-3xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        {step === 1 ? (
                            <>
                                <h2 className="text-2xl font-black mb-6">Shipping Address</h2>
                                <form onSubmit={handleAddressSubmit} className="flex flex-col gap-4">
                                    {["fullName", "address", "city", "phone"].map((field) => (
                                        <div key={field}>
                                            <label className={`text-sm font-bold mb-2 block capitalize ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                                {field === "fullName" ? "Full Name" : field === "phone" ? "Phone Number" : field.charAt(0).toUpperCase() + field.slice(1)}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={field === "fullName" ? "John Doe" : field === "phone" ? "01XXXXXXXXX" : ""}
                                                value={form[field]}
                                                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                                                className={`w-full border-2 p-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "border-gray-200 placeholder-gray-400"}`}
                                                required
                                            />
                                        </div>
                                    ))}
                                    <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-full font-black text-lg hover:opacity-90 transition-all mt-2 shadow-lg">
                                        Continue to Payment →
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-black">Payment</h2>
                                    <button onClick={() => setStep(1)} className="text-blue-600 font-semibold text-sm hover:underline">← Edit Address</button>
                                </div>
                                {error && <p className="text-red-500 text-sm font-semibold mb-4">⚠️ {error}</p>}
                                <Elements stripe={stripePromise}>
                                    <CheckoutForm
                                        form={form}
                                        cartItems={cartItems}
                                        totalPrice={totalPrice}
                                        onSuccess={handlePaymentSuccess}
                                    />
                                </Elements>
                            </>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className={`p-8 rounded-3xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <h2 className="text-2xl font-black mb-6">Order Summary</h2>
                        <div className="flex flex-col gap-4 mb-6">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex items-center gap-4">
                                    {item.image && <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />}
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{item.name}</p>
                                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>x{item.quantity}</p>
                                    </div>
                                    <span className="font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className={`border-t pt-6 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Subtotal</span>
                                <span className="font-bold">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Delivery</span>
                                <span className="font-bold text-green-500">Free</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-black">Total</span>
                                <span className="text-2xl font-black text-blue-600">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;