import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ColorPicker } from 'react-native-color-picker';
import { control } from './logic-components/StateController';

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
function determineColour(colourString : string) : {red : number, green : number, blue : number} {
  const redHex = colourString.substring(1, 3);
  const greenHex = colourString.substring(3, 5);
  const blueHex = colourString.substring(5);
  return {
    red: Number.parseInt(`0x${redHex}`) / 256,
    green: Number.parseInt(`0x${greenHex}`) / 256,
    blue: Number.parseInt(`0x${blueHex}`) / 256
  };
}

const GridColourScreen = () => {
  return (
    <View style={styles.colourOptionsContainer}>
      <Text style={styles.textStyle}>Set grid colour</Text>
      <ColorPicker style={{flex: 1}}
                   onColorSelected={color => {const {red, green, blue} = determineColour(color);
                                    control.setGridColour(red, green, blue, 1)}}/>
    </View>
  );
};

const BackgroundColourScreen = () => {
  return (
    <View style={styles.colourOptionsContainer}>
        <Text style={styles.textStyle}>Set background colour</Text>
        <ColorPicker style={{flex: 1}}
                     onColorSelected={color => {const {red, green, blue} = determineColour(color);
                                                control.setBackgroundColour(red, green, blue, 1)}}/>
    </View>
  );
};

// This function updates the state of control.colourFadeSet after  user input has been received
// by the SetColour1Screen or SetColour2Screen components.
function updateColourFade(red1 : number, green1 : number, blue1 : number, red2 : number,
                          green2 : number, blue2 : number) : void {
  const redRate = (red2 - red1) / 15;
  const greenRate = (green2 - green1) / 15;
  const blueRate = (blue2 - blue1) / 15;
  control.setColourFadeSet(true, red1, redRate, green1, greenRate, blue1, blueRate);
}

const SetColour1Screen = () => {
  return (
    <View style={styles.colourOptionsContainer}>
      <Text style={styles.textStyle}>Set colour 1 (for colour fade)</Text>
        <ColorPicker style={{flex: 1}}
                     onColorSelected={color => {
                       const {redRate, greenRate, blueRate} = control.getColourFadeSet(1);
                       const {red, green, blue} = determineColour(color);
                       updateColourFade(red, green, blue, red + redRate * 15,
                                        green + greenRate * 15, blue + blueRate * 15);
                       console.log(`redStart: ${red}, greenStart: ${green}, blueStart: ${blue}, redEnd: ${red + redRate * 15}, greenEnd: ${green + greenRate * 15}, blueEnd: ${blue + blueRate * 15}`);
                       
                    }}/>
    </View>
  );
};

const SetColour2Screen = () => {
  return (
    <View style={styles.colourOptionsContainer}>
      <Text style={styles.textStyle}>Set colour 2 (for colour fade)</Text>
        <ColorPicker style={{flex: 1}}
                     onColorSelected={color => {             
                       const {redStart, greenStart, blueStart} = control.getColourFadeSet(1);
                       const {red, green, blue} = determineColour(color);
                       updateColourFade(redStart, greenStart, blueStart, red, green, blue);
                       console.log(`redStart: ${redStart}, greenStart: ${greenStart}, blueStart: ${blueStart}, redEnd: ${red}, greenEnd: ${green}, blueEnd: ${blue}`);
                    }}/>
    </View>
  );
};

export {GridColourScreen, BackgroundColourScreen, SetColour1Screen, SetColour2Screen};
