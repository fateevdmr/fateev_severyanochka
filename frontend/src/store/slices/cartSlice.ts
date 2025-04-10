import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/product';
import { COOKIE_CONFIG, loadFromCookies, saveToCookies, findItemById } from '../../utils/storageUtils';

// Константы для работы с количеством товаров
const QUANTITY_CONFIG = {
    DEFAULT: 1,
    INCREMENT: 1,
    MIN: 1,
} as const;

// Типы
export interface CartItem extends Omit<Product, 'quantity'> {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    total: number;
}

interface UpdateQuantityPayload {
    id: number;
    change: number;
}

// Вспомогательные функции
const calculateTotal = (items: CartItem[]): number => {
    return items.reduce((total, item) => {
        const price = item.discountPrice || item.price;
        return total + price * item.quantity;
    }, 0);
};

// Начальное состояние
const initialState: CartState = {
    items: loadFromCookies<CartItem>(COOKIE_CONFIG.CART_KEY),
    total: calculateTotal(loadFromCookies<CartItem>(COOKIE_CONFIG.CART_KEY)),
};

// Создание slice
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = findItemById(state.items, action.payload.id);
            
            if (existingItem) {
                existingItem.quantity += QUANTITY_CONFIG.INCREMENT;
            } else {
                state.items.push(action.payload);
            }
            
            state.total = calculateTotal(state.items);
            saveToCookies(COOKIE_CONFIG.CART_KEY, state.items);
        },
        
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
            state.total = calculateTotal(state.items);
            saveToCookies(COOKIE_CONFIG.CART_KEY, state.items);
        },
        
        updateQuantity: (state, action: PayloadAction<UpdateQuantityPayload>) => {
            const item = findItemById(state.items, action.payload.id);
            
            if (item) {
                const newQuantity = item.quantity + action.payload.change;
                if (newQuantity >= QUANTITY_CONFIG.MIN) {
                    item.quantity = newQuantity;
                    state.total = calculateTotal(state.items);
                    saveToCookies(COOKIE_CONFIG.CART_KEY, state.items);
                }
            }
        },
        
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            saveToCookies(COOKIE_CONFIG.CART_KEY, []);
        },
    }
});

// Экспорт actions
export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer; 