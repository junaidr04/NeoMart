import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from 'react-hot-toast';

function ChangePassword() {
    const { darkMode } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [show, setShow] = useState({ current: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ইউজার লগইন না থাকলে সুরক্ষিতভাবে রিডাইরেক্ট করার জন্য
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.newPassword !== form.confirmPassword) {
            setError("New passwords don't match!");
            return;
        }
        if (form.newPassword.length < 6) {
            setError("Password must be at least 6 characters!");
            return;
        }

        setLoading(true);
        try {
            const endpoint = user.role === "admin" ? "/auth/admin/change-password" : "/auth/change-password";
            await api.put(endpoint, {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            });

            // পাসওয়ার্ড সফলভাবে চেঞ্জ হলে নোটিফিকেশন ও স্টেট আপডেট
            setSuccess("Password changed successfully! 🎉");
            toast.success("Password changed successfully! 🎉");

            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password");
            toast.error(err.response?.data?.message || "Failed to change password");
        }
        setLoading(false);
    };

    const EyeButton = ({ field }) => (
        <button
            type="button"
            onClick={() => setShow(prev => ({ ...prev, [field]: !prev[field] }))}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
            {show[field] ? "👁️" : "🙈"}
        </button>
    );

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className={`w-full max-w-md p-8 rounded-3xl shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h1 className="text-3xl font-black mb-2">
                    {user.role === "admin" ? "🔐 Admin Password" : "🔒 Change Password"}
                </h1>
                <p className={`mb-8 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Update your account password
                </p>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm font-semibold">
                        ⚠️ {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-2xl mb-6 text-sm font-semibold">
                        ✅ {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className={`text-sm font-bold mb-2 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Current Password</label>
                        <div className="relative">
                            <input
                                type={show.current ? "text" : "password"}
                                placeholder="••••••••"
                                value={form.currentPassword}
                                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                                className={`w-full border-2 p-4 pr-12 rounded-2xl focus:outline-none focus:border-blue-500 font-medium ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "border-gray-200 placeholder-gray-400"}`}
                                required
                            />
                            <EyeButton field="current" />
                        </div>
                    </div>

                    <div>
                        <label className={`text-sm font-bold mb-2 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}>New Password</label>
                        <div className="relative">
                            <input
                                type={show.new ? "text" : "password"}
                                placeholder="••••••••"
                                value={form.newPassword}
                                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                className={`w-full border-2 p-4 pr-12 rounded-2xl focus:outline-none focus:border-blue-500 font-medium ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "border-gray-200 placeholder-gray-400"}`}
                                required
                            />
                            <EyeButton field="new" />
                        </div>
                    </div>

                    <div>
                        <label className={`text-sm font-bold mb-2 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={show.confirm ? "text" : "password"}
                                placeholder="••••••••"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                className={`w-full border-2 p-4 pr-12 rounded-2xl focus:outline-none focus:border-blue-500 font-medium ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "border-gray-200 placeholder-gray-400"}`}
                                required
                            />
                            <EyeButton field="confirm" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all mt-2 disabled:opacity-50"
                    >
                        {loading ? "Changing..." : "Change Password →"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className={`py-3 rounded-2xl font-bold transition-all ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
                    >
                        ← Go Back
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;