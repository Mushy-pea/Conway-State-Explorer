import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  controlBarButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgb(255, 255, 255)"
  },
  controlBarButtonImage: {
    flex: 1
  }
});

// This button component is designed to be tightly packed into a containing view with
// others of this type or ControlBarPlaceHolders.
const ControlBarButton = ({buttonHeight, imageSource, onPress, disabled}) => {
  return (
    <TouchableOpacity style={[styles.controlBarButton, {height: buttonHeight}]}
                      onPress={onPress}
                      disabled={disabled}>
      <Image source={imageSource}
             resizeMode="cover"
             style={[styles.controlBarButtonImage, {height: buttonHeight}]} />
    </TouchableOpacity>
  );
};

const ControlBarPlaceHolder = ({buttonHeight, flex, colour}) => {
  return (
    <View style={[styles.controlBarButton,
                 {height: buttonHeight, flex: flex, backgroundColor: colour}]} />
  );
};

export {ControlBarButton, ControlBarPlaceHolder};
