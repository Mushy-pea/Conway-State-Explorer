import React from 'react';
import Menu from './react-components/MenuScreen.js';
import { control } from './logic-components/StateController.js';

function disabledCheck(text, route) {
  if (text === null || route === null) {return true}
}

// The MenuArray type is used to configure the Menu component.
function MenuArray(route0, text0, colour0, route1, text1, colour1, route2, text2, colour2,
                   route3, text3, colour3) {
  return [
    {
      text: text0,
      route: route0,
      colour: colour0,
      disabled: () => {
        return disabledCheck(text0, route0);
      }
    },
    {
      text: text1,
      route: route1,
      colour: colour1,
      disabled: () => {
        return disabledCheck(text1, route1);
      }
    },
    {
      text: text2,
      route: route2,
      colour: colour2,
      disabled: () => {
        return disabledCheck(text2, route2);
      }
    },
    {
      text: text3,
      route: route3,
      colour: colour3,
      disabled: () => {
        return disabledCheck(text3, route3);
      }
    }
  ];
}

// All the menu screens are constructed here using the Menu component and imported by App for
// use in the stack navigator.
const MainMenu = ({navigation}) => {
  const menuArray = new MenuArray("DisplayMenu", "Display options", "rgb(0, 0, 0)",
                                  "GameMenu", "Game options", "rgb(0, 0, 0)",
                                  null, "", "rgb(0, 0, 0)",
                                  null, "", "rgb(0, 0, 0)");
  return (
    <>
      <Menu navigation={navigation}
            menuArray={menuArray}/>
    </>
  );
};

const DisplayMenu = ({navigation}) => {
  const menuArray = new MenuArray("ColourOptionsMenu", "Colour options", "rgb(0, 0, 0)",
                                  "GraphOptionsScreen", "Graph options", "rgb(0, 0, 0)",
                                  null, "", "rgb(0, 0, 0)",
                                  null, "", "rgb(0, 0, 0)");
  return (
    <>
      <Menu navigation={navigation}
            menuArray={menuArray}/>
    </>
  );
};

const GameMenu = ({navigation}) => {
  const menuArray = new MenuArray("BoardSize", "Board size", "rgb(0, 0, 0)",
                                  "LoadPattern", "Load pattern", "rgb(0, 0, 0)",
                                  "SavePattern", "Save pattern", "rgb(0, 0, 0)",
                                  "SetGameRules", "Set game rules", "rgb(0, 0, 0)");
  return (
    <>
      <Menu navigation={navigation}
            menuArray={menuArray}/>
    </>
  );
};

const ColourOptionsMenu = ({navigation}) => {
  console.log("ColourOptionsMenu");
  const gdColour = control.getGridColour();
  const bkColour = control.getBackgroundColour();
  const menuArray =
    new MenuArray("GridColourScreen", "Set grid colour (current colour below)",
                  "rgb(0, 0, 0)",
                  null, "",
                  `rgb(${gdColour.red * 255}, ${gdColour.green * 255}, ${gdColour.blue * 255})`,
                  "BackgroundColourScreen", "Set background colour (current colour below)",
                  "rgb(0, 0, 0)",
                  null, "",
                  `rgb(${bkColour.red * 255}, ${bkColour.green * 255}, ${bkColour.blue * 255})`);
  return (
    <>
      <Menu navigation={navigation}
            menuArray={menuArray}/>
    </>
  );
};

export {MainMenu, DisplayMenu, GameMenu, ColourOptionsMenu};
