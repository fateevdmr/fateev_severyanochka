import { StrictMode } from 'react'
import React from "react";
import ReactDOM from "react-dom/client";
import './Styles/index.css'
import App from './App'
import {CartProvider} from "./store/CartContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <CartProvider>
        <App />
            </CartProvider>
    </React.StrictMode>
);
