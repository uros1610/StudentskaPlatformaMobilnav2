// screens/MainStack.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './Tabs';

import NotificationsMainPage from '../components/NotificationsMainPage';

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="NotificationsMainPage" component={NotificationsMainPage} />
      
    </Stack.Navigator>
  );
};

export default MainStack;
