// screens/MainStack.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './Tabs';

import NotificationsMainPage from './NotificationsMainPage';
import Notification from '../components/Notification'
import Profile from './profile'

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
      <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
};

export default MainStack;
