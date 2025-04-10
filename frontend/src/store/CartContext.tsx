import React, { createContext, useContext, useState } from 'react';

interface CartContextType {
    cart: Record<number, number>;
    favorites: number[];
    addToCart: (id: number) => void;
    removeFromCart: (id: number) => void;
    addToFavorites: (id: number) => void;
    removeFromFavorites: (id: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Record<number, number>>({});
    const [favorites, setFavorites] = useState<number[]>([]);

    const addToCart = (id: number) => {
        setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const removeFromCart = (id: number) => {
        setCart(prev => {
            const newCart = { ...prev };
            delete newCart[id];
            return newCart;
        });
    };

    const addToFavorites = (id: number) => {
        setFavorites(prev => [...prev, id]);
    };

    const removeFromFavorites = (id: number) => {
        setFavorites(prev => prev.filter(favId => favId !== id));
    };

    const clearCart = () => {
        setCart({}); // Очищает корзину
    };

    return (
        <CartContext.Provider value={{ cart, favorites, addToCart, removeFromCart, addToFavorites, removeFromFavorites, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};