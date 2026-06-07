import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';

function Cart() {
  const { darkMode } = useTheme();
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen px-4 py-12 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-2">Your Cart 🛒</h1>
        <p className={`mb-10 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
        </p>

        {cartItems.length === 0 ? (
          <div className={`text-center py-20 rounded-3xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <p className="text-7xl mb-6">🛒</p>
            <h2 className="text-2xl font-black mb-3">Your cart is empty!</h2>
            <p className={`mb-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Add some products to get started</p>
            <Link to="/products" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all">
              Shop Now →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
              {cartItems.map(item => (
                <div key={item._id} className={`p-4 rounded-3xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-full h-full flex items-center justify-center text-2xl">📦</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-sm truncate">{item.name}</h3>
                      <p className="text-blue-600 font-bold text-sm">${item.price}</p>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="text-red-400 hover:text-red-600 font-black text-lg flex-shrink-0 ml-1">✕</button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className={`w-8 h-8 rounded-full font-black text-base transition-all ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>-</button>
                      <span className="font-black w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className={`w-8 h-8 rounded-full font-black text-base transition-all ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}>+</button>
                    </div>
                    <p className="font-black text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:w-80">
              <div className={`p-6 rounded-3xl border sticky top-24 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                <h2 className="text-xl font-black mb-6">Order Summary</h2>
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex justify-between">
                    <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Subtotal</span>
                    <span className="font-bold">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Delivery</span>
                    <span className="font-bold text-green-500">Free</span>
                  </div>
                  <div className={`border-t pt-3 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                    <div className="flex justify-between">
                      <span className="font-black text-lg">Total</span>
                      <span className="font-black text-xl text-blue-600">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => user ? navigate("/checkout") : navigate("/login")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-lg"
                >
                  Checkout →
                </button>

                {/* আপডেটেড Clear Cart বাটন */}
                <button
                  onClick={() => { clearCart(); toast.success("Cart cleared! 🗑️"); }}
                  className="w-full mt-3 text-red-500 hover:text-red-700 font-bold py-2 transition-all"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;