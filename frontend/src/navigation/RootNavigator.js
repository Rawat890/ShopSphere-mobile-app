import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Animated } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { restoreSession } from '../store/slices/authSlice';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrdersScreen from '../screens/OrdersScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS } from '../theme/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CartTabIcon({ color, size }) {
  const items = useSelector((state) => state.cart.items);
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const bounceAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (totalCount > 0) {
      Animated.sequence([
        Animated.spring(bounceAnim, { toValue: 1.3, useNativeDriver: true, speed: 30 }),
        Animated.spring(bounceAnim, { toValue: 1, useNativeDriver: true, speed: 25 })
      ]).start();
    }
  }, [totalCount]);

  return (
    <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
      <Ionicons name="cart-outline" size={size} color={color} />
    </Animated.View>
  );
}

function MainTabs() {
  const cartItems = useSelector((state) => state.cart.items);
  const badgeCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'CartTab') {
            return <CartTabIcon color={color} size={size} />;
          }
          let iconName = 'home-outline';
          if (route.name === 'HomeTab') iconName = focused ? 'home' : 'home-outline';
          if (route.name === 'OrdersTab') iconName = focused ? 'receipt' : 'receipt-outline';
          if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Explore' }} />
      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: 'Cart',
          tabBarBadge: badgeCount > 0 ? badgeCount : undefined
        }}
      />
      <Tab.Screen name="OrdersTab" component={OrdersScreen} options={{ title: 'Orders' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated, initializing } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
  }, []);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Wishlist" component={WishlistScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
