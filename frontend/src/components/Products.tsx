import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
} from "../store/slices/cartSlice";
import { addToFavorites, removeFromFavorites } from "../store/favoritesSlice";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import styles from "../styles/Products.module.css";
import { Product } from "../types/product";
import { CartItem } from "../store/slices/cartSlice";

// Константы
const API_URL = "http://localhost:5004";
const DEFAULT_IMAGE = `${API_URL}/default-product.png`;
const CURRENCY_SYMBOL = "₽";
const QUANTITY_CHANGE = {
  INCREMENT: 1,
  DECREMENT: -1,
} as const;
const PRODUCTS_PER_PAGE = 4;
const PRODUCTS_PER_SECTION = 8;
const DISCOUNT_PERCENTAGE = 0.8;

// форматирование цены
const formatPrice = (price: number): string => {
  return price.toFixed(2);
};

interface ProductCardProps {
  product: Product;
}

// экспортируем ProductCard как отдельный компонент
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const isInFavorites = useMemo(
    () => favorites.some((item) => item.id === product.id),
    [favorites, product.id]
  );

  const cartItem = useMemo(
    () => cartItems.find((item) => item.id === product.id),
    [cartItems, product.id]
  );

  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = useCallback(() => {
    if (quantity > 0) {
      dispatch(
        updateQuantity({ id: product.id, change: QUANTITY_CHANGE.INCREMENT })
      );
    } else {
      const productToAdd: CartItem = {
        ...product,
        quantity: 1,
      };
      dispatch(addToCart(productToAdd));
    }
  }, [dispatch, product, quantity]);

  const handleRemoveFromCart = useCallback(() => {
    if (quantity === 1) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(
        updateQuantity({ id: product.id, change: QUANTITY_CHANGE.DECREMENT })
      );
    }
  }, [dispatch, product.id, quantity]);

  const handleToggleFavorite = useCallback(() => {
    if (isInFavorites) {
      dispatch(removeFromFavorites(product.id));
    } else {
      dispatch(addToFavorites(product));
    }
  }, [dispatch, isInFavorites, product]);

  const handleImageError = useCallback(() => {
    console.log(`Ошибка загрузки изображения для товара: ${product.name}`);
    setImageError(true);
  }, [product.name]);

  // формируем правильный путь к изображению
  const imageUrl = useMemo(() => {
    if (imageError) return DEFAULT_IMAGE;

    // проверяем, начинается ли путь с http или https
    if (
      product.img &&
      (product.img.startsWith("http://") || product.img.startsWith("https://"))
    ) {
      return product.img;
    }

    // если путь относительный, добавляем API_URL
    if (product.img) {
      // убираем лишние слеши в начале пути
      const cleanPath = product.img.startsWith("/")
        ? product.img.substring(1)
        : product.img;
      return `${API_URL}/${cleanPath}`;
    }

    return DEFAULT_IMAGE;
  }, [product.img, imageError]);

  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={product.name}
          className={styles.image}
          loading="lazy"
          onError={handleImageError}
        />
        <button
          className={`${styles.favoriteButton} ${
            isInFavorites ? styles.favoriteActive : ""
          }`}
          onClick={handleToggleFavorite}
          aria-label={
            isInFavorites ? "Удалить из избранного" : "Добавить в избранное"
          }
        >
          <FaHeart />
        </button>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <div className={styles.priceContainer}>
          <span className={styles.price}>
            {formatPrice(product.discountPrice || product.price)}{" "}
            {CURRENCY_SYMBOL}
          </span>
          {product.discountPrice && (
            <span className={styles.originalPrice}>
              {formatPrice(product.price)} {CURRENCY_SYMBOL}
            </span>
          )}
        </div>
        <div className={styles.actions}>
          {quantity > 0 ? (
            <div className={styles.quantityControls}>
              <button
                onClick={handleRemoveFromCart}
                className={styles.quantityButton}
                aria-label="Уменьшить количество"
              >
                -
              </button>
              <span className={styles.quantity}>{quantity}</span>
              <button
                onClick={handleAddToCart}
                className={styles.quantityButton}
                aria-label="Увеличить количество"
              >
                +
              </button>
            </div>
          ) : (
            <button
              className={styles.addToCart}
              onClick={handleAddToCart}
              aria-label="Добавить в корзину"
            >
              <FaShoppingCart />В корзину
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ProductsSectionProps {
  title: string;
  products: Product[];
  startIndex?: number;
  endIndex?: number;
  showDiscount?: boolean;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({
  title,
  products,
  startIndex = 0,
  endIndex = products.length,
  showDiscount = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      return [];
    }
    let result = products.slice(startIndex, endIndex);
    if (showDiscount) {
      result = result.map((product) => ({
        ...product,
        discountPrice: product.price * DISCOUNT_PERCENTAGE,
      }));
    }
    return result;
  }, [products, startIndex, endIndex, showDiscount]);

  const maxIndex = useMemo(
    () => Math.max(0, filteredProducts.length - PRODUCTS_PER_PAGE),
    [filteredProducts.length]
  );

  const visibleProducts = useMemo(
    () =>
      filteredProducts.slice(currentIndex, currentIndex + PRODUCTS_PER_PAGE),
    [filteredProducts, currentIndex]
  );

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  }, [maxIndex]);

  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex === maxIndex;

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionContent}>
        <button
          className={`${styles.navButton} ${
            isPrevDisabled ? styles.disabled : ""
          }`}
          onClick={handlePrev}
          disabled={isPrevDisabled}
          aria-label="Предыдущая страница"
        >
          <AiOutlineLeft />
        </button>
        <div className={styles.productsGrid}>
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <button
          className={`${styles.navButton} ${
            isNextDisabled ? styles.disabled : ""
          }`}
          onClick={handleNext}
          disabled={isNextDisabled}
          aria-label="Следующая страница"
        >
          <AiOutlineRight />
        </button>
      </div>
    </section>
  );
};

const ProductsMain: React.FC = () => {
  const products = useSelector((state: RootState) => state.products.products);

  if (!products || products.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noProducts}>
          <h2>Товары не найдены</h2>
          <p>Пожалуйста, попробуйте позже</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ProductsSection
        title="Акции"
        products={products}
        startIndex={0}
        endIndex={PRODUCTS_PER_SECTION}
        showDiscount={true}
      />
      <ProductsSection
        title="Новинки"
        products={products}
        startIndex={PRODUCTS_PER_SECTION}
        endIndex={PRODUCTS_PER_SECTION * 2}
      />
    </div>
  );
};

export { ProductsSection, ProductsMain };
export default ProductsMain;
