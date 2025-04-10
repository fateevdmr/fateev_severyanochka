import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/product";

// Упрощенное состояние для продуктов
interface ProductState {
  products: Product[];
}

// Начальное состояние
const initialState: ProductState = {
  products: [],
};

// Создание slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Единственный редьюсер для установки продуктов
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
});

// Экспорт actions
export const { setProducts } = productSlice.actions;

export default productSlice.reducer; 