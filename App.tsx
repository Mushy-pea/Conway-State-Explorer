import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen.tsx';
import { GridColourScreen, BackgroundColourScreen } from './ColourOptionsScreens.tsx';
import { MainMenu, DisplayMenu, GameMenu, ColourOptionsMenu } from './MenuStructure.tsx';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainScreen" component={MainScreen}/>
        <Stack.Screen name="MainMenu" component={MainMenu}/>
        <Stack.Screen name="DisplayMenu" component={DisplayMenu}/>
        <Stack.Screen name="GameMenu" component={GameMenu}/>
        <Stack.Screen name="ColourOptionsMenu" component={ColourOptionsMenu}/>
        <Stack.Screen name="GridColourScreen" component={GridColourScreen}/>
        <Stack.Screen name="BackgroundColourScreen" component={BackgroundColourScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
