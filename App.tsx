import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from './logic-components/StateController';
import { MainScreen } from './MainScreen';
import SetGameRulesScreen from './SetGameRulesScreen';
import { ColourSelectionScreen } from './ColourSelectionScreen';
import ShowCatalogueScreen from './ShowCatalogueScreen';
import LoadPatternScreen from './LoadPatternScreen';
import SharePatternScreen from './SharePatternScreen';
import { MainMenu, DisplayMenu, GameMenu, BoardColourOptionsMenu,
         CellColourOptionsMenu, GraphOptionsMenu } from './MenuStructure';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Main Screen" component={MainScreen}/>
          <Stack.Screen name="Main Menu" component={MainMenu}/>
          <Stack.Screen name="Display Menu" component={DisplayMenu}/>
          <Stack.Screen name="Game Menu" component={GameMenu}/>
          <Stack.Screen name="Board Colour Options" component={BoardColourOptionsMenu}/>
          <Stack.Screen name="Cell Colour Options" component={CellColourOptionsMenu}/>
          <Stack.Screen name="Graph Options" component={GraphOptionsMenu}/>
          <Stack.Screen name="Colour Selection Screen" component={ColourSelectionScreen}/>
          <Stack.Screen name="Set Game Rules Screen" component={SetGameRulesScreen}/>
          <Stack.Screen name="Show Catalogue Screen" component={ShowCatalogueScreen}/>
          <Stack.Screen name="Load Pattern Screen" component={LoadPatternScreen}/>
          <Stack.Screen name="Share Pattern Screen" component={SharePatternScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;

