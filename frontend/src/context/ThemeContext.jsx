import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            <div className={darkMode ? "dark" : ""}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}