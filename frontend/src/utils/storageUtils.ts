import Cookies from 'js-cookie';
import { useState } from 'react';

// Константы для работы с куками
export const COOKIE_CONFIG = {
    CART_KEY: "cart",
    FAVORITES_KEY: "favorites_items",
    EXPIRES_DAYS: 7,
} as const;

/**
 * Загружает данные из куки по указанному ключу
 * @param key Ключ куки
 * @returns Данные из куки или пустой массив, если кука не найдена
 */
export const loadFromCookies = <T>(key: string): T[] => {
    const data = Cookies.get(key);
    return data ? JSON.parse(data) : [];
};

/**
 * Сохраняет данные в куку по указанному ключу
 * @param key Ключ куки
 * @param data Данные для сохранения
 */
export const saveToCookies = <T>(key: string, data: T[]): void => {
    Cookies.set(key, JSON.stringify(data), {
        expires: COOKIE_CONFIG.EXPIRES_DAYS
    });
};

/**
 * Удаляет куку по указанному ключу
 * @param key Ключ куки
 */
export const removeCookie = (key: string): void => {
    Cookies.remove(key);
};

/**
 * Находит элемент в массиве по id
 * @param items Массив элементов
 * @param id Идентификатор элемента
 * @returns Найденный элемент или undefined
 */
export const findItemById = <T extends { id: number }>(items: T[], id: number): T | undefined => {
    return items.find((item) => item.id === id);
};

/**
 * Хук для работы с localStorage
 * @param key Ключ для хранения данных
 * @param initialValue Начальное значение
 * @returns Массив с текущим значением и функцией для его обновления
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Ошибка чтения localStorage", error);
            return initialValue;
        }
    });

    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Ошибка записи в localStorage", error);
        }
    };

    return [storedValue, setValue] as const;
} 