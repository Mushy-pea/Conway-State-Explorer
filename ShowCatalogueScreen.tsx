import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, TextInput,
         useWindowDimensions } from 'react-native';
import { ControlBarButton } from './react-components/ControlBar';

const styles = StyleSheet.create({
  listView: {
    flex: 0.9,
    backgroundColor: "rgb(0, 0, 64)"
  },
  itemView: {
    backgroundColor: "rgb(0, 0, 0)",
    borderWidth: 1,
    borderColor: "rgb(255, 255, 255)",
    padding: 20
  },
  searchBarView: {
    flex: 0.1,
    flexDirection: "row",
    backgroundColor: "rgb(0, 0, 0)",
    borderWidth: 1,
    borderColor: "rgb(255, 255, 255)"
  },
  textStyle: {
    color: "rgb(255, 255, 255)",
    fontSize: 12
  }
});

const Item = ({name, patternId, navigation, destination}) => {
  return (
    <TouchableOpacity style={styles.itemView}
                      onPress={() => {
                        navigation.navigate(destination, {patternId: parseInt(patternId)})
                      }}>
      <Text style={styles.textStyle}>{name}</Text>
    </TouchableOpacity>
  );
};

const ShowCatalogueScreen = ({navigation}) => {
  const [loadingState, setLoadingState] = useState("loading");
  const [catalogueView, setCatalogueView] = useState([]);
  const [searchString, setSearchString] = useState("");
  const viewCatalogue = async () => {
    try {
      const rootURL = "https://fabled-archive-341612.ew.r.appspot.com/";
      const response = await fetch(`${rootURL}get_catalogue?searchString=${searchString}`);
      const result = await response.json();
      setCatalogueView(result);
      setLoadingState("completed");
    }
    catch(error) {
      const errorMessage = "Sorry, there's a problem with the server and the pattern catalogue can't be loaded at this time.  Tap here to go back to the previous screen.";
      const errorView = [{Pattern_id: 0, Name: errorMessage}];
      setCatalogueView(errorView);
      setLoadingState("failed");
    }
  };
  const renderItem = ({item}) => {
    if (loadingState === "completed") {
      return (
        <Item name={item.Name}
              patternId={item.Pattern_id}
              navigation={navigation}
              destination={"LoadPatternScreen"}/>
      );
    }
    else {
      return (
        <Item name={item.Name}
              patternId={item.Pattern_id}
              navigation={navigation}
              destination={"GameMenu"}/>
      );
    }
  };
  useEffect(() => {viewCatalogue()}, [searchString]);
  const window = useWindowDimensions();
  const buttonHeight = window.height * 0.1;
  const [text, changeText] = useState("");

  return (
    <>
      <View style={styles.searchBarView}>
        <TextInput style={[styles.textStyle, {flex: 7}]}
                   value={text}
                   onChangeText={newText => changeText(newText)}
                   onSubmitEditing={evt => setSearchString(evt.nativeEvent.text)}
                   />
        <ControlBarButton buttonHeight={buttonHeight}
                          imageSource={require("./assets/searchButton.png")}
                          onPress={() => setSearchString(text)}
                          disabled={false}/>
      </View>
      <View style={styles.listView}>
        {loadingState === "loading" ? <ActivityIndicator/> : (
          <FlatList data={catalogueView}
                    renderItem={item => renderItem(item)}
                    keyExtractor={item => `${item.Pattern_id}`}/>
        )}
      </View> 
    </>
  );
}

export default ShowCatalogueScreen;

