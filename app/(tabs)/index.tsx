import * as React from 'react';
import { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { Image } from 'react-native';

// Screens
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ChatScreen from './ChatScreen';
import ContactsScreen from './ContactsScreen';
import WishlistScreen from './WishlistScreen';
import UserScreen from './UserScreen';
import ReviewScreen from './ReviewScreen';
import AddReviewScreen from './AddReviewScreen';
import ResetPasswordScreen from './ResetPasswordScreen';
import ListingForm from './ListingForm';
import PreviewListing from './PreviewListing';
import PropertyScreen from './PropertyScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="ListingForm" component={ListingForm} />
      <Stack.Screen name="PreviewListing" component={PreviewListing} />
      <Stack.Screen name="PropertyScreen" component={PropertyScreen} />
      <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
      <Stack.Screen name="AddReviewScreen" component={AddReviewScreen} />
    </Stack.Navigator>
  );
}

function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ContactsScreen" component={ContactsScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
  );
}

function LoginStack({ setIsAuthenticated }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen">
        {props => <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Stack.Screen>
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

function MyTabs({ setIsAuthenticated }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let imageSource;

          if (route.name === 'HomeStack') {
            imageSource = require('../../assets/images/search.png');
          } else if (route.name === 'Chat') {
            imageSource = require('../../assets/images/chat.png');
          } else if (route.name === 'UserScreen') {
            imageSource = require('../../assets/images/user.png');
          } else if (route.name === 'WishlistScreen') {
            imageSource = require('../../assets/images/star.png');
          }

          return (
            <Image
              source={imageSource}
              style={{ width: size, height: size, marginTop: 20, tintColor: focused ? '#39FF14' : 'gray' }}
              resizeMode="contain"
            />
          );
        },
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#39FF14',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: 'black',
        },
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="UserScreen">
        {props => <UserScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </Tab.Screen>
      <Tab.Screen name="WishlistScreen" component={WishlistScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <PaperProvider>
      {isAuthenticated ? (
        <MyTabs setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <LoginStack setIsAuthenticated={setIsAuthenticated} />
      )}
    </PaperProvider>
  );
}