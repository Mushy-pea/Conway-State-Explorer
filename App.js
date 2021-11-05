import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, useWindowDimensions } from 'react-native';

const styles = StyleSheet.create({
  mainScreenContainer: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255)",
    flexDirection: "column-reverse",
    alignItems: "center"
  },
  mainButtonContainer: {
    flex: 0.1,
    width: 600,
    flexDirection: "row",
    backgroundColor: "rgb(0, 0, 160)"
  },
  gameBoardContainer: {
    flex: 0.8,
    width: 600,
    backgroundColor: "rgb(0, 160, 0)"
  },
  menuBarContainer: {
    flex: 0.1,
    width: 600,
    backgroundColor: "rgb(160, 0, 0)"
  },
  mainScreenButton: {
    height: 85,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgb(255, 255, 255)"
  },
  mainScreenButtonImage: {
    height: 85,
    flex: 1
  }
});

const mainScreen = () => {
  const window = useWindowDimensions();
  return (
    <View style={styles.mainScreenContainer}>
      <View style={[styles.mainButtonContainer, {width: window.width}]}>
        <TouchableOpacity style={[styles.mainScreenButton, {height: window.height * 0.1}]}>
          <Image source={require("./assets/playButton.png")} resizeMode="cover"  style={[styles.mainScreenButtonImage, {height: window.height * 0.1}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: window.height * 0.1}]}>
          <Image source={require("./assets/resetButton.png")} resizeMode="cover"  style={[styles.mainScreenButtonImage, {height: window.height * 0.1}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: window.height * 0.1}]}>
          <Image source={require("./assets/upButton.png")} resizeMode="cover"  style={[styles.mainScreenButtonImage, {height: window.height * 0.1}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: window.height * 0.1}]}>
          <Image source={require("./assets/downButton.png")} resizeMode="cover"  style={[styles.mainScreenButtonImage, {height: window.height * 0.1}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: window.height * 0.1}]}>
          <Image source={require("./assets/leftButton.png")} resizeMode="cover"  style={[styles.mainScreenButtonImage, {height: window.height * 0.1}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: window.height * 0.1}]}>
          <Image source={require("./assets/rightButton.png")} resizeMode="cover"  style={[styles.mainScreenButtonImage, {height: window.height * 0.1}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: window.height * 0.1}]}>
          <Image source={require("./assets/plusButton.png")} resizeMode="cover"  style={[styles.mainScreenButtonImage, {height: window.height * 0.1}]}/>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mainScreenButton, {height: window.height * 0.1}]}>
          <Image source={require("./assets/minusButton.png")} resizeMode="cover"  style={[styles.mainScreenButtonImage, {height: window.height * 0.1}]}/>
        </TouchableOpacity>
      </View>
      <View style={[styles.gameBoardContainer, {width: window.width}]}/>
      <View style={[styles.menuBarContainer, {width: window.width}]}/>
    </View>
  );
};

export default mainScreen;
