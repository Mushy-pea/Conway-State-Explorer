import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  textStyle: {
    color: "rgb(255, 255, 255)",
    fontSize: 12
  }
});

// This is a helper function to allow the component function to be simpler.
function scheduleUpdate(getState1 : () => String, getState2 : () => String,
                        getState3 : () => String,
                        setReport1 : React.Dispatch<React.SetStateAction<String>>,
                        setReport2 : React.Dispatch<React.SetStateAction<String>>,
                        setReport3 : React.Dispatch<React.SetStateAction<String>>,
                        period : number) : () => void {
  const intervalID = setInterval(() => {
    setReport1(getState1());
    setReport2(getState2());
    setReport3(getState3());
    }, period);
    return () => {clearInterval(intervalID)};
}

// This component is used to display three pieces of meta data about the game state, each of which
// is updated dynamically every {period} ms.
const MetaDataBar = ({style, window, getState1, getState2, getState3, stateName1, stateName2,
                      stateName3, period}) => {
  const [report1, setReport1] = useState("null");
  const [report2, setReport2] = useState("null");
  const [report3, setReport3] = useState("null");
  const aspectRatio = window.height / window.width;
  useEffect(() => scheduleUpdate(getState1, getState2, getState3, setReport1, setReport2,
                                 setReport3, period), []);
  if (aspectRatio < 1.877777) {
    return (
      <View style={style}>
        <Text style={styles.textStyle}>{stateName1}: {report1}    {stateName2}: {report2}    {stateName3}: {report3}</Text>
      </View>
    );
  }
  else if (aspectRatio < 2.024074) {
    return (
      <View style={style}>
        <Text style={[styles.textStyle, {fontSize: 14}]}>{stateName1}: {report1}    {stateName2}: {report2}</Text>
        <Text style={[styles.textStyle, {fontSize: 14}]}>{stateName3}: {report3}</Text>
      </View>
    );
  }
  else {
    return (
      <View style={style}>
        <Text style={[styles.textStyle, {fontSize: 14}]}>{stateName1}: {report1}</Text>
        <Text style={[styles.textStyle, {fontSize: 14}]}>{stateName2}: {report2}</Text>
        <Text style={[styles.textStyle, {fontSize: 14}]}>{stateName3}: {report3}</Text>
      </View>
    );
  }
};

export {MetaDataBar};
