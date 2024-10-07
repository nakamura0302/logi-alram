import React, { useEffect } from 'react';
import { NavigationContainer,  useNavigationContainerRef,} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, useColorScheme, LogBox, TouchableOpacity, Image} from 'react-native';

import Welcome from './src/screens/Welcome';
import List from './src/screens/List';
import AlarmCreator from './src/screens/AlarmCreator';

import { Database } from "./api/Database";

import * as  Notifications from 'expo-notifications';
import { colors } from './api/ColorPallete';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();

const App = () => {
  
  useEffect(() => { 
    Database.createTable(); console.log('created database');
    // handles the notification
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, [])

  const navigationRef = useNavigationContainerRef();

  const handleSignOut = (navigate) => {
    AsyncStorage.setItem('uid', '').then(() => {
      navigate('main'); // Navigate to "Welcome" after sign out
    });
  }

  return (
    <NavigationContainer  ref={navigationRef}>
      <Stack.Navigator initialRouteName="main" screenOptions={{ navigationBarColor: themes.colors.white, textAlign: 'center' }}>
        <Stack.Screen 
          name="main" 
          component={Welcome} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="list" 
          component={List} 
          options={{ 
            title: 'アラームリスト', 
            headerStyle: { backgroundColor: colors.blue },
            headerTintColor: 'white',
            headerBackVisible: false,
            headerRight: () => (
              <TouchableOpacity onPress={() => handleSignOut(navigationRef.navigate)}>
                  <Image style={[themes.logout]} source={require('./assets/logout.png')} />
              </TouchableOpacity>
            )
          }}
        />
        <Stack.Screen 
          name="creator" 
          component={AlarmCreator} 
          options={{ title: 'ラームを追加', 
          headerStyle: { backgroundColor: colors.blue }, 
          headerTintColor: 'white', }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const themes = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  colors: { black: '#000', white: 'white' },
  logout:{width:30, height:20, marginRight:10}
});

export default App;