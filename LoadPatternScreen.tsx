import React, { useState, useEffect, Dispatch } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, useWindowDimensions }
from 'react-native';
import { useDispatch } from 'react-redux';
import { PatternPackage, patternPackage } from './logic-components/GameLogicTypes';
import { handleResetEvent } from './logic-components/GameLogic';
import { rootURL, store, setPatternName } from './logic-components/StateController';

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: "rgb(0, 0, 64)"
  },
  waitView: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255)"
  },
  resultView: {
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

// This function queries the REST API to retrieve a PatternPackage object, which contains the
// requested game board pattern and its metadata.
async function getPattern(patternId : number,
                          setResultPackage : React.Dispatch<React.SetStateAction<PatternPackage>>,
                          setLoadingState : React.Dispatch<React.SetStateAction<string>>)
                          : Promise<void> {
  try {
    const response = await fetch(`${rootURL}get_pattern?patternId=${patternId}`);
    const result = await response.json();
    result.name = `Name: ${result.name}`;
    result.comments = `Comments: ${result.comments}`;
    setResultPackage(result);
    setLoadingState("completed");
  }
  catch(error) {
    setResultPackage(patternPackage("There's a problem with the server and the selected pattern \
                                     can't be loaded at this time.",
                                     "Sorry about that.  You can return to the previous screen \
                                     with the back button."));
    setLoadingState("failed");
  }
}

// This function makes a request to the REST API to delete a pattern, which will only be possible
// if the correct username is supplied (confirming that this user created the pattern).
async function deletePattern(patternId : number, username : string,
                             setResultPackage : React.Dispatch<React.SetStateAction<PatternPackage>>,
                             setLoadingState : React.Dispatch<React.SetStateAction<string>>)
                            : Promise<void> {
  setLoadingState("deleting");
  try {
    const request = JSON.stringify({
      patternId: patternId,
      username: username
    });
    const response = await fetch(`${rootURL}delete_pattern`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: request
    });
    if (response.status === 202) {
      setResultPackage(patternPackage("The pattern was successfully deleted.", ""));
      setLoadingState("deleted");
    }
    else {
      setResultPackage(patternPackage("The pattern could not be deleted.", ""));
      setLoadingState("deleted");
    }
  }
  catch(error) {
    setResultPackage(patternPackage("The pattern could not be deleted.", ""));
    setLoadingState("deleted");
  }
}

function triggerLoadPattern(boardArraySize : number, resultPackage : PatternPackage,
                            setResultPackage : React.Dispatch<React.SetStateAction<PatternPackage>>,
                            setLoadingState : React.Dispatch<React.SetStateAction<string>>,
                            dispatch : Dispatch<any>, navigation) : void {
  if (resultPackage.patternObject.boardArraySize > boardArraySize) {
    setResultPackage(patternPackage("This pattern is bigger than the game board simulated by the \
                                     app and therefore can't be loaded.",
                                    "Sorry about that."));
    setLoadingState("failed");
  }
  else {
    dispatch(setPatternName(resultPackage.name.substring(6)));
    handleResetEvent(boardArraySize, resultPackage.patternObject.liveCells);
    navigation.navigate("MainScreen");
  }
}

// This component renders the Load and Delete options the user is conditionally presented with
// upon a successful or failed retrieval of a PatternPackage object.
const LoadingOptions = ({loadDisabled, deleteDisabled, window, boardArraySize, resultPackage,
                         setResultPackage, setLoadingState, dispatch, navigation, patternId,
                         username}) => {
  return (
    <>
      <TouchableOpacity style={[styles.resultView, {flexBasis: window.height / 8,
                                                    borderWidth: loadDisabled ? 0 : 1}]}
                        onPress={() => triggerLoadPattern(boardArraySize, resultPackage,
                                                          setResultPackage, setLoadingState,
                                                          dispatch, navigation)}
                        disabled={loadDisabled}>
        <Text style={[styles.textStyle,
                      {fontSize: 24,
                       color: loadDisabled ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)"}]}>
          Load
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.resultView, {flexBasis: window.height / 8,
                                                    borderWidth: deleteDisabled ? 0 : 1}]}
                        onPress={() => deletePattern(patternId, username, setResultPackage,
                                                     setLoadingState)}
                        disabled={deleteDisabled}>
        <Text style={[styles.textStyle,
                      {fontSize: 24,
                       color: deleteDisabled ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)"}]}>
          Delete
        </Text>
      </TouchableOpacity>
    </>
  )
}

const LoadPatternScreen = ({navigation, route}) => {
  const window = useWindowDimensions();
  const [resultPackage, setResultPackage] = useState(patternPackage("", ""));
  const [loadingState, setLoadingState] = useState("loading");
  const boardArraySize = store.getState().boardArraySize;
  const username = store.getState().username;
  const dispatch = useDispatch();
  useEffect(() => {getPattern(route.params.patternId, setResultPackage, setLoadingState)}, []);
  return (
    <View style={styles.containerView}>
      {loadingState === "loading" || loadingState === "deleting" ?
        <View style={styles.waitView}>
          <ActivityIndicator color="rgb(0, 0, 180)" size="large"/>
        </View>
      :
        <>
          <View style={[styles.resultView, {flexBasis: window.height / 2}]}>
            <Text style={styles.textStyle}>
              {resultPackage.name}
              {"\n\n"}
              {resultPackage.comments}
              {"\n\n"}
              All the patterns made available through this app upon its launch were obtained from
              the archive at https://conwaylife.com/wiki/Category:Patterns.  They are distributed
              here under the same GNU Free Documentation License 1.3 that they were distributed
              under by said website.  The GNU Free Documentation License 1.3 also applies to any
              patterns shared by app users.  This license can be found here:
              http://www.gnu.org/licenses/fdl-1.3.html.
            </Text>
          </View>
          <LoadingOptions loadDisabled={loadingState === "failed" || loadingState === "deleted"}
                          deleteDisabled={loadingState === "failed" || loadingState === "deleted" ||
                                          username !== resultPackage.username}
                          window={window}
                          boardArraySize={boardArraySize}
                          resultPackage={resultPackage}
                          setResultPackage={setResultPackage}
                          setLoadingState={setLoadingState}
                          dispatch={dispatch}
                          navigation={navigation}
                          patternId={route.params.patternId}
                          username={username}/>
          <View style={[styles.resultView, {flexBasis: window.height / 4, borderWidth: 0}]}/>
      </>
      }
    </View>
  );
};

export default LoadPatternScreen;

