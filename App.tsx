import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './MainScreen';
import { GridColourScreen, BackgroundColourScreen, SetColour1Screen, SetColour2Screen }
from './ColourOptionsScreens';
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
        <Stack.Screen name="GridColourScreen" component={GridColourScreen}/>
        <Stack.Screen name="BackgroundColourScreen" component={BackgroundColourScreen}/>
        <Stack.Screen name="SetColour1Screen" component={SetColour1Screen}/>
        <Stack.Screen name="SetColour2Screen" component={SetColour2Screen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
