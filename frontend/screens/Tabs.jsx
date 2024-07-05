import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faBell, faBook, faPoll, faCalendar } from '@fortawesome/free-solid-svg-icons';
import TabIcon from '../components/TabIcon';
import Calendar from './calendar';
import Materials from './materials';
import Profile from './profile';
import Results from './results';
import NotificationsMainPage from './NotificationsMainPage';
import Notifications from './notifications';
import MaterialsMainPage from './MaterialsMainPage';
import NewNotification from './NewNotification'
import AuthContext from '../context/AuthContext';
import InsertResults from './ResultsProfessor';
import InsertResultsOneSubject from './InsertResultsOneSubject';
import MaterialsProfessor from './MaterialsProfessor'
import EditMaterials from './EditMaterials';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const NotificationsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="NotificationsHome"
                component={Notifications} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="NotificationsMainPage" 
                component={NotificationsMainPage} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen
                name = "NewNotification"
                component={NewNotification}
                options={{headerShown:false}}

            />
        </Stack.Navigator>
    );
};


const ResultsStack = () => {
    return (
        <Stack.Navigator initialRouteName='InsertResults'>
            <Stack.Screen 
                name="InsertResults"
                component={InsertResults} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="InsertResultsOneSubject" 
                component={InsertResultsOneSubject} 
                options={{ headerShown: false }} 
            />
          
        </Stack.Navigator>
    );
};

const MaterialsStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="MaterialsHome"
                component={Materials} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="MaterialsMainPage" 
                component={MaterialsMainPage} 
                options={{ headerShown: false }} 
            />



        </Stack.Navigator>
    );
}

const MaterialsProfessorStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="MaterialsProfessor"
                component={MaterialsProfessor} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen 
                name="MaterialsMainPage" 
                component={MaterialsMainPage} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen
                name = "EditMaterials"
                component={EditMaterials}
                options={{headerShown:false}}
            />



        </Stack.Navigator>
    );
}
const Tabs = () => {
    const {user} = useContext(AuthContext);
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
                name="Notifications"
                component={NotificationsStack}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon icon={faBell} color={color} name="Obavještenja" focused={focused} />
                    ),
                    headerShown: false 
                }}
            />
            <Tab.Screen
                name="Materials"
                component={user && user.rola === 'Student' ? MaterialsStack : MaterialsProfessorStack}
                options={{
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon icon={faBook} color={color} name="Materijali" focused={focused} />
                    ),
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Results"
                component={user && user.rola === 'Student' ? Results : ResultsStack}
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
