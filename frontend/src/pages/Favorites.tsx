import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { removeFromFavorites } from "../store/favoritesSlice";
import { addToCart, updateQuantity } from "../store/slices/cartSlice";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import styles from "../styles/Favorites.module.css";
import { Product } from "../types/product";
import { ProductCard } from "../components/Products";

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const API_URL = "http://localhost:5004/api/products";
const CACHE_KEY = "cachedProducts";
const DEFAULT_QUANTITY = 1;

const Favorites: React.FC = () => {
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const favoritesCount = useMemo(() => favorites.length, [favorites]);

  const fetchProducts = useCallback(async () => {
    try {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
         const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setProducts(data);
          setLoading(false);
          return;
        }
      }

      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Ошибка загрузки товаров");
      }
      const data = await response.json();

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );

      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleRemoveFromFavorites = useCallback(
    (productId: number) => {
      dispatch(removeFromFavorites(productId));
    },
    [dispatch]
  );

  const handleAddToCart = useCallback(
    (product: Product) => {
      dispatch(addToCart({ ...product, quantity: DEFAULT_QUANTITY }));
    },
    [dispatch]
  );

  const handleQuantityChange = useCallback(
    (productId: number, change: number) => {
      dispatch(updateQuantity({ id: productId, change }));
    },
    [dispatch]
  );

  const getCartItemQuantity = useCallback(
    (productId: number): number => {
      return cartItems.find((item) => item.id === productId)?.quantity || 0;
    },
    [cartItems]
  );

  const favoriteProducts = products.filter((product) =>
    favorites.some((favorite) => favorite.id === product.id)
  );

  const renderFavoritesList = useCallback(() => {
    if (favorites.length === 0) {
      return (
        <div className={styles.emptyMessage}>
          <p>В избранном пока нет товаров</p>
        </div>
      );
    }

    return (
      <div className={styles.favoritesGrid}>
        {favorites.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }, [favorites]);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.favoritesContainer}>
      <h1 className={styles.title}>Избранное</h1>
      {renderFavoritesList()}
    </div>
  );
};

export default Favorites;
