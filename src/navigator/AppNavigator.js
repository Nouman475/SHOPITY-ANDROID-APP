import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome
import HomeScreen from '../screens/HomeScreen';

import SettingsScreen from '../screens/SettingsScreens';
import AddItemScreen from '../screens/addScreen';
import orderScreen from '../screens/orderScreen';
import trackOrders from '../screens/trackOrders';
import HomeStackNavigator from './stackNavigation';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'add') {
              iconName = 'plus';
            } else if (route.name === 'Settings') {
              iconName = 'cogs';
            }
            else if (route.name === 'orders') {
              iconName = 'shopping-cart';
            }
            else if (route.name === 'track') {
              iconName = 'compass';
            }

            // Return the FontAwesome icon
            return <FontAwesome name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'purple',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeStackNavigator}  options={{headerShown:false}} />
        <Tab.Screen name="orders" component={orderScreen} options={{headerShown:false}} />
        <Tab.Screen name="add" component={AddItemScreen} options={{headerShown:false}} />
        <Tab.Screen name="track" component={trackOrders} options={{headerShown:false}} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{headerShown:false}} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
