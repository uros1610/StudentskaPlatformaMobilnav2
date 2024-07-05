// App.js

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContextProvider } from './context/AuthContext';
import { PredmetContextProvider } from './context/PredmetContext';
import setupInterceptors from './interceptor';
import Login from './components/Login';
import MainStack from './screens/MainStack';
import Profile from './screens/profile'

const Stack = createNativeStackNavigator();

const App = () => {
  useEffect(() => {
    setupInterceptors();
  }, []);

  return (
    <AuthContextProvider>
      <PredmetContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName = "Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainStack" component={MainStack} />
            <Stack.Screen name="Login" component={Login} />
          </Stack.Navigator>
        </NavigationContainer>
      </PredmetContextProvider>
    </AuthContextProvider>
  );
};

export default App;
