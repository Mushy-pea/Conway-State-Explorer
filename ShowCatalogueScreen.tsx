import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, TextInput,
         useWindowDimensions } from 'react-native';
import { ControlBarButton } from './react-components/ControlBar';
import { CatalogueReference } from './logic-components/GameLogicTypes';
import { rootURL } from './logic-components/StateController';

const styles = StyleSheet.create({
  containerView: {
    flex: 0.9
  },
  waitView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(255, 255, 255)"
  },
  listView: {
    flex: 1,
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
                        navigation.navigate(destination, {patternId: patternId})
                      }}>
      <Text style={styles.textStyle}>{name}</Text>
    </TouchableOpacity>
  );
};

// This function queries the REST API to retrieve a view of the pattern catalogue, based on
// a search string.
async function getCatalogue(searchString : string,
                             setCatalogueView : React.Dispatch<React.SetStateAction<CatalogueReference[]>>,
                             setLoadingState : React.Dispatch<React.SetStateAction<string>>)
                             : Promise<void> {
  try {
    const response = await fetch(`${rootURL}get_catalogue?searchString=${searchString}`);
    const result = await response.json();
    setCatalogueView(result);
    setLoadingState("completed");
  }
  catch(error) {
    const errorMessage = "Sorry, there's a problem with the server and the pattern catalogue can't \
be loaded at this time.  Tap here to go back to the previous screen.";
    const errorView = [{Pattern_id: 0, Name: errorMessage}];
    setCatalogueView(errorView);
    setLoadingState("failed");
  }
}

const ShowCatalogueScreen = ({navigation}) => {
  const [loadingState, setLoadingState] = useState("loading");
  const [catalogueView, setCatalogueView] = useState([]);
  const [searchString, setSearchString] = useState("");
  const renderItem = ({item}) => {
    if (loadingState === "completed") {
      return (
        <Item name={item.Name}
              patternId={item.Pattern_id}
              navigation={navigation}
              destination={"Load Pattern Screen"}/>
      );
    }
    else {
      return (
        <Item name={item.Name}
              patternId={item.Pattern_id}
              navigation={navigation}
              destination={"Game Menu"}/>
      );
    }
  };
  useEffect(() => {getCatalogue(searchString, setCatalogueView, setLoadingState)}, [searchString]);
  const window = useWindowDimensions();
  const buttonHeight = window.height * 0.1;
  const [text, changeText] = useState("");

  return (
    <>
      <View style={styles.searchBarView}>
        <TextInput style={[styles.textStyle, {flex: 7}]}
                   value={text}
                   onChangeText={newText => changeText(newText)}
                   onSubmitEditing={evt => {
                     setLoadingState("loading");
                     setSearchString(evt.nativeEvent.text);
                   }}/>
        <ControlBarButton buttonHeight={buttonHeight}
                          imageSource={require("./assets/searchButton.png")}
                          onPress={() => setSearchString(text)}/>
      </View>
      <View style={styles.containerView}>
        {loadingState === "loading" ? 
          <View style={styles.waitView}>
            <ActivityIndicator color="rgb(0, 0, 180)" size="large"/>
          </View>
        :
          <View style={styles.listView}>
            <FlatList data={catalogueView}
                      renderItem={item => renderItem(item)}
                      keyExtractor={item => `${item.Pattern_id}`}/>
          </View>
        }
      </View>
    </>
  )
}

export default ShowCatalogueScreen;

