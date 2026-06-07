import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import AdminPanel from "./pages/AdminPanel";
import Payment from "./pages/Payment"; // Checkout এর বদলে Payment ইম্পোর্ট করা হলো
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import Wishlist from "./pages/Wishlist";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword"; // নতুন ইম্পোর্ট করা হলো
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        {/* /checkout পাথে এখন Payment কম্পোনেন্টটি রেন্ডার হবে */}
        <Route path="/checkout" element={<Payment />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* নতুন রাউট */}
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;