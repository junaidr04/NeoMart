import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ shippingAddress }) {
    const stripe = useStripe();
    const elements = useElements();
    const { darkMode } = useTheme();
    const { cartItems, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await api.post("/payment/create-payment-intent", {
                amount: totalPrice
            });

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            });

            if (result.error) {
                setError(result.error.message);
                setLoading(false);
                return;
            }

            if (result.paymentIntent.status === "succeeded") {
                const items = cartItems.map(item => ({
                    product: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                }));

                await api.post("/orders", {
                    items,
                    shippingAddress,
                    totalPrice,
                    isPaid: true,
                    paymentMethod: "Stripe"
                });

                clearCart();
                navigate("/order-success");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Payment failed!");
        }
        setLoading(false);
    };

    // আপনার নতুন cardStyle অবজেক্টটি এখানে আপডেট করা হয়েছে
    const cardStyle = {
        style: {
            base: {
                fontSize: "16px",
                color: darkMode ? "#fff" : "#1a1a1a",
                "::placeholder": { color: darkMode ? "#9ca3af" : "#6b7280" }
            }
        },
        hidePostalCode: true
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-semibold">
                    ⚠️ {error}
                </div>
            )}
            <div className={`border-2 p-4 rounded-2xl ${darkMode ? "border-gray-600 bg-gray-700" : "border-gray-200"}`}>
                <CardElement options={cardStyle} />
            </div>
            <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                🔒 Test card: 4242 4242 4242 4242 | Any future date | Any CVC
            </div>
            <button
                type="submit"
                disabled={!stripe || loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
                {loading ? "Processing..." : `Pay $${totalPrice.toFixed(2)} →`}
            </button>
        </form>
    );
}

function Payment() {
    const { darkMode } = useTheme();
    const { cartItems, totalPrice } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: "", address: "", city: "", phone: ""
    });
    const [step, setStep] = useState(1);

    if (!user) { navigate("/login"); return null; }
    if (cartItems.length === 0) { navigate("/cart"); return null; }

    return (
        <div className={`min-h-screen px-4 py-12 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-black mb-2 text-center">Checkout 🛍️</h1>

                {/* Steps indicator */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    <div className={`flex items-center gap-2 ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>1</div>
                        <span className="font-bold text-sm">Shipping</span>
                    </div>
                    <div className={`h-0.5 w-12 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                    <div className={`flex items-center gap-2 ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>2</div>
                        <span className="font-bold text-sm">Payment</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left side */}
                    <div className={`p-8 rounded-3xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        {step === 1 ? (
                            <>
                                <h2 className="text-2xl font-black mb-6">Shipping Address</h2>
                                <div className="flex flex-col gap-4">
                                    {["fullName", "address", "city", "phone"].map(field => (
                                        <input
                                            key={field}
                                            type="text"
                                            placeholder={field === "fullName" ? "Full Name" : field === "phone" ? "Phone Number" : field.charAt(0).toUpperCase() + field.slice(1)}
                                            value={form[field]}
                                            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                                            className={`border-2 p-4 rounded-2xl focus:outline-none focus:border-blue-500 font-medium ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "border-gray-200 placeholder-gray-400"}`}
                                            required
                                        />
                                    ))}
                                    <button
                                        onClick={() => {
                                            if (!form.fullName || !form.address || !form.city || !form.phone) return;
                                            setStep(2);
                                        }}
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all mt-2"
                                    >
                                        Continue to Payment →
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-black mb-6">Payment Details</h2>
                                <Elements stripe={stripePromise}>
                                    <CheckoutForm shippingAddress={form} />
                                </Elements>
                                <button
                                    onClick={() => setStep(1)}
                                    className={`mt-4 w-full py-3 rounded-2xl font-bold transition-all ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
                                >
                                    ← Back to Shipping
                                </button>
                            </>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className={`p-8 rounded-3xl shadow-lg h-fit ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <h2 className="text-xl font-black mb-6">Order Summary</h2>
                        <div className="flex flex-col gap-3 mb-6">
                            {cartItems.map(item => (
                                <div key={item._id} className="flex items-center gap-3">
                                    {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />}
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">{item.name}</p>
                                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>x{item.quantity}</p>
                                    </div>
                                    <span className="font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className={`border-t pt-4 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Subtotal</span>
                                <span className="font-bold">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Delivery</span>
                                <span className="font-bold text-green-500">Free</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-black text-lg">Total</span>
                                <span className="font-black text-xl text-blue-600">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;