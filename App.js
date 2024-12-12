import React from 'react';
import AppNavigator from './src/navigator/AppNavigator';

import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {AuthProvider, useAuth} from './src/context/authContext';
import AuthRoutes from './src/screens/auth/authRoutes';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {CartProvider} from './src/context/cartContext';
import {WishlistProvider} from './src/context/wishlistContext';

const AppContent = () => {
  const {isAuthenticated, isLoading} = useAuth(); // Access isAuthenticated and isLoading from AuthProvider

  if (isLoading) {
    // Show a loading spinner while authentication status is being checked
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Render AppNavigator if authenticated, otherwise render AuthRoutes
  return isAuthenticated ? <AppNavigator /> : <AuthRoutes />;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <GestureHandlerRootView style={{flex: 1}}>
            <AppContent />
          </GestureHandlerRootView>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;

// Add styles for the loading spinner
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
