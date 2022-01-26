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
      backgroundColor: "rgb(0, 0, 0)"
    },
    textStyle: {
      color: "rgb(255, 255, 255)",
      fontSize: 24
    }
  });

const Menu = ({navigation, menuArray}) => {
  const window = useWindowDimensions();
    
    return (
      <View style={styles.menuView}>
        <TouchableOpacity style={[styles.itemView, {flexBasis: window.height / 8}]}
                          onPress={() => {navigation.navigate(menuArray[0].route)}}
                          disabled={menuArray[0].disabled()}>
          <Text style={styles.textStyle}>{menuArray[0].text}</Text>
          <Text style={styles.textStyle}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.itemView, {flexBasis: window.height / 8}]}
                          onPress={() => {navigation.navigate(menuArray[1].route)}}
                          disabled={menuArray[1].disabled()}>
          <Text style={styles.textStyle}>{menuArray[1].text}</Text>
          <Text style={styles.textStyle}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.itemView, {flexBasis: window.height / 8}]}
                          onPress={() => {navigation.navigate(menuArray[2].route)}}
                          disabled={menuArray[2].disabled()}>
          <Text style={styles.textStyle}>{menuArray[2].text}</Text>
          <Text style={styles.textStyle}></Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.itemView, {flexBasis: window.height / 8}]}
                          onPress={() => {navigation.navigate(menuArray[3].route)}}
                          disabled={menuArray[3].disabled()}>
          <Text style={styles.textStyle}>{menuArray[3].text}</Text>
          <Text style={styles.textStyle}></Text>
        </TouchableOpacity>
        <View style={[styles.placeholderView, {flexBasis: window.height}]}/>
      </View>
    );
  };

export default Menu;
