import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API = "http://localhost:5000/api";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const register = async (name, email, password) => {
        const res = await axios.post(`${API}/auth/register`, { name, email, password });
        return res.data;
    };

    const login = async (email, password) => {
        const res = await axios.post(`${API}/auth/login`, { email, password }, { withCredentials: true });
        setUser(res.data.user);
        return res.data;
    };
    const logout = async () => {
        await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}