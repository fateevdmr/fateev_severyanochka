import React, { useEffect, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { setProducts } from "../store/slices/productSlice";
import style from "../styles/Home.module.css";
import { Product } from "../types/product";
import axios from "axios";
import Banner from "../components/Banner";
import { ProductsMain } from "../components/Products";
import MapComponent from "../components/MapComponent";
import SpecialOffers from "./SpecialOffers";

const API_URL = "http://localhost:5004/api/products";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axios.get<Product[]>(API_URL);
      dispatch(setProducts(data));
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
      setError("Не удалось загрузить товары. Пожалуйста, попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <main className={style.homeContainer}>
      <Banner />
      {isLoading ? (
        <div className={style.loading}>Загрузка товаров...</div>
      ) : error ? (
        <div className={style.error}>{error}</div>
      ) : (
        <ProductsMain />
      )}
      <SpecialOffers />
      <MapComponent />
    </main>
  );
};

export default Home;
