import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminPanel() {
    const { darkMode } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("products");
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [form, setForm] = useState({
        name: "", description: "", price: "", category: "Electronics", stock: "", image: ""
    });

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
        }
        fetchProducts();
        fetchOrders();
    }, [user]);

    const fetchProducts = async () => {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
        setLoading(false);
    };

    const fetchOrders = async () => {
        const res = await axios.get("http://localhost:5000/api/orders", { withCredentials: true });
        setOrders(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editProduct) {
                await axios.put(`http://localhost:5000/api/products/${editProduct._id}`, form, { withCredentials: true });
            } else {
                await axios.post("http://localhost:5000/api/products", form, { withCredentials: true });
            }
            setShowForm(false);
            setEditProduct(null);
            setForm({ name: "", description: "", price: "", category: "Electronics", stock: "", image: "" });
            fetchProducts();
        } catch (err) {
            alert(err.response?.data?.message || "Error!");
        }
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        setForm({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            stock: product.stock,
            image: product.image
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        await axios.delete(`http://localhost:5000/api/products/${id}`, { withCredentials: true });
        fetchProducts();
    };

    const handleStatusUpdate = async (orderId, status) => {
        await axios.put(
            `http://localhost:5000/api/orders/${orderId}`,
            { status },
            { withCredentials: true }
        );
        fetchOrders();
    };

    const statusColor = {
        pending: "bg-yellow-100 text-yellow-600",
        processing: "bg-blue-100 text-blue-600",
        shipped: "bg-purple-100 text-purple-600",
        delivered: "bg-green-100 text-green-600",
        cancelled: "bg-red-100 text-red-600"
    };

    return (
        <div className={`min-h-screen px-6 py-12 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <h1 className="text-4xl font-extrabold mb-8">Admin Panel 🛠️</h1>

                {/* Tabs */}
                <div className="flex gap-3 mb-8">
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === "products"
                                ? "bg-blue-600 text-white"
                                : darkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-600"
                            }`}
                    >
                        📦 Products
                    </button>
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${activeTab === "orders"
                                ? "bg-blue-600 text-white"
                                : darkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-600"
                            }`}
                    >
                        🛍️ Orders {orders.length > 0 && `(${orders.length})`}
                    </button>
                </div>

                {/* Products Tab */}
                {activeTab === "products" && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <p className={darkMode ? "text-gray-400" : "text-gray-500"}>Manage your products</p>
                            <button
                                onClick={() => { setShowForm(!showForm); setEditProduct(null); setForm({ name: "", description: "", price: "", category: "Electronics", stock: "", image: "" }); }}
                                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-all"
                            >
                                {showForm ? "✕ Close" : "+ Add Product"}
                            </button>
                        </div>

                        {showForm && (
                            <div className={`p-8 rounded-2xl shadow-lg mb-8 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                                <h2 className="text-2xl font-bold mb-6">{editProduct ? "Edit Product" : "Add New Product"}</h2>
                                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`border p-3 rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`} required />
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`border p-3 rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Fashion">Fashion</option>
                                    </select>
                                    <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={`border p-3 rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`} required />
                                    <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={`border p-3 rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`} required />
                                    <input type="text" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={`border p-3 rounded-lg focus:outline-none focus:border-blue-500 md:col-span-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`} />
                                    <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`border p-3 rounded-lg focus:outline-none focus:border-blue-500 md:col-span-2 h-24 resize-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`} required />
                                    <button type="submit" className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-full font-bold hover:opacity-90 transition-all">
                                        {editProduct ? "Update Product" : "Add Product"}
                                    </button>
                                </form>
                            </div>
                        )}

                        {loading ? (
                            <p className="text-center text-blue-500">Loading...</p>
                        ) : (
                            <div className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                                <table className="w-full">
                                    <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                                        <tr>
                                            <th className="p-4 text-left text-sm font-bold">Product</th>
                                            <th className="p-4 text-left text-sm font-bold">Category</th>
                                            <th className="p-4 text-left text-sm font-bold">Price</th>
                                            <th className="p-4 text-left text-sm font-bold">Stock</th>
                                            <th className="p-4 text-left text-sm font-bold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map((product) => (
                                            <tr key={product._id} className={`border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {product.image && <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />}
                                                        <span className="font-semibold text-sm">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${product.category === "Electronics" ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"}`}>
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-bold text-blue-600">${product.price}</td>
                                                <td className="p-4"><span className={product.stock > 0 ? "text-green-500" : "text-red-500"}>{product.stock}</span></td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEdit(product)} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-200">Edit</button>
                                                        <button onClick={() => handleDelete(product._id)} className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-red-200">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                    <div className="flex flex-col gap-6">
                        {orders.length === 0 ? (
                            <p className="text-center text-gray-400 text-lg">No orders yet!</p>
                        ) : (
                            orders.map(order => (
                                <div key={order._id} className={`p-6 rounded-2xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="font-bold">Order #{order._id.slice(-8).toUpperCase()}</p>
                                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                            <p className={`text-sm font-semibold mt-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                                                👤 {order.user?.name} — {order.user?.email}
                                            </p>
                                            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                📍 {order.shippingAddress?.city} | 📞 {order.shippingAddress?.phone}
                                            </p>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColor[order.status]}`}>
                                            {order.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2 mb-4">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
                                                {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />}
                                                <span className="text-sm font-semibold">{item.name}</span>
                                                <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>x{item.quantity}</span>
                                                <span className="text-blue-600 font-bold text-sm ml-auto">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={`border-t pt-4 flex justify-between items-center ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                                        <div className="flex gap-2 flex-wrap">
                                            {["pending", "processing", "shipped", "delivered", "cancelled"].map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleStatusUpdate(order._id, s)}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${order.status === s
                                                            ? statusColor[s]
                                                            : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                                </button>
                                            ))}
                                        </div>
                                        <span className="text-xl font-extrabold text-blue-600">${order.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;