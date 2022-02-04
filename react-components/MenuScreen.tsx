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

// This component is a menu that can hold up to six items, passed using the menuArray.
const Menu = ({menuArray}) => {
  const window = useWindowDimensions();
  const text0 = menuArray[0].text;
  const text1 = menuArray[1].text;
  const text2 = menuArray[2].text;
  const text3 = menuArray[3].text;
  const text4 = menuArray[4].text;
  const text5 = menuArray[5].text;

  return (
    <View style={styles.menuView}>
      <TouchableOpacity style={[styles.itemView,
                                {flexBasis: window.height / 8,
                                 borderWidth: menuArray[0].disabled() ? 0 : 1,
                                 backgroundColor: menuArray[0].colour}]}
                        onPress={menuArray[0].action}
                        disabled={menuArray[0].disabled()}>
        <Text style={[styles.textStyle, {fontSize: menuArray[0].fontSize}]}>{text0}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.itemView,
                                {flexBasis: window.height / 8,
                                 borderWidth: menuArray[1].disabled() ? 0 : 1,
                                 backgroundColor: menuArray[1].colour}]}
                        onPress={menuArray[1].action}
                        disabled={menuArray[1].disabled()}>
        <Text style={[styles.textStyle, {fontSize: menuArray[1].fontSize}]}>{text1}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.itemView,
                                {flexBasis: window.height / 8,
                                 borderWidth: menuArray[2].disabled() ? 0 : 1,
                                 backgroundColor: menuArray[2].colour}]}
                        onPress={menuArray[2].action}
                        disabled={menuArray[2].disabled()}>
        <Text style={[styles.textStyle, {fontSize: menuArray[2].fontSize}]}>{text2}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.itemView,
                                {flexBasis: window.height / 8,
                                 borderWidth: menuArray[3].disabled() ? 0 : 1, 
                                 backgroundColor: menuArray[3].colour}]}
                        onPress={menuArray[3].action}
                        disabled={menuArray[3].disabled()}>
        <Text style={[styles.textStyle, {fontSize: menuArray[3].fontSize}]}>{text3}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.itemView,
                                {flexBasis: window.height / 8,
                                 borderWidth: menuArray[4].disabled() ? 0 : 1, 
                                 backgroundColor: menuArray[4].colour}]}
                        onPress={menuArray[4].action}
                        disabled={menuArray[4].disabled()}>
        <Text style={[styles.textStyle, {fontSize: menuArray[4].fontSize}]}>{text4}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.itemView,
                                {flexBasis: window.height / 8,
                                 borderWidth: menuArray[5].disabled() ? 0 : 1, 
                                 backgroundColor: menuArray[5].colour}]}
                        onPress={menuArray[5].action}
                        disabled={menuArray[5].disabled()}>
        <Text style={[styles.textStyle, {fontSize: menuArray[5].fontSize}]}>{text5}</Text>
      </TouchableOpacity>
      <View style={[styles.placeholderView, {flexBasis: window.height}]}>
        {menuArray[6].nestedView}
      </View>
    </View>
    );
  };

export default Menu;
