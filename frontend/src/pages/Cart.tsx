import React, { useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import type { CartItem } from "../store/slices/cartSlice";
import style from "../styles/Cart.module.css";
import {
  AiOutlineDelete,
  AiOutlinePlus,
  AiOutlineMinus,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";

// API и URL константы
const API_URL = "http://localhost:5004";
const DEFAULT_IMAGE = `${API_URL}/default-product.png`;

// промокоды и скидки
const COUPONS = {
  SPRING: "spring",
} as const;

const DISCOUNTS = {
  SPRING: 0.2,
} as const;

// валидация
const PHONE_PATTERN = "[0-9]{11}";
const PHONE_PLACEHOLDER = "+7 (999) 999-99-99";

// временные константы
const DELIVERY_TIME_MINUTES = 30;

// форматирование чисел
const PRICE_DECIMAL_PLACES = 2;

// начальные значения
const INITIAL_ADDRESS = "Санкт-Петербург";

interface FormData {
  address: string;
  phone: string;
  email: string;
  coupon: string;
}

const initialFormData: FormData = {
  address: INITIAL_ADDRESS,
  phone: "",
  email: "",
  coupon: "",
};

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [discount, setDiscount] = useState<number>(0);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<number | null>(
    null
  );

  const totalAmount = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return subtotal * (1 - discount);
  }, [cartItems, discount]);

  const handleQuantityChange = useCallback(
    (productId: number, change: number) => {
      if (change < 0) {
        // Если нажата кнопка "минус", уменьшаем количество на 1
        const item = cartItems.find((item) => item.id === productId);
        if (item && item.quantity > 1) {
          // Если количество больше 1, уменьшаем на 1
          dispatch(updateQuantity({ id: productId, change: -1 }));
        } else if (item && item.quantity === 1) {
          // Если количество равно 1, удаляем товар
          dispatch(removeFromCart(productId));
        }
      } else {
        // Если нажата кнопка "плюс", увеличиваем количество
        dispatch(updateQuantity({ id: productId, change }));
      }
    },
    [dispatch, cartItems]
  );

  const handleRemoveItem = useCallback(
    (productId: number) => {
      dispatch(removeFromCart(productId));
      setShowRemoveConfirm(null);
    },
    [dispatch]
  );

  const handleClearCart = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleCouponSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.coupon.toLowerCase() === COUPONS.SPRING) {
        setDiscount(DISCOUNTS.SPRING);
      } else {
        setDiscount(0);
      }
    },
    [formData.coupon]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        // логика отправки заказа
        setSubmitSuccess(true);
        handleClearCart();
      } catch (error) {
        setSubmitError("Произошла ошибка при оформлении заказа");
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleClearCart]
  );

  if (cartItems.length === 0 && !submitSuccess) {
    return (
      <div className={style.emptyCart}>
        <AiOutlineShoppingCart className={style.emptyCartIcon} />
        <h2>Вы не добавили товаров в корзину</h2>
        <p>Перейдите в каталог, чтобы добавить товары</p>
        <Link to="/products" className={style.goToProductsButton}>
          Перейти к товарам
        </Link>
      </div>
    );
  }

  if (submitSuccess) {
    return (
      <div className={style.cartContainer}>
        <h1>Корзина</h1>
        <div className={style.success}>
          <p>Заказ успешно оформлен!</p>
          <p>Мы соберем заказ за 15 минут и вышлем смс с контактами курьера!</p>
          <p>Ожидаемое время доставки: {DELIVERY_TIME_MINUTES} минут</p>
        </div>
      </div>
    );
  }

  return (
    <div className={style.cartContainer}>
      <h1>Корзина</h1>
      <div className={style.cartContent}>
        <div className={style.cartItems}>
          <div className={style.cartHeader}>
            <h2>Товары в корзине ({cartItems.length})</h2>
            <button
              className={style.clearCartButton}
              onClick={handleClearCart}
              title="Очистить корзину"
            >
              <AiOutlineShoppingCart /> Очистить корзину
            </button>
          </div>
          {cartItems.map((item) => (
            <div key={item.id} className={style.cartItem}>
              <div className={style.itemImageContainer}>
                <img
                  src={item.img ? `${API_URL}/${item.img}` : DEFAULT_IMAGE}
                  alt={item.name}
                  className={style.itemImage}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_IMAGE;
                  }}
                />
              </div>
              <div className={style.itemDetails}>
                <h3>{item.name}</h3>
                <p className={style.itemPrice}>{item.price} ₽</p>
                <div className={style.quantityControls}>
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className={style.quantityButton}
                    aria-label="Удалить товар"
                  >
                    <AiOutlineMinus />
                  </button>
                  <span className={style.quantityValue}>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className={style.quantityButton}
                    aria-label="Увеличить количество"
                  >
                    <AiOutlinePlus />
                  </button>
                </div>
              </div>
              <div className={style.removeContainer}>
                {showRemoveConfirm === item.id ? (
                  <div className={style.removeConfirm}>
                    <p>Удалить товар?</p>
                    <div className={style.removeButtons}>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className={style.confirmRemoveButton}
                      >
                        Да
                      </button>
                      <button
                        onClick={() => setShowRemoveConfirm(null)}
                        className={style.cancelRemoveButton}
                      >
                        Нет
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className={style.removeButton}
                    onClick={() => setShowRemoveConfirm(item.id)}
                    aria-label="Удалить товар"
                  >
                    <AiOutlineDelete />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className={style.cartSummary}>
          <h2>Оформление заказа</h2>
          <form onSubmit={handleSubmit} className={style.orderForm}>
            <div className={style.formGroup}>
              <label htmlFor="address">Адрес доставки</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="phone">Телефон</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                pattern={PHONE_PATTERN}
                placeholder={PHONE_PLACEHOLDER}
                required
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="coupon">Промокод</label>
              <div className={style.couponContainer}>
                <input
                  type="text"
                  id="coupon"
                  name="coupon"
                  value={formData.coupon}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={handleCouponSubmit}
                  className={style.couponButton}
                >
                  Применить
                </button>
              </div>
            </div>
            <div className={style.orderSummary}>
              <div className={style.summaryRow}>
                <span>Товары ({cartItems.length}):</span>
                <span>
                  {cartItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                  )}{" "}
                  ₽
                </span>
              </div>
              {discount > 0 && (
                <div className={style.summaryRow}>
                  <span>Скидка:</span>
                  <span>-{discount * 100}%</span>
                </div>
              )}
              <div className={style.summaryRow}>
                <span>Доставка:</span>
                <span>Бесплатно</span>
              </div>
              <div className={style.summaryRow}>
                <span>Итого:</span>
                <span className={style.totalAmount}>
                  {totalAmount.toFixed(PRICE_DECIMAL_PLACES)} ₽
                </span>
              </div>
            </div>
            <button
              type="submit"
              className={style.checkoutButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Оформление..." : "Оформить заказ"}
            </button>
            {submitError && <p className={style.error}>{submitError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Cart;
