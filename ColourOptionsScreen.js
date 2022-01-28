import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import { ColorPicker, toHsv } from 'react-native-color-picker';
import { control } from './logic-components/StateController.js';

const styles = StyleSheet.create({
  colourOptionsContainer: {
    flex: 1,
    backgroundColor: "rgb(0, 0, 0)",
  },
  optionArea: {
    flex: 1,
    backgroundColor: "rgb(0, 0, 0)",
    borderWidth: 1,
    borderColor: "rgb(255, 255, 255)"
  },
  textStyle: {
    color: "rgb(255, 255, 255)",
    fontSize: 24
  }
});

function changeGridColour(colourString) {
  const redHex = colourString.substring(1, 3);
  const greenHex = colourString.substring(3, 5);
  const blueHex = colourString.substring(5);
  const colour = {
    red: Number.parseInt(`0x${redHex}`) / 256,
    green: Number.parseInt(`0x${greenHex}`) / 256,
    blue: Number.parseInt(`0x${blueHex}`)
  };
  control.setGridColour(colour.red, colour.green, colour.blue, 1);
}

const ColourOptionsScreen = () => {
  const window = useWindowDimensions();

  return (
    <View style={styles.colourOptionsContainer}>
      <View style={styles.optionArea}>
        <Text style={styles.textStyle}>Change grid colour</Text>
        <ColorPicker style={{flex: 1}}
                     onColorSelected={color => {changeGridColour(color)}}/>
      </View>
    </View>
  );
};

export default ColourOptionsScreen;
