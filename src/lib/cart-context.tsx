"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { QuoteItem } from "@/types";

interface CartContextType {
  items: QuoteItem[];
  addItem: (item: Omit<QuoteItem, "cartId">) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  totalQuantity: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  lastAddedItem: QuoteItem | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "criativo_artes_quote_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<QuoteItem | null>(null);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed.filter((item): item is QuoteItem =>
            item && typeof item === "object" &&
            ["cartId", "productId", "productSlug", "productName", "categoryName", "image"].every(key => typeof item[key] === "string") &&
            Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 100000 &&
            (item.price === undefined || (typeof item.price === "number" && Number.isFinite(item.price) && item.price >= 0)) &&
            ["customNamePhrase", "customTheme", "customObservations"].every(key => item[key] === undefined || typeof item[key] === "string")
          ).slice(0, 100));
        }
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items, isLoaded]);

  const addItem = (newItemData: Omit<QuoteItem, "cartId">) => {
    const cartId = `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const fullItem: QuoteItem = { ...newItemData, cartId };

    setItems((prev) => [...prev, fullItem]);
    setLastAddedItem(fullItem);
    setIsDrawerOpen(true);
  };

  const removeItem = (cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (!Number.isFinite(quantity)) return;
    quantity = Math.min(100000, Math.trunc(quantity));
    if (quantity <= 0) {
      removeItem(cartId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalQuantity = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalQuantity,
        isDrawerOpen,
        setIsDrawerOpen,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
