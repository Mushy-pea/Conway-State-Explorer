import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, useWindowDimensions }
from 'react-native';
import { useDispatch } from 'react-redux';
import { PatternPackage, patternPackage } from './logic-components/GameLogicTypes';
import { handleResetEvent } from './logic-components/GameLogic';
import { rootURL, setPatternName, store } from './logic-components/StateController';

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
    setResultPackage(result);
    setLoadingState("completed");
  }
  catch(error) {
    setResultPackage(patternPackage("There's a problem with the server and the selected pattern can't be loaded at this time.",
                                     "Sorry about that.  You can return to the previous screen with the back button."));
    setLoadingState("failed");
  }
}

const LoadPatternScreen = ({navigation, route}) => {
  const window = useWindowDimensions();
  const [resultPackage, setResultPackage] = useState(patternPackage("", ""));
  const [loadingState, setLoadingState] = useState("loading");
  const boardArraySize = store.getState().boardArraySize;
  const dispatch = useDispatch();
  useEffect(() => {getPattern(route.params.patternId, setResultPackage, setLoadingState)}, []);
  return (
    <View style={styles.containerView}>
      {loadingState === "loading" ?
        <View style={styles.waitView}>
          <ActivityIndicator color="rgb(0, 0, 180)" size="large"/>
        </View>
      :
        <>
          <View style={[styles.resultView, {flexBasis: window.height / 2}]}>
            <Text style={styles.textStyle}>
              Name: {resultPackage.name}
              {"\n"}
              {"\n"}
              Comments: {resultPackage.comments}
            </Text>
          </View>
          <TouchableOpacity style={[styles.resultView, {flexBasis: window.height / 8}]}
                            onPress={() => {
                              handleResetEvent(boardArraySize,
                                               resultPackage.patternObject.liveCells);
                              dispatch(setPatternName(resultPackage.name));
                              navigation.navigate("MainScreen");
                            }}>
            <Text style={[styles.textStyle, {fontSize: 24}]}>Load</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.resultView, {flexBasis: window.height / 8}]}
                            onPress={null}
                            disabled={true}>
            <Text style={[styles.textStyle, {fontSize: 24}]}>Delete</Text>
          </TouchableOpacity>
      </>
      }
    </View>
  );
};

export default LoadPatternScreen;

