import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/product';
import { COOKIE_CONFIG, loadFromCookies, saveToCookies, findItemById, removeCookie } from '../../utils/storageUtils';

// Типы
interface FavoritesState {
    items: Product[];
}

// Начальное состояние
const initialState: FavoritesState = {
    items: loadFromCookies<Product>(COOKIE_CONFIG.FAVORITES_KEY),
};

// Создание slice
const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addToFavorites: (state, action: PayloadAction<Product>) => {
            if (!findItemById(state.items, action.payload.id)) {
                state.items.push(action.payload);
                saveToCookies(COOKIE_CONFIG.FAVORITES_KEY, state.items);
            }
        },
        
        removeFromFavorites: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
            saveToCookies(COOKIE_CONFIG.FAVORITES_KEY, state.items);
        },
        
        clearFavorites: (state) => {
            state.items = [];
            removeCookie(COOKIE_CONFIG.FAVORITES_KEY);
        }
    }
});

// Экспорт actions
export const { 
    addToFavorites, 
    removeFromFavorites, 
    clearFavorites 
} = favoritesSlice.actions;

export default favoritesSlice.reducer; 