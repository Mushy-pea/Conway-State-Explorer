import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

const styles = StyleSheet.create({
  menuView: {
    backgroundColor: "rgb(0, 160, 0)",
    flex: 1
  }
});

const MainMenu = ({navigation}) => {
  return (
    <View style={styles.menuView}>
      <Button 
      title="Go back"
      onPress={() => {navigation.navigate("MainScreen")}}/>
    </View>
  );
};

export default MainMenu;
