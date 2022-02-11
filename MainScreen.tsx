import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions, GestureResponderEvent } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { GLView } from 'expo-gl';
import { ControlBarButton, ControlBarPlaceHolder } from './react-components/ControlBar';
import { MetaDataBar } from './react-components/MetaDataBar';
import { onContextCreation } from './logic-components/GameBoardRenderer';
import { changeMode, moveCameraLeft, moveCameraRight,
         moveCameraUp, moveCameraDown, moveCameraBack, moveCameraForward, getBoardDimensions }
from './logic-components/StateController';
import { flipCellStateOnTouch, getGameTime, getTotalPopulation }
from './logic-components/GameLogic';

const styles = StyleSheet.create({
  mainScreenContainer: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255)",
    flexDirection: "column-reverse"
  },
  bottomControlBar: {
    flex: 0.1,
    flexDirection: "row",
    backgroundColor: "rgb(0, 0, 160)"
  },
  gameBoardContainer: {
    flex: 0.8,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgb(0, 180, 0)"
  },
  metaDataBar: {
    flex: 1,
    backgroundColor: "rgb(0, 180, 0)",
    padding: 10
  },
  topControlBar: {
    flex: 0.1,
    backgroundColor: "rgb(0, 0, 0)",
    flexDirection: "row"
  }
});

// These functions are handlers for touch input received by the GLView component that contains
// the game board.
function handleTouchRelease(window : {width: number, height: number}, evt : GestureResponderEvent)
                           : void {
  flipCellStateOnTouch("touchReleased", window, 
                               {x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY});
}

function handleTouchMove(window : {width: number, height: number}, evt : GestureResponderEvent)
                        : void {
  flipCellStateOnTouch("touchMoved", window, 
                               {x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY});
}

// This component is a container for eight buttons that appear at the bottom of the screen.
const ControlBar = ({buttonHeight, window}) => {
  const [mode, setMode] = useState("creative");
  const dispatch = useDispatch();
  const changeMode_ = resetSwitch => {dispatch(changeMode(resetSwitch))};
  const moveCameraUp_ = () => {dispatch(moveCameraUp())};
  const moveCameraDown_ = () => {dispatch(moveCameraDown())};
  const moveCameraLeft_ = () => {dispatch(moveCameraLeft())};
  const moveCameraRight_ = () => {dispatch(moveCameraRight())};
  const moveCameraForward_ = () => {dispatch(moveCameraForward())};
  const moveCameraBack_ = () => {dispatch(moveCameraBack())};
  const onPlayPausePressed = () => {
    changeMode_(false);
    if (mode === "simulation") {setMode("creative")}
    else {setMode("simulation")}
  };
  const onResetPressed = () => {
    changeMode_(true);
  };
  return (
    <View style={[styles.bottomControlBar, {width: window.width}]}>
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={(mode === "creative") ? require("./assets/playButton.png") :
                                                             require("./assets/pauseButton.png")}
                        onPress={onPlayPausePressed}
                        disabled={false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={(mode === "creative") ? require("./assets/resetButton.png") :
                                                             require(
                                                              "./assets/greyResetButton.png"
                                                             )}
                        onPress={onResetPressed}
                        disabled={(mode === "simulation") ? true : false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={require("./assets/upButton.png")}
                        onPress={moveCameraUp_}
                        disabled={false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={require("./assets/downButton.png")}
                        onPress={moveCameraDown_}
                        disabled={false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={require("./assets/leftButton.png")}
                        onPress={moveCameraLeft_}
                        disabled={false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={require("./assets/rightButton.png")}
                        onPress={moveCameraRight_}
                        disabled={false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={require("./assets/plusButton.png")}
                        onPress={moveCameraForward_}
                        disabled={false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={require("./assets/minusButton.png")}
                        onPress={moveCameraBack_}
                        disabled={false} />
    </View>
  );
};

// This component defines the layout of the application's main screen, which contains an
// interactive view of the game board and a number of controls.
const MainScreen = ({navigation}) => {
  const window = useWindowDimensions();
  const buttonHeight = window.height * 0.1;
  const state = useSelector(state => state);

  return (
    <View style={[styles.mainScreenContainer, {paddingTop: window.height * 0.04}]}>
      <ControlBar buttonHeight={buttonHeight} window={window}/>
      <View style={[styles.gameBoardContainer, {width: window.width}]}>
        <GLView style={{width: window.width, height: window.width * 1.1}}
                onContextCreate={onContextCreation}
                onStartShouldSetResponder={(evt) => {return true}}
                onMoveShouldSetResponder={(evt) => {return true}}
                onResponderRelease={(evt) => handleTouchRelease(window, evt)}
                onResponderMove={(evt) => handleTouchMove(window, evt)}/>
        <MetaDataBar style={[styles.metaDataBar, {width: window.width}]}
                     window={window}
                     getState1={getBoardDimensions}
                     stateName1={"Board dimensions"}
                     getState2={getGameTime}
                     stateName2={"Generation"}
                     getState3={getTotalPopulation}
                     stateName3={"Population"}
                     period={200}
                     />
      </View>
      <View style={[styles.topControlBar, {width: window.width}]}>
        <ControlBarPlaceHolder buttonHeight={buttonHeight}
                               flex={7}
                               colour={"rgb(0, 0, 0)"}
                               content={`Pattern name: ${state.patternName}`}/>
        <ControlBarButton buttonHeight={buttonHeight}
                          imageSource={require("./assets/menuButton.png")}
                          onPress={() => {
                            clearInterval(state.intervalID);
                            navigation.navigate("MainMenu");
                          }}
                          disabled={false} />
      </View>
    </View>
  );
};

export {MainScreen};
