import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import {GLView} from 'expo-gl';
import {onContextCreation, control, initialiseControls} from './GameBoardRenderer.js';

const styles = StyleSheet.create({
  mainScreenContainer: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255)",
    flexDirection: "column-reverse",
    alignItems: "center"
  },
  mainButtonContainer: {
    flex: 0.1,
    flexDirection: "row",
    backgroundColor: "rgb(0, 0, 160)"
  },
  gameBoardContainer: {
    flex: 0.8,
    backgroundColor: "rgb(255, 255, 255)"
  },
  menuBarContainer: {
    flex: 0.1,
    backgroundColor: "rgb(0, 0, 0)",
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  mainScreenButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgb(255, 255, 255)"
  },
  mainScreenButtonImage: {
    flex: 1
  }
});

const mainScreen = () => {
  const window = useWindowDimensions();
  const buttonHeight = window.height * 0.1;
  const buttonWidth = window.width * 0.125;
  initialiseControls();

  return (
    <View style={[styles.mainScreenContainer, {paddingTop: window.height * 0.04}]}>
      <View style={[styles.mainButtonContainer, {width: window.width}]}>
        <TouchableOpacity style={[styles.mainScreenButton, {height: buttonHeight}]}>
          <Image source={require("./assets/playButton.png")} resizeMode="cover"
                 style={[styles.mainScreenButtonImage, {height: buttonHeight}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: buttonHeight}]}>
          <Image source={require("./assets/resetButton.png")} resizeMode="cover"
                 style={[styles.mainScreenButtonImage, {height: buttonHeight}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: buttonHeight}]}
                          onPress={control.moveCameraUp}>
          <Image source={require("./assets/upButton.png")} resizeMode="cover"
                 style={[styles.mainScreenButtonImage, {height: buttonHeight}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: buttonHeight}]}
                          onPress={control.moveCameraDown}>
          <Image source={require("./assets/downButton.png")} resizeMode="cover"
                 style={[styles.mainScreenButtonImage, {height: buttonHeight}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: buttonHeight}]}
                          onPress={control.moveCameraLeft}>
          <Image source={require("./assets/leftButton.png")} resizeMode="cover"
                 style={[styles.mainScreenButtonImage, {height: buttonHeight}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: buttonHeight}]}
                          onPress={control.moveCameraRight}>
          <Image source={require("./assets/rightButton.png")} resizeMode="cover"
                 style={[styles.mainScreenButtonImage, {height: buttonHeight}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: buttonHeight}]}
                          onPress={control.moveCameraForward}>
          <Image source={require("./assets/plusButton.png")} resizeMode="cover"
                 style={[styles.mainScreenButtonImage, {height: buttonHeight}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: buttonHeight}]}
                          onPress={control.moveCameraBack}>
          <Image source={require("./assets/minusButton.png")} resizeMode="cover"
                 style={[styles.mainScreenButtonImage, {height: buttonHeight}]}/>
        </TouchableOpacity>
      </View>
      <GLView style={[styles.gameBoardContainer, {width: window.width}]} onContextCreate={onContextCreation} />
      <View style={[styles.menuBarContainer, {width: window.width}]}>
        <Image source={require("./assets/menuButton.png")}
               style={{height: buttonHeight, width: buttonWidth}} />
      </View>
    </View>
  );
};

export default mainScreen;
