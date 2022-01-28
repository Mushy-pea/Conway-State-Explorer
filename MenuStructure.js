import React from 'react';
import Menu from './react-components/MenuScreen.js';

function disabledCheck(text, route) {
  if (text === null || route === null) {return true}
}

// The MenuArray type is used to configure the Menu component.
function MenuArray(route0, text0, route1, text1, route2, text2, route3, text3) {
  return [
    {
      text: text0,
      route: route0,
      disabled: () => {
        return disabledCheck(text0, route0);
      }
    },
    {
      text: text1,
      route: route1,
      disabled: () => {
        return disabledCheck(text1, route1);
      }
    },
    {
      text: text2,
      route: route2,
      disabled: () => {
        return disabledCheck(text2, route2);
      }
    },
    {
      text: text3,
      route: route3,
      disabled: () => {
        return disabledCheck(text3, route3);
      }
    }
  ];
}

// All the menu screens are constructed here using the Menu component and imported by App for
// use in the stack navigator.
const MainMenu = ({navigation}) => {
  const menuArray = new MenuArray("DisplayMenu", "Display options",
                                  "GameMenu", "Game options",
                                  null, "",
                                  null, "");
  return (
    <>
      <Menu navigation={navigation}
            menuArray={menuArray}/>
    </>
  );
};

const DisplayMenu = ({navigation}) => {
  const menuArray = new MenuArray("ColourOptionsScreen", "Colour options",
                                  "GraphOptionsScreen", "Graph options",
                                  null, "",
                                  null, "");
  return (
    <>
      <Menu navigation={navigation}
            menuArray={menuArray}/>
    </>
  );
};

const GameMenu = ({navigation}) => {
  const menuArray = new MenuArray("BoardSize", "Board size",
                                  "LoadPattern", "Load pattern",
                                  "SavePattern", "Save pattern",
                                  "SetGameRules", "Set game rules");
  return (
    <>
      <Menu navigation={navigation}
            menuArray={menuArray}/>
    </>
  );
};

export {MainMenu, DisplayMenu, GameMenu};
