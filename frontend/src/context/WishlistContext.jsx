import { createContext, useContext, useState } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);

    const addToWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.find(item => item._id === product._id);
            if (exists) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id) => {
        setWishlist(prev => prev.filter(item => item._id !== id));
    };

    const isWishlisted = (id) => wishlist.some(item => item._id === id);

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}