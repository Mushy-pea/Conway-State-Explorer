import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { GLView } from 'expo-gl';
import { ControlBarButton, ControlBarPlaceHolder } from './react-components/ControlBar.js';
import { onContextCreation, control, initialiseControls } from './logic-components/GameBoardRenderer.js';

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
    backgroundColor: "rgb(255, 255, 255)"
  },
  topControlBar: {
    flex: 0.1,
    backgroundColor: "rgb(0, 0, 0)",
    flexDirection: "row"
  }
});

// This component defines the layout of the application's main screen, which contains an
// interactive view of the game board and a number of controls.
const MainScreen = () => {
  const window = useWindowDimensions();
  const buttonHeight = window.height * 0.1;
  const buttonWidth = window.width * 0.125;
  initialiseControls();

  return (
    <View style={[styles.mainScreenContainer, {paddingTop: window.height * 0.04}]}>
      <ControlBar buttonHeight={buttonHeight} window={window} />
      <GLView style={[styles.gameBoardContainer, {width: window.width}]} onContextCreate={onContextCreation} />
      <View style={[styles.topControlBar, {width: window.width}]}>
        <ControlBarPlaceHolder buttonHeight={buttonHeight} flex={7} colour={"rgb(0, 0, 0)"} />
        <ControlBarButton buttonHeight={buttonHeight}
                          imageSource={require("./assets/menuButton.png")}
                          onPress={null}
                          disabled={false} />
      </View>
    </View>
  );
};

// This component is a container for eight buttons that appear at the bottom of the screen.
const ControlBar = ({buttonHeight, window}) => {
  const [mode, setMode] = useState("simulation");
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
                        imageSource={(mode === "creative") ? require("./assets/playButton.png") : require("./assets/pauseButton.png")}
                        onPress={onPlayPausePressed}
                        disabled={false} />
      <ControlBarButton buttonHeight={buttonHeight}
                        imageSource={(mode === "creative") ? require("./assets/resetButton.png") : require("./assets/greyResetButton.png")}
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

export default MainScreen;
