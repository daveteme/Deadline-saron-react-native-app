// navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// Import screens
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import PostItem from '../screens/PostItem';
import SavedScreen from '../screens/SavedScreen';
import Notifications from '../screens/Notifications'

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { t } = useTranslation();
  const unreadNotifications = useSelector(state => state.notifications?.unreadCount || 0);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Saved') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Post') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5eaaa8',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        options={{ 
          headerShown: false,
          title: t('home') || 'Home'
        }} 
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedScreen} 
        options={{ 
          headerShown: false,
          title: t('saved') || 'Saved'
        }} 
      />
      <Tab.Screen 
        name="Post" 
        component={PostItem} 
        options={{ 
          headerShown: false,
          title: t('post') || 'Post'
        }} 
      />
      <Tab.Screen 
        name="Notifications" 
        component={Notifications} 
        options={{ 
          headerShown: false,
          title: t('notifications') || 'Notifications',
          tabBarBadge: unreadNotifications > 0 ? unreadNotifications : null 
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{ 
          headerShown: false,
          title: t('profile') || 'Profile'
        }} 
      />
    </Tab.Navigator>
  );
};


export default BottomTabNavigator;