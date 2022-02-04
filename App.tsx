import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen';
import {ColourSelectionScreen} from './ColourOptionsScreens';
import { MainMenu, DisplayMenu, GameMenu, BoardColourOptionsMenu,
         CellColourOptionsMenu } from './MenuStructure';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="MainScreen" component={MainScreen}/>
        <Stack.Screen name="MainMenu" component={MainMenu}/>
        <Stack.Screen name="DisplayMenu" component={DisplayMenu}/>
        <Stack.Screen name="GameMenu" component={GameMenu}/>
        <Stack.Screen name="BoardColourOptionsMenu" component={BoardColourOptionsMenu}/>
        <Stack.Screen name="CellColourOptionsMenu" component={CellColourOptionsMenu}/>
        <Stack.Screen name="ColourSelectionScreen" component={ColourSelectionScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
