import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../types/product';

interface CartState {
  items: Product[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
       const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: number; change: number }>) => {
      const item = state.items.find(item => item.id === action.payload.productId);
      if (item) {
        const newQuantity = (item.quantity || 0) + action.payload.change;
        if (newQuantity <= 0) {
          state.items = state.items.filter(i => i.id !== action.payload.productId);
        } else {
          item.quantity = newQuantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 