import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const { darkMode } = useTheme();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className={`flex items-center justify-center min-h-screen ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            <div className={`p-8 rounded-lg shadow-md w-full max-w-md ${darkMode ? "bg-gray-900 text-white" : "bg-white"}`}>
                <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className={`border p-3 rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className={`border p-3 rounded-lg focus:outline-none focus:border-blue-500 ${darkMode ? "bg-gray-700 text-white border-gray-600" : ""}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
                <p className={`text-center mt-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;