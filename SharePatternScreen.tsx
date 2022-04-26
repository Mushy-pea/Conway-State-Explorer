import React, { useState, useEffect} from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions,
         ActivityIndicator }
from 'react-native';
import { patternPackage, PatternPackage } from './logic-components/GameLogicTypes';
import { gameBoardObject, savePattern } from './logic-components/GameLogic';
import { store, setPatternName, rootURL } from './logic-components/StateController';

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: "rgb(0, 0, 64)"
  },
  waitView: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255)"
  },
  bodyView: {
    flexShrink: 0,
    flexGrow: 0,
    borderWidth: 1,
    borderColor: "rgb(255, 255, 255)",
    backgroundColor: "rgb(0, 0, 0)"
  },
  textStyle: {
    color: "rgb(255, 255, 255)",
    fontSize: 12
  }
});

// This function makes a request to the REST API to add a pattern to the database.
async function addPattern(sharedPattern : PatternPackage, sharingState : string, navigation,
                          setSharingState : React.Dispatch<React.SetStateAction<string>>)
                         : Promise<void> {
  if (sharingState === "pending") {return;}
  try {
    const request = JSON.stringify(sharedPattern);
    const response = await fetch(`${rootURL}add_pattern`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: request
    });
    if (response.status === 202) {
      store.dispatch(setPatternName(sharedPattern.name));
      navigation.navigate("Main Screen");
    }
    else {
      setSharingState("failed");
    }
  }
  catch(error) {
    setSharingState("failed");
  }
}

const SharePatternScreen = ({navigation}) => {
  const window = useWindowDimensions();
  const [sharingState, setSharingState] = useState("pending");
  const [sharedPattern, setSharedPattern] = useState(patternPackage("", ""));
  const [nameInput, setNameInput] = useState("");
  const [commentsInput, setCommentsInput] = useState("");
  const username = store.getState().username;
  const boardArraySize = store.getState().boardArraySize;
  const max = boardArraySize - 1;
  const min = -max;

  const pendingText = "You can share a pattern you've created with other app users here.  \
  Patterns shared\
  in this way will be made available to other users under the GNU Free Documentation\
  License 1.3.  This license can be found here: http://www.gnu.org/licenses/fdl-1.3.html.\
  The app maintainer reserves the right to remove patterns from the database if misuse\
  of this online service is deemed to have occured.  No guarantee is made as to how\
  long the online service will presist.  Having said that, have fun!";

  const failedText = "There's a problem with the server and the pattern can't be shared at this \
  time.  Sorry about that.";

  const patternObject = {
    boardArraySize: boardArraySize,
    liveCells: savePattern(gameBoardObject.gameBoard, min, max)
  };
  useEffect(() => {addPattern(sharedPattern, sharingState, navigation, setSharingState)},
            [sharingState]);
  
  return (
    <View style={styles.containerView}>
      {sharingState === "sharing" ?
        <View style={styles.waitView}>
          <ActivityIndicator color="rgb(255, 255, 255)" size="large"/>
        </View>
      :
        <>
          <View style={[styles.bodyView, {flexBasis: window.height / 4}]}>
            <Text style={styles.textStyle}>
              {sharingState === "pending" ? pendingText : failedText}
            </Text>
          </View>
          <View style={[styles.bodyView, {flexBasis: window.height / 8}]}>
          <TextInput style={[styles.textStyle, {flex: 1}]}
                     placeholder="Pattern name"
                     placeholderTextColor="rgb(255, 255, 255)"
                     onChangeText={newText => setNameInput(newText)}/>
          </View>
          <View style={[styles.bodyView, {flexBasis: window.height / 8}]}>
          <TextInput style={[styles.textStyle, {flex: 1}]}
                     placeholder="Comments"
                     placeholderTextColor="rgb(255, 255, 255)"
                     onChangeText={newText => setCommentsInput(newText)}/>
          </View>
          <TouchableOpacity style={[styles.bodyView, {flexBasis: window.height / 8,
                                    borderWidth: sharingState === "pending" ? 1 : 0}]}
                            onPress={() => {
                              setSharedPattern(patternPackage(nameInput, commentsInput, username,
                                                              patternObject));
                              setSharingState("sharing");
                            }}
                            disabled={sharingState === "failed"}>
            <Text style={[styles.textStyle,
                          {fontSize: 24,
                           color: sharingState === "pending" ? "rgb(255, 255, 255)" :
                                  "rgb(0, 0, 0)"}]}>
              Share
            </Text>
          </TouchableOpacity>
          <View style={[styles.bodyView, {flexBasis: window.height * (3 / 8), borderWidth: 0}]}/>
        </>
      }
    </View>
  )
}

export default SharePatternScreen;

