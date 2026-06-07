import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";

function ChangePassword() {
    const { darkMode } = useTheme();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (!user) {
        navigate("/login");
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (form.newPassword !== form.confirmPassword) {
            setError("New passwords do not match!");
            return;
        }

        if (form.newPassword.length < 6) {
            setError("New password must be at least 6 characters!");
            return;
        }

        setLoading(true);
        try {
            await api.put("/auth/change-password", {
                currentPassword: form.currentPassword,
                newPassword: form.newPassword
            });
            setSuccess("Password changed successfully! ✅");
            setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password");
        }
        setLoading(false);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            <div className="w-full max-w-md">
                <div className={`p-8 rounded-3xl shadow-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
                    <h1 className="text-3xl font-black mb-2">Change Password 🔒</h1>
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
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className={`text-sm font-bold mb-2 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                Current Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={form.currentPassword}
                                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                                className={`w-full border-2 p-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "border-gray-200 placeholder-gray-400"}`}
                                required
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-bold mb-2 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={form.newPassword}
                                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                                className={`w-full border-2 p-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "border-gray-200 placeholder-gray-400"}`}
                                required
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-bold mb-2 block ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={form.confirmPassword}
                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                className={`w-full border-2 p-4 rounded-2xl focus:outline-none focus:border-blue-500 transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "border-gray-200 placeholder-gray-400"}`}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all mt-2 shadow-lg disabled:opacity-50"
                        >
                            {loading ? "Changing..." : "Change Password →"}
                        </button>
                    </form>

                    <button
                        onClick={() => navigate(-1)}
                        className={`w-full mt-4 py-3 rounded-2xl font-bold transition-all ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        ← Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;