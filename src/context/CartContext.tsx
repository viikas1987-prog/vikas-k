import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product, CartItem, CustomEmbroidery } from '../types';
import { cozyAudio } from '../utils/audioSynth';
import { useStore } from './StoreContext';

interface CartContextType {
  cart: CartItem[];
  wishlist: string[]; // product IDs
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  addToCart: (
    product: Product,
    color?: { name: string; hex: string },
    size?: string,
    quantity?: number,
    embroidery?: CustomEmbroidery
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  toggleWishlist: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  freeGiftThreshold: number;
  hasFreeGift: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, products } = useStore();

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cozy-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('cozy-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const freeGiftThreshold = settings.freeGiftThreshold || 1499;

  // Keep cart items' product prices updated if admin changes them
  useEffect(() => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        const liveProduct = products.find((p) => p.id === item.product.id);
        if (liveProduct && liveProduct.price !== item.product.price) {
          return { ...item, product: { ...item.product, price: liveProduct.price } };
        }
        return item;
      })
    );
  }, [products]);

  useEffect(() => {
    localStorage.setItem('cozy-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cozy-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (
    product: Product,
    color?: { name: string; hex: string },
    size?: string,
    quantity: number = 1,
    embroidery?: CustomEmbroidery
  ) => {
    cozyAudio.playCelebration();
    const selectedColor = color || product.colors[0];
    const selectedSize = size || product.sizes[0] || 'One Size';
    const embroideryKey = embroidery ? `${embroidery.babyName}-${embroidery.threadColor}` : 'none';
    const cartItemId = `${product.id}-${selectedColor.name}-${selectedSize}-${embroideryKey}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          selectedColor,
          selectedSize,
          quantity,
          customEmbroidery: embroidery,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    cozyAudio.playSoftTap();
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    cozyAudio.playBubblePop();
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const toggleWishlist = (productId: string) => {
    cozyAudio.playSparkle();
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => {
    const embroideryFee = item.customEmbroidery ? 8 : 0;
    return total + (item.product.price + embroideryFee) * item.quantity;
  }, 0);

  const hasFreeGift = subtotal >= freeGiftThreshold;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        isCartOpen,
        isWishlistOpen,
        setIsCartOpen,
        setIsWishlistOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        clearCart,
        cartCount,
        subtotal,
        freeGiftThreshold,
        hasFreeGift,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};