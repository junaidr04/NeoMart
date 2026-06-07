import { useTheme } from "../context/ThemeContext";

function ProductSkeleton() {
    const { darkMode } = useTheme();

    return (
        <div className={`rounded-2xl overflow-hidden border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <div className={`h-40 animate-pulse ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>
            <div className="p-3">
                <div className={`h-3 rounded-full animate-pulse mb-2 w-16 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>
                <div className={`h-4 rounded-full animate-pulse mb-2 w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>
                <div className={`h-3 rounded-full animate-pulse mb-4 w-3/4 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>
                <div className="flex justify-between items-center">
                    <div className={`h-5 rounded-full animate-pulse w-16 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>
                    <div className={`h-8 rounded-full animate-pulse w-20 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}></div>
                </div>
            </div>
        </div>
    );
}

export default ProductSkeleton;