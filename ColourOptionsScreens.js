import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ColorPicker } from 'react-native-color-picker';
import { control } from './logic-components/StateController.js';

const styles = StyleSheet.create({
  colourOptionsContainer: {
    flex: 1,
    backgroundColor: "rgb(0, 0, 0)",
  },
  textStyle: {
    color: "rgb(255, 255, 255)",
    fontSize: 24
  }
});

// This function converts the hex colour string provided by the ColorPicker component into the
// RGB representation used with OpenGL in GameBoardRenderer.
function setColour(colourString, setColour) {
  const redHex = colourString.substring(1, 3);
  const greenHex = colourString.substring(3, 5);
  const blueHex = colourString.substring(5);
  const colour = {
    red: Number.parseInt(`0x${redHex}`) / 256,
    green: Number.parseInt(`0x${greenHex}`) / 256,
    blue: Number.parseInt(`0x${blueHex}`)
  };
  setColour(colour.red, colour.green, colour.blue, 1);
}

const GridColourScreen = () => {
  return (
    <View style={styles.colourOptionsContainer}>
      <Text style={styles.textStyle}>Set grid colour</Text>
      <ColorPicker style={{flex: 1}}
                   onColorSelected={color => {setColour(color, control.setGridColour)}}/>
    </View>
  );
};

const BackgroundColourScreen = () => {
  return (
    <View style={styles.colourOptionsContainer}>
        <Text style={styles.textStyle}>Set background colour</Text>
        <ColorPicker style={{flex: 1}}
                     onColorSelected={color => {setColour(color, control.setBackgroundColour)}}/>
    </View>
  );
};

export  {GridColourScreen, BackgroundColourScreen};
