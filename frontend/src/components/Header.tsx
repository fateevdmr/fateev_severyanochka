import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineMenu,
  AiOutlineSearch,
  AiFillHeart,
} from "react-icons/ai";
import { addToCart } from "../store/slices/cartSlice";
import { addToFavorites, removeFromFavorites } from "../store/slices/favoritesSlice";
import style from "../styles/Header.module.css";
import { Product } from "../types/product";
import { FaList, FaShoppingBag } from "react-icons/fa";

const API_URL = "http://localhost:5004";
const CURRENCY_SYMBOL = "₽";
const SEARCH_DELAY = 300; // ms
const DEFAULT_QUANTITY = 1;

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const cartItemsCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [cartItems]
  );

  const favoritesCount = useMemo(() => favorites.length, [favorites]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        const results = products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, SEARCH_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery, products]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleProductClick = useCallback((product: Product) => {
    setSearchQuery("");
    setShowResults(false);
    navigate(`/catalog?search=${encodeURIComponent(product.name)}`);
  }, [navigate]);

  const handleAddToCart = useCallback((e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const productToAdd = {
      ...product,
      quantity: DEFAULT_QUANTITY
    };
    dispatch(addToCart(productToAdd));
  }, [dispatch]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const isFavorite = favorites.some(item => item.id === product.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(product.id));
    } else {
      dispatch(addToFavorites(product));
    }
  }, [dispatch, favorites]);

  const renderSearchResult = useCallback((product: Product) => {
    const isFavorite = favorites.some(item => item.id === product.id);
    return (
      <div
        key={product.id}
        className={style.searchResultItem}
        onClick={() => handleProductClick(product)}
      >
        <img
          src={`${API_URL}/${product.img}`}
          alt={product.name}
          className={style.searchResultImage}
          loading="lazy"
        />
        <div className={style.searchResultInfo}>
          <span className={style.searchResultName}>{product.name}</span>
          <span className={style.searchResultPrice}>
            {product.price} {CURRENCY_SYMBOL}
          </span>
        </div>
        <div className={style.searchResultActions}>
          <button
            className={style.searchResultAction}
            onClick={(e) => handleAddToCart(e, product)}
            aria-label="Добавить в корзину"
          >
            <AiOutlineShoppingCart />
          </button>
          <button
            className={style.searchResultAction}
            onClick={(e) => handleToggleFavorite(e, product)}
            aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
          >
            {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
          </button>
        </div>
      </div>
    );
  }, [favorites, handleAddToCart, handleProductClick, handleToggleFavorite]);

  return (
    <header className={style.header}>
      <div className={style.headerContent}>
        <Link to="/" className={style.logo}>
          <img src="/logo.png" alt="Logo" loading="lazy" />
        </Link>
        <div className={style.searchContainer}>
          <div className={style.searchInputWrapper}>
            <AiOutlineSearch className={style.searchIcon} />
            <input
              type="text"
              placeholder="Поиск товаров"
              value={searchQuery}
              onChange={handleSearch}
              className={style.searchInput}
              aria-label="Поиск товаров"
            />
          </div>
          {showResults && searchResults.length > 0 && (
            <div className={style.searchResults}>
              {searchResults.map(renderSearchResult)}
            </div>
          )}
        </div>
        <nav className={style.nav}>
          <Link 
            to="/catalog" 
            className={`${style.catalogButton} ${
              location.pathname === "/catalog" ? style.active : ""
            }`}
          >
            <AiOutlineMenu />
            <span>Каталог</span>
          </Link>
          <Link
            to="/favorites"
            className={`${style.navLink} ${
              location.pathname === "/favorites" ? style.active : ""
            }`}
          >
            <AiOutlineHeart />
            <span>Избранное</span>
            {favoritesCount > 0 && (
              <span className={style.cartCount}>{favoritesCount}</span>
            )}
          </Link>
          <Link
            to="/cart"
            className={`${style.navLink} ${
              location.pathname === "/cart" ? style.active : ""
            }`}
          >
            <AiOutlineShoppingCart />
            <span>Корзина</span>
            {cartItemsCount > 0 && (
              <span className={style.cartCount}>{cartItemsCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
