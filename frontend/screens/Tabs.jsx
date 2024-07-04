import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faBell, faBook, faPoll, faCalendar } from '@fortawesome/free-solid-svg-icons';
import TabIcon from '../components/TabIcon';
import Calendar from './calendar';
import Materials from './materials';
import Profile from './profile';
import Results from './results';
import NotificationsMainPage from '../components/NotificationsMainPage';
import Notifications from './notifications'

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                tabBarInactiveTintColor: '#0f75bd',
                tabBarActiveTintColor: '#f7941d',
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: 'rgb(240,240,240)',
                    height: 84
                }
            }}
        >
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon icon={faUser} color={color} name="Profil" focused={focused} />
                    ),
                    headerShown: false 
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={Notifications}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon icon={faBell} color={color} name="Obavještenja" focused={focused} />
                    ),
                    headerShown: false 
                }}
            />
            <Tab.Screen
                name="Materials"
                component={Materials}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon icon={faBook} color={color} name="Materijali" focused={focused} />
                    ),
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Results"
                component={Results}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon icon={faPoll} color={color} name="Rezultati" focused={focused} />
                    ),
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Calendar"
                component={Calendar}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon icon={faCalendar} color={color} name="Kalendar" focused={focused} />
                    ),
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    );
};

export default Tabs;
