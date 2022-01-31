import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions, GestureResponderEvent } from 'react-native';
import { GLView } from 'expo-gl';
import { ControlBarButton, ControlBarPlaceHolder } from './react-components/ControlBar';
import { MetaDataBar } from './react-components/MetaDataBar';
import { onContextCreation } from './logic-components/GameBoardRenderer';
import { control, initialiseControls } from './logic-components/StateController';

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
  control.flipCellStateOnTouch("touchReleased", window, 
                               {x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY});
}

function handleTouchMove(window : {width: number, height: number}, evt : GestureResponderEvent)
                        : void {
  control.flipCellStateOnTouch("touchMoved", window, 
                               {x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY});
}

// This component is a container for eight buttons that appear at the bottom of the screen.
const ControlBar = ({buttonHeight, window}) => {
  const [mode, setMode] = useState("creative");
  const onPlayPausePressed = () => {
    control.changeMode(false);
    if (mode === "simulation") {setMode("creative")}
    else {setMode("simulation")}
  };
  const onResetPressed = () => {
    control.changeMode(true);
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
                                                             require("./assets/greyResetButton.png")}
                        onPress={onResetPressed}
                        disabled={(mode === "simulation") ? true : false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={require("./assets/upButton.png")}
                        onPress={control.moveCameraUp}
                        disabled={false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={require("./assets/downButton.png")}
                        onPress={control.moveCameraDown}
                        disabled={false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={require("./assets/leftButton.png")}
                        onPress={control.moveCameraLeft}
                        disabled={false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={require("./assets/rightButton.png")}
                        onPress={control.moveCameraRight}
                        disabled={false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={require("./assets/plusButton.png")}
                        onPress={control.moveCameraForward}
                        disabled={false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={require("./assets/minusButton.png")}
                        onPress={control.moveCameraBack}
                        disabled={false} />
    </View>
  );
};

// This component defines the layout of the application's main screen, which contains an
// interactive view of the game board and a number of controls.
const MainScreen = ({navigation}) => {
  const window = useWindowDimensions();
  const buttonHeight = window.height * 0.1;
  initialiseControls();

  return (
    <View style={[styles.mainScreenContainer, {paddingTop: window.height * 0.04}]}>
      <ControlBar buttonHeight={buttonHeight} window={window} />
      <View style={[styles.gameBoardContainer, {width: window.width}]}>
        <GLView style={{width: window.width, height: window.width * 1.1}}
                onContextCreate={onContextCreation}
                onStartShouldSetResponder={(evt) => {return true}}
                onMoveShouldSetResponder={(evt) => {return true}}
                onResponderRelease={(evt) => handleTouchRelease(window, evt)}
                onResponderMove={(evt) => handleTouchMove(window, evt)}/>
        <MetaDataBar style={[styles.metaDataBar, {width: window.width}]}
                     window={window}
                     getState1={control.getBoardDimensions}
                     stateName1={"Board dimensions"}
                     getState2={control.getGameTime}
                     stateName2={"Generation"}
                     getState3={control.getTotalPopulation}
                     stateName3={"Population"}
                     period={200}
                     />
      </View>
      <View style={[styles.topControlBar, {width: window.width}]}>
        <ControlBarPlaceHolder buttonHeight={buttonHeight}
                               flex={7}
                               colour={"rgb(0, 0, 0)"}
                               content={`Pattern name: ${control.getPatternName()}`}/>
        <ControlBarButton buttonHeight={buttonHeight}
                          imageSource={require("./assets/menuButton.png")}
                          onPress={() => {
                            clearInterval(control.getIntervalID());
                            navigation.navigate("MainMenu");
                          }}
                          disabled={false} />
      </View>
    </View>
  );
};

export default MainScreen;
