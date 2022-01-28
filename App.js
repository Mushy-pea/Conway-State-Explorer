import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen.js';
import ColourOptionsScreen from './ColourOptionsScreen.js';
import { MainMenu, DisplayMenu, GameMenu } from './MenuStructure.js';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainScreen" component={MainScreen}/>
        <Stack.Screen name="MainMenu" component={MainMenu}/>
        <Stack.Screen name="DisplayMenu" component={DisplayMenu}/>
        <Stack.Screen name="GameMenu" component={GameMenu}/>
        <Stack.Screen name="ColourOptionsScreen" component={ColourOptionsScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
