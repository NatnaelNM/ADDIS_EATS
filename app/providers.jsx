"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);
const CART_STORAGE_KEY = "addis-eats-cart-v1";
const FAVORITES_STORAGE_KEY = "addis-eats-favorites-v1";

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside the Providers component.");
  }

  return context;
}

export default function Providers({ children }) {
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];

      if (Array.isArray(parsedCart)) {
        setItems(parsedCart.filter((item) => item && typeof item.id === "string" && Number.isInteger(item.quantity) && item.quantity > 0));
      }
      const savedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      const parsedFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];
      if (Array.isArray(parsedFavorites)) setFavorites([...new Set(parsedFavorites.filter((id) => typeof id === "string"))]);
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      window.localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [hydrated, items, favorites]);

  const addItem = useCallback((dish) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === dish.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { id: dish.id, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback((dishId, quantity) => {
    setItems((currentItems) => {
      if (quantity < 1) {
        return currentItems.filter((item) => item.id !== dishId);
      }

      return currentItems.map((item) =>
        item.id === dishId ? { ...item, quantity } : item,
      );
    });
  }, []);

  const removeItem = useCallback((dishId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== dishId),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const toggleFavorite = useCallback((dishId) => {
    setFavorites((current) => current.includes(dishId) ? current.filter((id) => id !== dishId) : [...current, dishId]);
  }, []);

  const cartValue = useMemo(
    () => ({
      items,
      favorites,
      hydrated,
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      toggleFavorite,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    [items, favorites, hydrated, addItem, setQuantity, removeItem, clearCart, toggleFavorite],
  );

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
}
