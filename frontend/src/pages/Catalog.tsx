import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { ProductCard } from "../components/Products";
import style from "../styles/Catalog.module.css";
import { Product } from "../types/product";

const API_URL = "http://localhost:5004/api/products";

const PRODUCT_CATEGORIES = {
  DAIRY: "Молочные продукты",
  FROZEN: "Замороженные продукты",
  GROCERY: "Бакалея",
  FRUITS: "Фрукты и овощи",
  BAKERY: "Хлебобулочные изделия",
  CONFECTIONERY: "Кондитерские изделия",
  SEAFOOD: "Морские продукты",
  AGRICULTURAL: "Сельскохозяйственные продукты",
  MEAT: "Мясные продукты",
} as const;

type CategoryKey = keyof typeof PRODUCT_CATEGORIES;
type CategoryValue = (typeof PRODUCT_CATEGORIES)[CategoryKey];

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | "all">(
    "all"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Ошибка загрузки товаров");
      }
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки товаров");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const filtered =
      selectedCategory === "all"
        ? products
        : products.filter(
            (product) =>
              product.category === PRODUCT_CATEGORIES[selectedCategory]
          );
    setFilteredProducts(filtered);
  }, [selectedCategory, products]);

  const handleCategorySelect = useCallback((category: CategoryKey | "all") => {
    setSelectedCategory(category);
  }, []);

  if (loading) {
    return <div className={style.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={style.error}>{error}</div>;
  }

  return (
    <div className={style.catalogContainer}>
      <h1 className={style.title}>Каталог товаров</h1>
      <div className={style.filters}>
        <button
          className={`${style.categoryButton} ${
            selectedCategory === "all" ? style.active : ""
          }`}
          onClick={() => handleCategorySelect("all")}
        >
          Все товары
        </button>
        {Object.entries(PRODUCT_CATEGORIES).map(([key, value]) => (
          <button
            key={key}
            className={`${style.categoryButton} ${
              selectedCategory === key ? style.active : ""
            }`}
            onClick={() => handleCategorySelect(key as CategoryKey)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className={style.productsGrid}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;
