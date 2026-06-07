import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
// যদি toast লাইব্রেরি ব্যবহার করেন (যেমন react-hot-toast বা react-toastify) তবে এটি আনকমেন্ট করুন:
// import { toast } from "react-hot-toast"; 

// ব্যাকআপ টোস্ট অবজেক্ট (যদি প্রজেক্টে toast ইনস্টল করা না থাকে যেন ক্র্যাশ না করে)
const toast = {
    success: (msg) => alert(msg),
    error: (msg) => alert(msg)
};

function AdminPanel() {
    const { darkMode } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("dashboard");
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [coupons, setCoupons] = useState([]); // Added coupons state
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [form, setForm] = useState({
        name: "", description: "", price: "", category: "Electronics", stock: "", image: ""
    });

    useEffect(() => {
        if (!user || user.role !== "admin") navigate("/");
        fetchProducts();
        fetchOrders();
        fetchCoupons(); // Added fetchCoupons to useEffect
    }, [user]);

    const fetchProducts = async () => {
        const res = await api.get("/products");
        setProducts(res.data);
        setLoading(false);
    };

    const fetchOrders = async () => {
        const res = await api.get("/orders");
        setOrders(res.data);
    };

    // Added fetchCoupons function
    const fetchCoupons = async () => {
        const res = await api.get("/coupons");
        setCoupons(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editProduct) {
                await api.put(`/products/${editProduct._id}`, form);
            } else {
                await api.post("/products", form);
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
        await api.delete(`/products/${id}`);
        fetchProducts();
    };

    const handleStatusUpdate = async (orderId, status) => {
        await api.put(`/orders/${orderId}`, { status });
        fetchOrders();
    };

    // Added handleDeleteCoupon function
    const handleDeleteCoupon = async (id) => {
        if (!window.confirm("Delete this coupon?")) return;
        await api.delete(`/coupons/${id}`);
        fetchCoupons();
    };

    // Added handleToggleCoupon function
    const handleToggleCoupon = async (id) => {
        await api.put(`/coupons/${id}/toggle`);
        fetchCoupons();
    };

    const statusColor = {
        pending: "bg-yellow-100 text-yellow-600",
        processing: "bg-blue-100 text-blue-600",
        shipped: "bg-purple-100 text-purple-600",
        delivered: "bg-green-100 text-green-600",
        cancelled: "bg-red-100 text-red-600"
    };

    // Dashboard stats
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const pendingOrders = orders.filter(o => o.status === "pending").length;

    // Category distribution for pie chart
    const categoryData = products.reduce((acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
    }, {});
    const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

    // Order status distribution
    const statusData = ["pending", "processing", "shipped", "delivered", "cancelled"].map(s => ({
        name: s.charAt(0).toUpperCase() + s.slice(1),
        count: orders.filter(o => o.status === s).length
    }));

    // Revenue by day (last 7 orders)
    const revenueData = orders.slice(0, 7).reverse().map((o, i) => ({
        day: `Order ${i + 1}`,
        revenue: o.totalPrice
    }));

    const COLORS = ["#3b82f6", "#ec4899", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

    // Updated tabs array to include Coupons
    const tabs = [
        { id: "dashboard", label: "📊 Dashboard" },
        { id: "products", label: "📦 Products" },
        { id: "orders", label: `🛍️ Orders ${orders.length > 0 ? `(${orders.length})` : ""}` },
        { id: "coupons", label: "🎟️ Coupons" }
    ];

    return (
        <div className={`min-h-screen px-4 py-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="max-w-7xl mx-auto">

                <h1 className="text-4xl font-extrabold mb-8">Admin Panel 🛠️</h1>

                {/* Tabs */}
                <div className="flex gap-3 mb-8 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                                ? "bg-blue-600 text-white"
                                : darkMode ? "bg-gray-700 text-gray-300" : "bg-white text-gray-600"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Dashboard Tab */}
                {activeTab === "dashboard" && (
                    <div>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {[
                                { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: "💰", color: "from-blue-500 to-blue-700" },
                                { label: "Total Orders", value: totalOrders, icon: "🛍️", color: "from-purple-500 to-purple-700" },
                                { label: "Total Products", value: totalProducts, icon: "📦", color: "from-green-500 to-green-700" },
                                { label: "Pending Orders", value: pendingOrders, icon: "⏳", color: "from-orange-500 to-orange-700" },
                            ].map((stat, i) => (
                                <div key={i} className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl text-white shadow-lg`}>
                                    <div className="text-3xl mb-2">{stat.icon}</div>
                                    <div className="text-2xl font-black">{stat.value}</div>
                                    <div className="text-sm opacity-80 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                            {/* Revenue Chart */}
                            <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                                <h3 className="font-black text-lg mb-4">📈 Revenue Trend</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                                        <XAxis dataKey="day" tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 11 }} />
                                        <YAxis tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 11 }} />
                                        <Tooltip
                                            contentStyle={{ background: darkMode ? "#1f2937" : "#fff", border: "none", borderRadius: "12px" }}
                                            labelStyle={{ color: darkMode ? "#fff" : "#000" }}
                                        />
                                        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Category Pie Chart */}
                            <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                                <h3 className="font-black text-lg mb-4">🥧 Products by Category</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                                            {pieData.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: darkMode ? "#1f2937" : "#fff", border: "none", borderRadius: "12px" }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Order Status Chart */}
                        <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                            <h3 className="font-black text-lg mb-4">📊 Orders by Status</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={statusData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                                    <XAxis dataKey="name" tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} />
                                    <YAxis tick={{ fill: darkMode ? "#9ca3af" : "#6b7280", fontSize: 12 }} />
                                    <Tooltip contentStyle={{ background: darkMode ? "#1f2937" : "#fff", border: "none", borderRadius: "12px" }} />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                                        {statusData.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

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
                                        {["Electronics", "Fashion", "Laptops", "Mobiles", "Headphones", "Mouse", "Keyboard"].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
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
                                <div className="overflow-x-auto">
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
                                            ={products.map((product) => (
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

                {/* Added Coupons Tab content underneath Orders Tab */}
                {activeTab === "coupons" && (
                    <div>
                        {/* Add Coupon Form */}
                        <div className={`p-6 rounded-2xl shadow-lg mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                            <h2 className="text-xl font-black mb-4">Create Coupon</h2>
                            <CouponForm darkMode={darkMode} onCreated={fetchCoupons} />
                        </div>

                        {/* Coupons List */}
                        <div className={`rounded-2xl shadow-lg overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                            <table className="w-full">
                                <thead className={darkMode ? "bg-gray-700" : "bg-gray-50"}>
                                    <tr>
                                        <th className="p-4 text-left text-sm font-bold">Code</th>
                                        <th className="p-4 text-left text-sm font-bold">Discount</th>
                                        <th className="p-4 text-left text-sm font-bold">Expiry</th>
                                        <th className="p-4 text-left text-sm font-bold">Status</th>
                                        <th className="p-4 text-left text-sm font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.map(coupon => (
                                        <tr key={coupon._id} className={`border-t ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                                            <td className="p-4 font-black text-blue-600">{coupon.code}</td>
                                            <td className="p-4 font-bold">{coupon.discount}%</td>
                                            <td className="p-4 text-sm">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${coupon.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                                                    {coupon.isActive ? "Active" : "Inactive"}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleToggleCoupon(coupon._id)} className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-yellow-200">
                                                        {coupon.isActive ? "Deactivate" : "Activate"}
                                                    </button>
                                                    <button onClick={() => handleDeleteCoupon(coupon._id)} className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-red-200">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Added CouponForm component outside of AdminPanel
function CouponForm({ darkMode, onCreated }) {
    const [form, setForm] = useState({ code: "", discount: "", expiryDate: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/coupons", form);
            setForm({ code: "", discount: "", expiryDate: "" });
            onCreated();
            toast.success("Coupon created! 🎟️");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error creating coupon");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
                type="text"
                placeholder="COUPON CODE"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className={`border p-3 rounded-xl focus:outline-none focus:border-blue-500 font-bold ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                required
            />
            <input
                type="number"
                placeholder="Discount % (1-100)"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                min="1"
                max="100"
                className={`border p-3 rounded-xl focus:outline-none focus:border-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                required
            />
            <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                className={`border p-3 rounded-xl focus:outline-none focus:border-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-white" : ""}`}
                required
            />
            <button
                type="submit"
                disabled={loading}
                className="md:col-span-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all"
            >
                {loading ? "Creating..." : "Create Coupon 🎟️"}
            </button>
        </form>
    );
}

export default AdminPanel;