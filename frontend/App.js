

// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './redux/store';
import './translations/i18n';
import LanguageSelect from './screens/LanguageSelect';
import Login from './screens/Login';
import Signup from './screens/Signup'
import CreateListing from './screens/CreateListing';
import CategoryScreen from './screens/CategoryScreen';
import MessagingNavigator from './navigation/BottomNavigator';

const Stack = createStackNavigator();

// Main App component with navigation
const AppContent = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LanguageSelect"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="LanguageSelect" component={LanguageSelect} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="MainApp" component={MessagingNavigator} />
        <Stack.Screen name="CreateListing" component={CreateListing} />
        <Stack.Screen name="CategoryScreen" component={CategoryScreen} />
        <Stack.Screen name="Messages" component={MessagingNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Root component with Redux Provider
const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;