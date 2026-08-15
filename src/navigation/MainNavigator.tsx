import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { WatchlistScreen } from '../screens/WatchlistScreen';

type StackParamList = {
  Home: undefined;
  Details: { item: any };
};

type WatchlistStackParamList = {
  WatchlistHome: undefined;
  Details: { item: any };
};

type ProfileStackParamList = {
  ProfileHome: undefined;
  Details: { item: any };
};

const HomeStackNav = createNativeStackNavigator<StackParamList>();
const WatchlistStackNav = createNativeStackNavigator<WatchlistStackParamList>();
const ProfileStackNav = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator();

const stackScreenOptions = {
  headerStyle: { backgroundColor: '#000' },
  headerTintColor: '#fff',
  headerTitleStyle: { color: '#fff' },
};

function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={stackScreenOptions}>
      <HomeStackNav.Screen name="Home" component={HomeScreen} options={{ title: 'WatchVerse' }} />
      <HomeStackNav.Screen name="Details" component={DetailsScreen} options={{ title: 'Details' }} />
    </HomeStackNav.Navigator>
  );
}

function WatchlistStack() {
  return (
    <WatchlistStackNav.Navigator screenOptions={stackScreenOptions}>
      <WatchlistStackNav.Screen name="WatchlistHome" component={WatchlistScreen} options={{ title: 'My Watchlist' }} />
      <WatchlistStackNav.Screen name="Details" component={DetailsScreen} options={{ title: 'Details' }} />
    </WatchlistStackNav.Navigator>
  );
}

function ProfileStack() {
  return (
    <ProfileStackNav.Navigator screenOptions={stackScreenOptions}>
      <ProfileStackNav.Screen name="ProfileHome" component={ProfileScreen} options={{ title: 'Profile' }} />
      <ProfileStackNav.Screen name="Details" component={DetailsScreen} options={{ title: 'Details' }} />
    </ProfileStackNav.Navigator>
  );
}

export const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#1e1e1e', borderTopWidth: 0 },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="WatchlistTab"
        component={WatchlistStack}
        options={{
          tabBarLabel: 'Watchlist',
          tabBarIcon: ({ color, size }) => (
            <Icon name="heart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
