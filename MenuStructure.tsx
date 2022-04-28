import React, { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { determineColour } from './ColourSelectionScreen';
import Menu from './react-components/MenuScreen';
import { genRandomPattern, handleResetEvent } from './logic-components/GameLogic';
import { setGridColour, setBackgroundColour, setColourFadeSet, setShowGrid, setPatternName, store }
from './logic-components/StateController';
import { useAppDispatch, useAppSelector } from './Hooks';

// This is a helper function for MenuArray.
function disabledCheck(text : string, route : (() => void) | null) : boolean {
  if (text === null || route === null) {return true}
  else {return false}
}

// The MenuArray type is used to configure the Menu component.  Each menu item is optionally
// given an action to perform on selection, as well as the item text, textSize and
// background colour.
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
                   colour5 : string, nestedView)
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
   },
   {
     nestedView: nestedView
   }
  ];
}

// All the menu screens are constructed here using the Menu component and imported by App for
// use in the stack navigator.
const MainMenu = ({navigation}) => {
  const menuArray = MenuArray(
    () => navigation.navigate("Display Menu"), "Display Menu", 24, "rgb(0, 0, 0)",
    () => navigation.navigate("Game Menu"), "Game Menu", 24, "rgb(0, 0, 0)",
    () => navigation.navigate("User Policy Screen", {nextScreen: "Main Menu", redirected: false}),
    "User Policy Screen", 24, "rgb(0, 0, 0)",
    () => Linking.openURL("https://www.buymeacoffee.com/steventinsley"), "Support the Developer",
    24, "rgb(0, 0, 0)",
    null, "", 24, "rgb(0, 0, 0)",
    null, "", 24, "rgb(0, 0, 0)",
    null);
  return (
    <>
      <Menu menuArray={menuArray}/>
    </>
  );
};

const DisplayMenu = ({navigation}) => {
  const menuArray = MenuArray(
    () => navigation.navigate("Board Colour Options"), "Board colour options", 24, "rgb(0, 0, 0)",
    () => navigation.navigate("Cell Colour Options"), "Cell colour options", 24, "rgb(0, 0, 0)",
    () => navigation.navigate("Graph Options"), "Graph options", 24, "rgb(0, 0, 0)",
    null, "", 24, "rgb(0, 0, 0)",
    null, "", 24, "rgb(0, 0, 0)",
    null, "", 24, "rgb(0, 0, 0)",
    null);
  return (
    <>
      <Menu menuArray={menuArray}/>
    </>
  );
};

const GameMenu = ({navigation}) => {
  const isFocused = useIsFocused();
  const boardArraySize = store.getState().boardArraySize;
  const policyAgreedFlag = store.getState().policyAgreedFlag;
  const randomiseBoard = () => {
    handleResetEvent(boardArraySize, genRandomPattern(-80, 80));
    store.dispatch(setPatternName("Untitled"));
    navigation.navigate("Main Screen");
  };

  let screenRedirect = "User Policy Screen";
  if (policyAgreedFlag === "true") { screenRedirect = "Share Pattern Screen" }
  const menuArray = MenuArray(
    randomiseBoard, "Generate random pattern" , 24, "rgb(0, 0, 0)",
    () => navigation.navigate("Show Catalogue Screen"), "Load pattern", 24, "rgb(0, 0, 0)",
    () => navigation.navigate(screenRedirect, {nextScreen: "Share Pattern Screen", redirected: true}),
    "Share pattern", 24, "rgb(0, 0, 0)",
    () => navigation.navigate("Set Game Rules Screen"), "Set game rules", 24, "rgb(0, 0, 0)",
    null, "",  24, "rgb(0, 0, 0)",
    null, "",  24, "rgb(0, 0, 0)",
    null);
  return (
    <>
      <Menu menuArray={menuArray}/>
    </>
  );
};

const BoardColourOptionsMenu = ({navigation}) => {
  const isFocused = useIsFocused();
  const control_ = useAppSelector(state => state);
  const gdColour = control_.gridColour;
  const bkColour = control_.backgroundColour;
  const dispatch = useAppDispatch();
  const setGridColour_ = (red, green, blue, alpha) => {
    dispatch(setGridColour(red, green, blue, alpha));
  };
  const setBackgroundColour_ = (red, green, blue, alpha) => {
    dispatch(setBackgroundColour(red, green, blue, alpha));
  };
  const gridColourRequest = {
    text: "Set grid colour",
    action: color => {
      const {red, green, blue} = determineColour(color);
      setGridColour_(red, green, blue, 1);
    }
  };
  const backgroundColourRequest = {
    text: "Set background colour",
    action: 
      color => {
        const {red, green, blue} = determineColour(color);
        setBackgroundColour_(red, green, blue, 1);
      }
  };
  const menuArray =
    MenuArray(
      () => navigation.navigate("Colour Selection Screen", gridColourRequest),
      "Set grid colour (current colour below)", 24, "rgb(0, 0, 0)",
      null, "", 24, `rgb(${gdColour.red * 255}, ${gdColour.green * 255}, ${gdColour.blue * 255})`,
      () => navigation.navigate("Colour Selection Screen", backgroundColourRequest),
      "Set background colour (current colour below)", 24, "rgb(0, 0, 0)",
      null, "", 24, `rgb(${bkColour.red * 255}, ${bkColour.green * 255}, ${bkColour.blue * 255})`,
      null, "",  24, "rgb(0, 0, 0)",
      null, "",  24, "rgb(0, 0, 0)",
      null);
  return (
    <>
      <Menu menuArray={menuArray}/>
    </>
  );
};

