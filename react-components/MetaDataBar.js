import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  textStyle: {
    color: "rgb(255, 255, 255)",
    fontSize: 13
  }
});

// This is a helper function to allow the component function to be simpler.
function scheduleUpdate(getState1, getState2, getState3, setReport1, setReport2, setReport3,
                        period) {
  const intervalID = setInterval(() => {
    setReport1(getState1());
    setReport2(getState2());
    setReport3(getState3());
    }, period);
    return () => {clearInterval(intervalID)};
}

// This component is used to display three pieces of meta data about the game state, each of which
// is updated dynamically every {period} ms.
const MetaDataBar = ({style, getState1, getState2, getState3, stateName1, stateName2, stateName3,
                      period}) => {
  const [report1, setReport1] = useState("null");
  const [report2, setReport2] = useState("null");
  const [report3, setReport3] = useState("null");
  useEffect(() => scheduleUpdate(getState1, getState2, getState3, setReport1, setReport2,
                                 setReport3, period), []);
  
  return (
    <View style={style}>
      <Text style={styles.textStyle}>{stateName1}: {report1}    {stateName2}: {report2}    {stateName3}: {report3}</Text>
    </View>
  );
};

export {MetaDataBar};
