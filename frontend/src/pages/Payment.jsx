import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ shippingAddress, finalAmount, paymentMethod, setPaymentMethod, setShowSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const { darkMode } = useTheme();
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // bKash or Nagad Payment Logic
            if (paymentMethod === "bkash" || paymentMethod === "nagad") {
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
                    totalPrice: finalAmount, // কুপন ডিসকাউন্ট সহ ফাইনাল অ্যামাউন্ট পাঠানো হচ্ছে
                    isPaid: true,
                    paymentMethod: paymentMethod === "bkash" ? "bKash" : "Nagad"
                });

                clearCart();
                setShowSuccess(true);
                setTimeout(() => navigate("/order-success"), 2000);
                return;
            }

            // Stripe Card Payment Logic
            const { data } = await api.post("/payment/create-payment-intent", {
                amount: finalAmount
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
                    totalPrice: finalAmount,
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

            {/* Payment Method Selector */}
            <div className="flex flex-col gap-3 mb-4">
                <label className={`text-sm font-bold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: "card", label: "💳 Card", color: "from-blue-500 to-indigo-600" },
                        { id: "bkash", label: "🟣 bKash", color: "from-pink-500 to-pink-700" },
                        { id: "nagad", label: "🟠 Nagad", color: "from-orange-500 to-orange-700" },
                    ].map(method => (
                        <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id)}
                            className={`py-3 px-2 rounded-2xl font-bold text-sm transition-all ${paymentMethod === method.id
                                    ? `bg-gradient-to-r ${method.color} text-white shadow-lg scale-105`
                                    : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                        >
                            {method.label}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm font-semibold">
                    ⚠️ {error}
                </div>
            )}

            {/* Render Card Input only if paymentMethod is Card */}
            {paymentMethod === "card" ? (
                <>
                    <div className={`border-2 p-4 rounded-2xl ${darkMode ? "border-gray-600 bg-gray-700" : "border-gray-200"}`}>
                        <CardElement options={cardStyle} />
                    </div>
                    <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        🔒 Test card: 4242 4242 4242 4242 | Any future date | Any CVC
                    </div>
                </>
            ) : (
                <div className={`p-4 rounded-2xl border-2 text-center border-dashed font-semibold text-sm ${darkMode ? "border-gray-600 text-gray-400" : "border-gray-300 text-gray-600"}`}>
                    You will process payment via {paymentMethod === "bkash" ? "bKash 🟣" : "Nagad 🟠"} instantly.
                </div>
            )}

            <button
                type="submit"
                disabled={(paymentMethod === "card" && !stripe) || loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all disabled:opacity-50 mt-2"
            >
                {loading ? "Processing..." : `Pay $${finalAmount.toFixed(2)} →`}
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
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [showSuccess, setShowSuccess] = useState(false);

    // Coupon states
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [couponSuccess, setCouponSuccess] = useState("");

    const discountedPrice = totalPrice - (totalPrice * couponDiscount / 100);

    const handleCoupon = async () => {
        if (!couponCode) return;
        couponLoading(true);
        setCouponError("");
        setCouponSuccess("");
        try {
            const res = await api.post("/coupons/validate", { code: couponCode });
            setCouponDiscount(res.data.discount);
            setCouponSuccess(res.data.message);
            toast.success(res.data.message);
        } catch (err) {
            setCouponError(err.response?.data?.message || "Invalid coupon");
            setCouponDiscount(0);
        }
        setCouponLoading(false);
    };

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
                    <div className={`p-8 rounded-3xl shadow-lg relative ${darkMode ? "bg-gray-800" : "bg-white"}`}>

                        {/* Success Notification Modal */}
                        {showSuccess && (
                            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
                                <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 text-center shadow-2xl max-w-sm mx-4 animate-bounce">
                                    <div className="text-7xl mb-4">🎉</div>
                                    <h2 className="text-2xl font-black mb-2 text-gray-900 dark:text-white">Payment Successful!</h2>
                                    <p className="text-gray-500 dark:text-gray-400 mb-2">Your order has been placed via {paymentMethod === "bkash" ? "bKash 🟣" : "Nagad 🟠"}</p>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-4">
                                        <div className="bg-green-500 h-1.5 rounded-full w-full animate-pulse"></div>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-2">Redirecting...</p>
                                </div>
                            </div>
                        )}

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

                                    {/* Coupon Section */}
                                    <div>
                                        <label className={`text-sm font-bold mb-2 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                            Coupon Code
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Enter coupon code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                className={`flex-1 border-2 p-4 rounded-2xl focus:outline-none focus:border-blue-500 font-medium ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "border-gray-200 placeholder-gray-400"}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={handleCoupon}
                                                disabled={couponLoading}
                                                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 rounded-2xl font-bold hover:opacity-90 transition-all"
                                            >
                                                {couponLoading ? "..." : "Apply"}
                                            </button>
                                        </div>
                                        {couponError && <p className="text-red-500 text-sm mt-1 font-semibold">⚠️ {couponError}</p>}
                                        {couponSuccess && <p className="text-green-500 text-sm mt-1 font-semibold">✅ {couponSuccess}</p>}
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (!form.fullName || !form.address || !form.city || !form.phone) {
                                                toast.error("Please fill in all shipping fields");
                                                return;
                                            }
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
                                    <CheckoutForm
                                        shippingAddress={form}
                                        finalAmount={discountedPrice}
                                        paymentMethod={paymentMethod}
                                        setPaymentMethod={setPaymentMethod}
                                        setShowSuccess={setShowSuccess}
                                    />
                                </Elements>
                                <button
                                    type="button"
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
                            <div className="flex justify-between items-center mb-2">
                                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Delivery</span>
                                <span className="font-bold text-green-500">Free</span>
                            </div>

                            {/* Coupon Discount Summary */}
                            {couponDiscount > 0 && (
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-green-500 font-bold">Discount ({couponDiscount}%)</span>
                                    <span className="text-green-500 font-bold">-${(totalPrice * couponDiscount / 100).toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center">
                                <span className="font-black text-lg">Total</span>
                                <span className="font-black text-xl text-blue-600">${discountedPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;