import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';

// Create Context
const CartContext = createContext();

// Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from AsyncStorage when the app loads
  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cartItems');
        if (storedCart) setCartItems(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to load cart items:', e);
      }
    };

    loadCartItems();
  }, []);

  // Add item to cart
  const addToCart = async (item) => {
    try {
      const updatedCart = [...cartItems, item];
      setCartItems(updatedCart);
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart));
      ToastAndroid.show('Item added to cart!', ToastAndroid.SHORT);
    } catch (e) {
      console.error('Failed to add item to cart:', e);
    }
  };

  // Remove a specific item from the cart
  const removeFromCart = async (itemId) => {
    try {
      const updatedCart = cartItems.filter((item) => item.product._id !== itemId); // Filter out the item
      setCartItems(updatedCart); // Update state
      await AsyncStorage.setItem('cartItems', JSON.stringify(updatedCart)); // Persist changes
    } catch (e) {
      console.error('Failed to remove item from cart:', e);
    }
  };

  // Clear all cart items
  const clearCart = async () => {
    try {
      setCartItems([]); // Clear cart state
      await AsyncStorage.removeItem('cartItems'); // Remove cart items from AsyncStorage
      ToastAndroid.show('Cart cleared!', ToastAndroid.SHORT);
    } catch (e) {
      console.error('Failed to clear cart:', e);
    }
  };

  // Get all cart items
  const getAllCartItems = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cartItems');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (e) {
      console.error('Failed to fetch cart items:', e);
      ToastAndroid.show('Fail to fetch', ToastAndroid.SHORT);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart, 
        getAllCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook to use Cart Context
export const useCart = () => useContext(CartContext);
