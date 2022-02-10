import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import CheckBox from '@react-native-community/checkbox';
import { setSurvivalRules, setBirthRules } from './logic-components/StateController';

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: "rgb(0, 0, 0)"
  },
  itemView: {
    flexShrink: 0,
    flexGrow: 0,
    flexDirection: 'row',
    backgroundColor: "rgb(0, 0, 0)",
    borderWidth: 1,
    borderColor: "rgb(255, 255, 255)"
  },
  textStyle: {
    color: "rgb(255, 255, 255)",
    fontSize: 12
  }
});

const SetGameRulesScreen = () => {

  const window = useWindowDimensions();
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const setSurvivalRules = 

  const [survivalRule0, setSurvivalRule0] = useState(state.survivalRules[0]);
  const [survivalRule1, setSurvivalRule1] = useState(state.survivalRules[1]);
  const [survivalRule2, setSurvivalRule2] = useState(state.survivalRules[2]);
  const [survivalRule3, setSurvivalRule3] = useState(state.survivalRules[3]);
  const [survivalRule4, setSurvivalRule4] = useState(state.survivalRules[4]);
  const [survivalRule5, setSurvivalRule5] = useState(state.survivalRules[5]);
  const [survivalRule6, setSurvivalRule6] = useState(state.survivalRules[6]);
  const [survivalRule7, setSurvivalRule7] = useState(state.survivalRules[7]);
  const [survivalRule8, setSurvivalRule8] = useState(state.survivalRules[8]);

  const [birthRule0, setBirthRule0] = useState(state.birthRules[0]);
  const [birthRule1, setBirthRule1] = useState(state.birthRules[1]);
  const [birthRule2, setBirthRule2] = useState(state.birthRules[2]);
  const [birthRule3, setBirthRule3] = useState(state.birthRules[3]);
  const [birthRule4, setBirthRule4] = useState(state.birthRules[4]);
  const [birthRule5, setBirthRule5] = useState(state.birthRules[5]);
  const [birthRule6, setBirthRule6] = useState(state.birthRules[6]);
  const [birthRule7, setBirthRule7] = useState(state.birthRules[7]);
  const [birthRule8, setBirthRule8] = useState(state.birthRules[8]);

  return (
    <View style={styles.containerView}>
      <View style={[styles.itemView, {flexBasis: window.height * 0.125}]}>
        <Text style={styles.textStyle}>Set the survival rules of the game</Text>
      </View>
      <View style={[styles.itemView, {flexBasis: window.height * 0.125}]}>
        <CheckBox value={survivalRule0}
                  onValueChange={newValue => {
                    setSurvivalRule0(newValue);

                  }}/>
      </View>
    </View>
  )

};
