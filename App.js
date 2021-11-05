import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image } from 'react-native';

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
    flex: 1,
    height: 100
  }
});

const mainScreen = () => {
  return (
    <View style={styles.mainScreenContainer}>
      <View style={styles.mainButtonContainer}>
        <TouchableHighlight>
          <Image source={require("./assets/playButton.png")} resizeMode="stretch" style={styles.mainScreenButton}/>
        </TouchableHighlight>
        <TouchableHighlight>
          <Image source={require("./assets/resetButton.png")} resizeMode="stretch" style={styles.mainScreenButton}/>
        </TouchableHighlight>
        <TouchableHighlight>
          <Image source={require("./assets/upButton.png")} resizeMode="stretch" style={styles.mainScreenButton}/>
        </TouchableHighlight>
        <TouchableHighlight>
          <Image source={require("./assets/downButton.png")} resizeMode="stretch" style={styles.mainScreenButton}/>
        </TouchableHighlight>
        <TouchableHighlight>
          <Image source={require("./assets/leftButton.png")} resizeMode="stretch" style={styles.mainScreenButton}/>
        </TouchableHighlight>
        <TouchableHighlight>
          <Image source={require("./assets/rightButton.png")} resizeMode="stretch" style={styles.mainScreenButton}/>
        </TouchableHighlight>
        <TouchableHighlight>
          <Image source={require("./assets/plusButton.png")} resizeMode="stretch" style={styles.mainScreenButton}/>
        </TouchableHighlight>
        <TouchableHighlight>
          <Image source={require("./assets/minusButton.png")} resizeMode="stretch" style={styles.mainScreenButton}/>
        </TouchableHighlight>
      </View>
      <View style={styles.gameBoardContainer} />
      <View style={styles.menuBarContainer} />
    </View>
  );
};

export default mainScreen;