// This component is used to run a demo animation of the colour fade by CellColourOptionsMenu.
const FadePreview = (redStart, redEnd, greenStart, greenEnd, blueStart, blueEnd) => {
  const phase = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          phase,
          {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false
          }
        )
      ]),
    {}).start()},
    [phase]);
  const colourFade = phase.interpolate({
    inputRange: [0, 1],
    outputRange: [`rgb(${redStart}, ${greenStart}, ${blueStart})`,
                  `rgb(${redEnd}, ${greenEnd}, ${blueEnd})`]
  });

  return (
    <Animated.View style={{flex: 1, backgroundColor: colourFade}}/>
  );
}

// This function implements the logic for enable / disable switches in the menus.
function updateEnabledSwitch(enabled : boolean, isEnabled : boolean,
                             setEnabled : (value) => void, updaterFunction) {
  setEnabled(! isEnabled);
  store.dispatch(updaterFunction(! enabled, null, null, null, null, null, null));
}

// This function updates the state of control.colourFadeSet after user input has been received
// by the SetColour1Screen or SetColour2Screen components.
function updateColourFade(red1, green1, blue1, red2, green2, blue2) {
  const redRate = (red2 - red1) / 15;
  const greenRate = (green2 - green1) / 15;
  const blueRate = (blue2 - blue1) / 15;
  store.dispatch(setColourFadeSet(null, red1, redRate, green1, greenRate, blue1, blueRate));
}

const CellColourOptionsMenu = ({navigation}) => {
  const isFocused = useIsFocused();
  const control_ = useAppSelector(state => state);
  const {enabled, redStart, redRate, greenStart, greenRate, blueStart, blueRate} =
    control_.colourFadeSet;
  const [isEnabled, setEnabled] = useState(enabled);
  const redEnd = (redStart + redRate * 15) * 255;
  const greenEnd = (greenStart + greenRate * 15) * 255;
  const blueEnd = (blueStart + blueRate * 15) * 255;
  const colour1Request = {
    text: "Set colour fade start colour",
    action: color => {
      const {red, green, blue} = determineColour(color);
      updateColourFade(red, green, blue, red + redRate * 15,
                         green + greenRate * 15, blue + blueRate * 15);
    }
  };
  const colour2Request = {
    text: "Set colour fade end colour",
    action: color => {
      const {red, green, blue} = determineColour(color);
      updateColourFade(redStart, greenStart, blueStart, red, green, blue);
    }
  };
  const menuArray =
    MenuArray(
      null,
      `Enable age based colour fade.  Cells will fade between the two selected colours over\
 three seconds, based on the time since their birth`, 12, "rgb(0, 0, 0)",
      () => updateEnabledSwitch(enabled, isEnabled, setEnabled, setColourFadeSet),
      `${isEnabled ? "Disable" : "Enable"}`, 24, "rgb(0, 0, 0)",
      () => navigation.navigate("Colour Selection Screen", colour1Request),
      "Set colour 1 (current colour below)", 24, "rgb(0, 0, 0)",
      null, "", 24, `rgb(${redStart * 255}, ${greenStart * 255}, ${blueStart * 255})`,
      () => navigation.navigate("Colour Selection Screen", colour2Request),
      "Set colour 2 (current colour below)", 24, "rgb(0, 0, 0)",
      null, "", 24, `rgb(${redEnd}, ${greenEnd}, ${blueEnd})`,
      FadePreview(redStart * 255, redEnd, greenStart * 255, greenEnd, blueStart * 255,
                  blueEnd));
  return (
    <>
      <Menu menuArray={menuArray}/>
    </>
  );
};

const GraphOptionsMenu = () => {
  const state = useAppSelector(state => state);
  const enabled = state.showGrid;
  const [isEnabled, setEnabled] = useState(enabled);
  const menuArray =
    MenuArray(
      null, "Show a grid over the board.", 12, "rgb(0, 0, 0)",
      () => updateEnabledSwitch(enabled, isEnabled, setEnabled, setShowGrid),
      `${isEnabled ? "Disable" : "Enable"}`, 24, "rgb(0, 0, 0)",
      null, "",  24, "rgb(0, 0, 0)",
      null, "",  24, "rgb(0, 0, 0)",
      null, "",  24, "rgb(0, 0, 0)",
      null, "",  24, "rgb(0, 0, 0)",
      null);
  return (
    <>
      <Menu menuArray={menuArray}/>
    </>
  );
};

export {MainMenu, DisplayMenu, GameMenu, BoardColourOptionsMenu, CellColourOptionsMenu,
        GraphOptionsMenu};
