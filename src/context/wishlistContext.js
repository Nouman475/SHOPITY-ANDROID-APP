import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';

// Create Context
const WishlistContext = createContext();

// Provider Component
export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load wishlist items from AsyncStorage when the app loads
  useEffect(() => {
    const loadWishlistItems = async () => {
      try {
        const storedWishlist = await AsyncStorage.getItem('wishlistItems');
        if (storedWishlist) setWishlistItems(JSON.parse(storedWishlist));
      } catch (e) {
        console.error('Failed to load wishlist items:', e);
      }
    };

    loadWishlistItems();
  }, []);

  // Add item to wishlist
  const addToWishlist = async (item) => {
    try {
      const updatedWishlist = [...wishlistItems, item];
      setWishlistItems(updatedWishlist);
      await AsyncStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      ToastAndroid.show('Item added to wishlist!', ToastAndroid.SHORT);
    } catch (e) {
      console.error('Failed to add item to wishlist:', e);
    }
  };

// Remove item from wishlist
const removeFromWishlist = async (itemId) => {
  try {
    const updatedWishlist = wishlistItems.filter((item) => item.product._id !== itemId);
    setWishlistItems(updatedWishlist);
    await AsyncStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
    ToastAndroid.show('Item removed from wishlist!', ToastAndroid.SHORT);
  } catch (e) {
    console.error('Failed to remove item from wishlist:', e);
  }
};

  // Get all wishlist items
  const getAllWishlistItems = async () => {
    try {
      const storedWishlist = await AsyncStorage.getItem('wishlistItems');
      return storedWishlist ? JSON.parse(storedWishlist) : [];
    } catch (e) {
      console.error('Failed to fetch wishlist items:', e);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        getAllWishlistItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

// Custom Hook to use Wishlist Context
export const useWishlist = () => useContext(WishlistContext);
