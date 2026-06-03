import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function Cart() {
    const { darkMode } = useTheme();
    const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

    return (
        <div className={`min-h-screen px-6 py-12 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <h1 className="text-4xl font-extrabold text-center mb-12">Your Cart 🛒</h1>

            {cartItems.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-400 text-lg mb-6">Your cart is empty!</p>
                    <Link
                        to="/products"
                        className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all"
                    >
                        Shop Now
                    </Link>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto">
                    {cartItems.map(item => (
                        <div
                            key={item._id}
                            className={`flex items-center gap-4 p-5 rounded-2xl shadow-md mb-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}
                        >
                            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-xl flex items-center justify-center text-4xl">
                                📦
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <p className="text-blue-600 font-bold">${item.price}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    className="bg-gray-200 text-gray-800 w-8 h-8 rounded-full font-bold hover:bg-gray-300"
                                >
                                    -
                                </button>
                                <span className="font-bold w-6 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    className="bg-gray-200 text-gray-800 w-8 h-8 rounded-full font-bold hover:bg-gray-300"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => removeFromCart(item._id)}
                                className="text-red-500 hover:text-red-700 font-bold text-xl"
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    {/* Total */}
                    <div className={`p-6 rounded-2xl shadow-md mt-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold">Total:</span>
                            <span className="text-2xl font-extrabold text-blue-600">${totalPrice.toFixed(2)}</span>
                        </div>
                        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all">
                            Checkout →
                        </button>
                        <button
                            onClick={clearCart}
                            className="w-full mt-3 text-red-500 hover:text-red-700 font-semibold"
                        >
                            Clear Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;