import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import wishlist from '../screens/wishlist';
import cartScreen from '../screens/cartScreen';
import productPreview from '../screens/productPreview';

const HomeStack = createStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Wishlist"
        component={wishlist}
        options={{
          title: 'My Wishlist',
          headerStyle: {
            backgroundColor: '#f4f4f4',
          },
          headerTintColor: '#000',
        }}
      />
      <HomeStack.Screen
        name="Product"
        component={productPreview}
      />
      <HomeStack.Screen
        name="Cart"
        component={cartScreen}
        options={{
          title: 'Shopping Cart',
          headerStyle: {
            backgroundColor: '#f4f4f4',
          },
          headerTintColor: '#000',
        }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigator;