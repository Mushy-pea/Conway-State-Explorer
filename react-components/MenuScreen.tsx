import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';

const styles = StyleSheet.create({
    menuView: {
      backgroundColor: "rgb(0, 0, 60)",
      flex: 1
    },
    itemView: {
      flexShrink: 0,
      flexGrow: 0,
      backgroundColor: "rgb(0, 0, 0)",
      borderWidth: 1,
      borderColor: "rgb(255, 255, 255)"
    },
    placeholderView: {
      flexGrow: 1,
      flexShrink: 1,
      backgroundColor: "rgb(0, 0, 0)"
    },
    textStyle: {
      color: "rgb(255, 255, 255)",
      fontSize: 24
    }
  });

// This component is a reusable menu that can hold up to four items, passed using the menuArray.
const Menu = ({menuArray}) => {
  const window = useWindowDimensions();

  return (
    <View style={styles.menuView}>
      <TouchableOpacity style={[styles.itemView,
                                {flexBasis: window.height / 8,
                                 borderWidth: menuArray[0].disabled() ? 0 : 1,
                                 backgroundColor: menuArray[0].colour}]}
                        onPress={menuArray[0].action}
                        disabled={menuArray[0].disabled()}>
        <Text style={[styles.textStyle, {fontSize: menuArray[0].fontSize}]}>{menuArray[0].text}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.itemView,
                                {flexBasis: window.height / 8,
                                 borderWidth: menuArray[1].disabled() ? 0 : 1,
                                 backgroundColor: menuArray[1].colour}]}
                        onPress={menuArray[1].action}
                        disabled={menuArray[1].disabled()}>
        <Text style={[styles.textStyle, {fontSize: menuArray[1].fontSize}]}>{menuArray[1].text}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.itemView,
                                {flexBasis: window.height / 8,
                                 borderWidth: menuArray[2].disabled() ? 0 : 1,
                                 backgroundColor: menuArray[2].colour}]}
                        onPress={menuArray[2].action}
                        disabled={menuArray[2].disabled()}>
        <Text style={[styles.textStyle, {fontSize: menuArray[2].fontSize}]}>{menuArray[2].text}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.itemView,
                                {flexBasis: window.height / 8,
                                 borderWidth: menuArray[3].disabled() ? 0 : 1, 
                                 backgroundColor: menuArray[3].colour}]}
                        onPress={menuArray[4].action}
                        disabled={menuArray[3].disabled()}>
        <Text style={[styles.textStyle, {fontSize: menuArray[3].fontSize}]}>{menuArray[3].text}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.itemView,
                                {flexBasis: window.height / 8,
                                 borderWidth: menuArray[4].disabled() ? 0 : 1, 
                                 backgroundColor: menuArray[4].colour}]}
                        onPress={menuArray[4].action}
                        disabled={menuArray[4].disabled()}>
        <Text style={[styles.textStyle, {fontSize: menuArray[4].fontSize}]}>{menuArray[4].text}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.itemView,
                                {flexBasis: window.height / 8,
                                 borderWidth: menuArray[5].disabled() ? 0 : 1, 
                                 backgroundColor: menuArray[5].colour}]}
                        onPress={menuArray[5].action}
                        disabled={menuArray[5].disabled()}>
        <Text style={[styles.textStyle, {fontSize: menuArray[5].fontSize}]}>{menuArray[5].text}</Text>
      </TouchableOpacity>
      <View style={[styles.placeholderView, {flexBasis: window.height}]}/>
      </View>
    );
  };

export default Menu;
