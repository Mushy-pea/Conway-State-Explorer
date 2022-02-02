import React, { useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import Menu from './react-components/MenuScreen';
import { control } from './logic-components/StateController';

// This is a helper function for MenuArray.
function disabledCheck(text : string, route : (() => void) | null) : boolean {
  if (text === null || route === null) {return true}
  else {return false}
}

// The MenuArray type is used to configure the Menu component.
function MenuArray(action0 : (() => void) | null, text0 : string, fontSize0 : number,
                   colour0 : string,
                   action1 : (() => void) | null, text1 : string, fontSize1 : number,
                   colour1 : string,
                   action2 : (() => void) | null, text2 : string, fontSize2 : number,
                   colour2 : string,
                   action3 : (() => void) | null, text3 : string, fontSize3 : number,
                   colour3 : string,
                   action4 : (() => void) | null, text4 : string, fontSize4 : number,
                   colour4 : string,
                   action5 : (() => void) | null, text5 : string, fontSize5 : number,
                   colour5 : string)
                   : object {
  return [
    {
      text: text0,
      fontSize: fontSize0,
      action: action0,
      colour: colour0,
      disabled: () => {
        return disabledCheck(text0, action0);
      }
    },
    {
      text: text1,
      fontSize: fontSize1,
      action: action1,
      colour: colour1,
      disabled: () => {
        return disabledCheck(text1, action1);
      }
    },
    {
      text: text2,
      fontSize: fontSize2,
      action: action2,
      colour: colour2,
      disabled: () => {
        return disabledCheck(text2, action2);
      }
    },
    {
      text: text3,
      fontSize: fontSize3,
      action: action3,
      colour: colour3,
      disabled: () => {
        return disabledCheck(text3, action3);
      }
    },
    {
        text: text4,
        fontSize: fontSize4,
        action: action4,
        colour: colour4,
        disabled: () => {
          return disabledCheck(text4, action4);
        }
    },
    {
      text: text5,
      fontSize: fontSize5,
      action: action5,
      colour: colour5,
      disabled: () => {
        return disabledCheck(text5, action5);
    }
  }
  ];
}

// All the menu screens are constructed here using the Menu component and imported by App for
// use in the stack navigator.
const MainMenu = ({navigation}) => {
  const menuArray = MenuArray(() => navigation.navigate("DisplayMenu"), "Display options", 24,
                              "rgb(0, 0, 0)",
                              () => navigation.navigate("GameMenu"), "Game options", 24,
                              "rgb(0, 0, 0)",
                              null, "", 24, "rgb(0, 0, 0)",
                              null, "", 24, "rgb(0, 0, 0)",
                              null, "", 24, "rgb(0, 0, 0)",
                              null, "", 24, "rgb(0, 0, 0)",);
  return (
    <>
      <Menu menuArray={menuArray}/>
    </>
  );
};

const DisplayMenu = ({navigation}) => {
  const menuArray = MenuArray(() => navigation.navigate("BoardColourOptionsMenu"),
                              "Board colour options", 24, "rgb(0, 0, 0)",
                              () => navigation.navigate("CellColourOptionsMenu"),
                              "Cell colour options", 24, "rgb(0, 0, 0)",
                              () => navigation.navigate("GraphOptions"), "Graph options", 24,
                              "rgb(0, 0, 0)",
                              null, "", 24, "rgb(0, 0, 0)",
                              null, "", 24, "rgb(0, 0, 0)",
                              null, "", 24, "rgb(0, 0, 0)");
  return (
    <>
      <Menu menuArray={menuArray}/>
    </>
  );
};

const GameMenu = ({navigation}) => {
  const menuArray = MenuArray(() => navigation.navigate("BoardSize"), "Board size" , 24,
                              "rgb(0, 0, 0)",
                              () => navigation.navigate("LoadPattern"), "Load pattern", 24,
                              "rgb(0, 0, 0)",
                              () => navigation.navigate("SavePattern"), "Save pattern", 24,
                              "rgb(0, 0, 0)",
                              () => navigation.navigate("SetGameRules"), "Set game rules", 24,
                              "rgb(0, 0, 0)",
                              null, "",  24, "rgb(0, 0, 0)",
                              null, "",  24, "rgb(0, 0, 0)");
  return (
    <>
      <Menu menuArray={menuArray}/>
    </>
  );
};

const BoardColourOptionsMenu = ({navigation}) => {
  const isFocused = useIsFocused();
  const gdColour = control.getGridColour();
  const bkColour = control.getBackgroundColour();
  const menuArray =
    MenuArray(() => navigation.navigate("GridColourScreen"),
              "Set grid colour (current colour below)", 24, "rgb(0, 0, 0)",
              null, "", 24,
              `rgb(${gdColour.red * 255}, ${gdColour.green * 255}, ${gdColour.blue * 255})`,
              () => navigation.navigate("BackgroundColourScreen"),
              "Set background colour (current colour below)", 24, "rgb(0, 0, 0)",
              null, "", 24,
              `rgb(${bkColour.red * 255}, ${bkColour.green * 255}, ${bkColour.blue * 255})`,
              null, "",  24, "rgb(0, 0, 0)",
              null, "",  24, "rgb(0, 0, 0)");
  return (
    <>
      <Menu menuArray={menuArray}/>
    </>
  );
};

function updateEnabledSwitch(enabled : boolean,
                             setEnabled : React.Dispatch<React.SetStateAction<boolean>>) : void {
  setEnabled(! enabled);
  control.setColourFadeSet(enabled, null, null, null, null, null, null);
}

const CellColourOptionsMenu = ({navigation}) => {
  const isFocused = useIsFocused();
  const [enabled, setEnabled] = useState(false);
  const {redStart, redRate, greenStart, greenRate, blueStart, blueRate} =
    control.getColourFadeSet(1);
  const menuArray =
    MenuArray(null,
              "Enable age based colour fade.  Cells will fade between the two selected colours over three seconds, based on the time since their birth",
              12, "rgb(0, 0, 0)",
              () => updateEnabledSwitch(enabled, setEnabled),
              `${enabled ? "Disable" : "Enable"}`, 24, "rgb(0, 0, 0)",
              () => navigation.navigate("SetColour1Screen"), "Set colour 1",
              24, `rgb(${redStart * 255}, ${greenStart * 255}, ${blueStart * 255})`,
              () => navigation.navigate("SetColour2Screen"), "Set colour 2", 24,
              `rgb(${(redStart + redRate * 15) * 255}, ${(greenStart + greenRate * 15) * 255}, ${(blueStart + blueRate * 15) * 255})`,
              null, "",
              24, "rgb(0, 0, 0)",
              null, "", 24,
              "rgb(0, 0, 0)");
  return (
    <>
      <Menu menuArray={menuArray}/>
    </>
  );
};

export {MainMenu, DisplayMenu, GameMenu, BoardColourOptionsMenu, CellColourOptionsMenu};
