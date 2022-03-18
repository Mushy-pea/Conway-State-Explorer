import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: "rgb(0, 0, 0)"
  },
  textStyle: {
    color: "rgb(255, 255, 255)",
    fontSize: 12
  }
});

const LoadPatternScreen = ({navigation, route}) => {
  return (
    <View style={styles.containerView}>
      <Text style={styles.textStyle}>You have selected Pattern_id {route.params.patternId}</Text>
    </View>
  );
};

export default LoadPatternScreen;

