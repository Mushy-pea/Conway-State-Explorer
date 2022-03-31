import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';

const styles = StyleSheet.create({
    menuView: {
      backgroundColor: "rgb(0, 0, 64)",
      flex: 1
    },
    itemView: {
      flexShrink: 0,
      flexGrow: 0,
      backgroundColor: "rgb(0, 0, 0)",
      borderWidth: 1,
      borderColor: "rgb(255, 255, 255)"
    },
    textStyle: {
      color: "rgb(255, 255, 255)",
      fontSize: 24
    }
  });

const MenuItem = ({colour, fontSize, text, onPress, disabled}) => {
  const window = useWindowDimensions();
  return (
    <TouchableOpacity style={[styles.itemView,
                              {flexBasis: window.height / 8,
                               borderWidth: disabled ? 0 : 1,
                               backgroundColor: colour}]}
                      onPress={onPress}
                      disabled={disabled}>
      <Text style={[styles.textStyle, {fontSize: fontSize}]}>{text}</Text>
    </TouchableOpacity>
  );
}

// This component is a menu that can hold up to six items, passed using the menuArray.
const Menu = ({menuArray}) => {
  const window = useWindowDimensions();
  return (
    <View style={styles.menuView}>
      <MenuItem colour={menuArray[0].colour}
                fontSize={menuArray[0].fontSize}
                text={menuArray[0].text}
                onPress={menuArray[0].action}
                disabled={menuArray[0].disabled()}/>
      <MenuItem colour={menuArray[1].colour}
                fontSize={menuArray[1].fontSize}
                text={menuArray[1].text}
                onPress={menuArray[1].action}
                disabled={menuArray[1].disabled()}/>
      <MenuItem colour={menuArray[2].colour}
                fontSize={menuArray[2].fontSize}
                text={menuArray[2].text}
                onPress={menuArray[2].action}
                disabled={menuArray[2].disabled()}/>
      <MenuItem colour={menuArray[3].colour}
                fontSize={menuArray[3].fontSize}
                text={menuArray[3].text}
                onPress={menuArray[3].action}
                disabled={menuArray[3].disabled()}/>
      <MenuItem colour={menuArray[4].colour}
                fontSize={menuArray[4].fontSize}
                text={menuArray[4].text}
                onPress={menuArray[4].action}
                disabled={menuArray[4].disabled()}/>
      <MenuItem colour={menuArray[5].colour}
                fontSize={menuArray[5].fontSize}
                text={menuArray[5].text}
                onPress={menuArray[5].action}
                disabled={menuArray[5].disabled()}/>
      <View style={[styles.itemView, {flexBasis: window.height / 4,
                                      borderWidth: 0}]}>
        {menuArray[6].nestedView}
      </View>
    </View>
  );
};

export default Menu;

