import React from 'react';
import Menu from './react-components/MenuScreen.js';

function disabledCheck(text, route) {
  if (text === null || route === null) {return true}
}

function createMenuArray(route0, text0, route1, text1, route2, text2, route3, text3) {
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

const MainMenu = ({navigation}) => {
  return (
    <>
      <Menu navigation={navigation}
            menuArray={createMenuArray("DisplayMenu", "Display options",
                                       "GameMenu", "Game options",
                                       null, "",
                                       null, "")}/>
    </>
  );
};

const DisplayMenu = ({navigation}) => {
  return (
    <>
      <Menu navigation={navigation}
            menuArray={createMenuArray("ColourOptions", "Colour options",
                                       "GraphOptions", "Graph options",
                                       null, "",
                                       null, "")}/>
    </>
  );
};

const GameMenu = ({navigation}) => {
  return (
    <>
      <Menu navigation={navigation}
            menuArray={createMenuArray("BoardSize", "Board size",
                                       "LoadPattern", "Load pattern",
                                       "SavePattern", "Save pattern",
                                       "SetGameRules", "Set game rules")}/>
    </>
  );
};

export {MainMenu, DisplayMenu, GameMenu};
