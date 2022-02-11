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
    justifyContent: "space-around",
    backgroundColor: "rgb(0, 0, 0)",
    borderWidth: 0,
    borderColor: "rgb(255, 255, 255)"
  },
  textStyle1: {
    color: "rgb(255, 255, 255)",
    fontSize: 12
  },
  textStyle2: {
    color: "rgb(255, 255, 255)",
    fontSize: 24
  }
});

// This is a helper function for updating the game survival or birth rules in response to
// checkboxes being flipped in the SetGameRulesScreen component.
function updateRules(rules : boolean[], rule0 : boolean, rule1 : boolean, rule2 : boolean,
                     rule3 : boolean, rule4 : boolean, rule5 : boolean, rule6 : boolean,
                     rule7 : boolean, rule8 : boolean) {
  if (rule0 !== null) {return [rule0, rules[1], rules[2], rules[3], rules[4], rules[5],
                               rules[6], rules[7], rules[8]]}
  if (rule1 !== null) {return [rules[0], rule1, rules[2], rules[3], rules[4], rules[5],
                               rules[6], rules[7], rules[8]]}
  if (rule2 !== null) {return [rules[0], rules[1], rule2, rules[3], rules[4], rules[5],
                               rules[6], rules[7], rules[8]]}
  if (rule3 !== null) {return [rules[0], rules[1], rules[2], rule3, rules[4], rules[5],
                               rules[6], rules[7], rules[8]]}
  if (rule4 !== null) {return [rules[0], rules[1], rules[2], rules[3], rule4, rules[5],
                               rules[6], rules[7], rules[8]]}
  if (rule5 !== null) {return [rules[0], rules[1], rules[2], rules[3], rules[4], rule5,
                               rules[6], rules[7], rules[8]]}
  if (rule6 !== null) {return [rules[0], rules[1], rules[2], rules[3], rules[4], rules[5],
                               rule6, rules[7], rules[8]]}
  if (rule7 !== null) {return [rules[0], rules[1], rules[2], rules[3], rules[4], rules[5],
                               rules[6], rule7, rules[8]]}
  if (rule8 !== null) {return [rules[0], rules[1], rules[2], rules[3], rules[4], rules[5],
                               rules[6], rules[7], rule8]}

return rules;
}

const SetGameRulesScreen = () => {
  const window = useWindowDimensions();
  const tint = {true: "rgb(255, 255, 255)", false: "rgb(0, 0, 160)"};
  const state = useSelector(state => state);
  const dispatch = useDispatch();
  const survivalRules = state.survivalRules;
  const birthRules = state.birthRules;
  const setSurvivalRules_ = (rule0, rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8) => {
    dispatch(setSurvivalRules(updateRules(survivalRules, rule0, rule1, rule2, rule3, rule4, rule5,
                                          rule6, rule7, rule8)));
  };
  const setBirthRules_ = (rule0, rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8) => {
    dispatch(setBirthRules(updateRules(birthRules, rule0, rule1, rule2, rule3, rule4, rule5, rule6,
                                       rule7, rule8)));
  };
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
        <Text style={styles.textStyle1}>Set the survival rules of the game.  Cells will survive with [SELECT BELOW] live neighbours:</Text>
      </View>
      <View style={[styles.itemView, {flexBasis: window.height * 0.0625}]}>
        <CheckBox value={survivalRule0}
                  onValueChange={newValue => {
                    setSurvivalRule0(newValue);
                    setSurvivalRules_(newValue, null, null, null, null, null, null, null, null);
                    
                  }}
                  tintColors={tint}/>
        <CheckBox value={survivalRule1}
                  onValueChange={newValue => {
                    setSurvivalRule1(newValue);
                    setSurvivalRules_(null, newValue, null, null, null, null, null, null, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={survivalRule2}
                  onValueChange={newValue => {
                    setSurvivalRule2(newValue);
                    setSurvivalRules_(null, null, newValue, null, null, null, null, null, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={survivalRule3}
                  onValueChange={newValue => {
                    setSurvivalRule3(newValue);
                    setSurvivalRules_(null, null, null, newValue, null, null, null, null, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={survivalRule4}
                  onValueChange={newValue => {
                    setSurvivalRule4(newValue);
                    setSurvivalRules_(null, null, null, null, newValue, null, null, null, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={survivalRule5}
                  onValueChange={newValue => {
                    setSurvivalRule5(newValue);
                    setSurvivalRules_(null, null, null, null, null, newValue, null, null, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={survivalRule6}
                  onValueChange={newValue => {
                    setSurvivalRule6(newValue);
                    setSurvivalRules_(null, null, null, null, null, null, newValue, null, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={survivalRule7}
                  onValueChange={newValue => {
                    setSurvivalRule7(newValue);
                    setSurvivalRules_(null, null, null, null, null, null, null, newValue, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={survivalRule8}
                  onValueChange={newValue => {
                    setSurvivalRule8(newValue);
                    setSurvivalRules_(null, null, null, null, null, null, null, null, newValue);
                  }}
                  tintColors={tint}/>
      </View>
      <View style={[styles.itemView, {flexBasis: window.height * 0.0625}]}>
        <Text style={styles.textStyle2}>0</Text>
        <Text style={styles.textStyle2}>1</Text>
        <Text style={styles.textStyle2}>2</Text>
        <Text style={styles.textStyle2}>3</Text>
        <Text style={styles.textStyle2}>4</Text>
        <Text style={styles.textStyle2}>5</Text>
        <Text style={styles.textStyle2}>6</Text>
        <Text style={styles.textStyle2}>7</Text>
        <Text style={styles.textStyle2}>8</Text>
      </View>
      <View style={[styles.itemView, {flexBasis: window.height * 0.125}]}>
        <Text style={styles.textStyle1}>Set the birth rules of the game.  Cells will be born with [SELECT BELOW] live neighbours:</Text>
      </View>
      <View style={[styles.itemView, {flexBasis: window.height * 0.0625}]}>
        <CheckBox value={birthRule0}
                  onValueChange={newValue => {
                    setBirthRule0(newValue);
                    setBirthRules_(newValue, null, null, null, null, null, null, null, null);
                    
                  }}
                  tintColors={tint}/>
        <CheckBox value={birthRule1}
                  onValueChange={newValue => {
                    setBirthRule1(newValue);
                    setBirthRules_(null, newValue, null, null, null, null, null, null, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={birthRule2}
                  onValueChange={newValue => {
                    setBirthRule2(newValue);
                    setBirthRules_(null, null, newValue, null, null, null, null, null, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={birthRule3}
                  onValueChange={newValue => {
                    setBirthRule3(newValue);
                    setBirthRules_(null, null, null, newValue, null, null, null, null, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={birthRule4}
                  onValueChange={newValue => {
                    setBirthRule4(newValue);
                    setBirthRules_(null, null, null, null, newValue, null, null, null, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={birthRule5}
                  onValueChange={newValue => {
                    setBirthRule5(newValue);
                    setBirthRules_(null, null, null, null, null, newValue, null, null, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={birthRule6}
                  onValueChange={newValue => {
                    setBirthRule6(newValue);
                    setBirthRules_(null, null, null, null, null, null, newValue, null, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={birthRule7}
                  onValueChange={newValue => {
                    setBirthRule7(newValue);
                    setBirthRules_(null, null, null, null, null, null, null, newValue, null);
                  }}
                  tintColors={tint}/>
        <CheckBox value={birthRule8}
                  onValueChange={newValue => {
                    setBirthRule8(newValue);
                    setBirthRules_(null, null, null, null, null, null, null, null, newValue);
                  }}
                  tintColors={tint}/>
      </View>
      <View style={[styles.itemView, {flexBasis: window.height * 0.0625}]}>
        <Text style={styles.textStyle2}>0</Text>
        <Text style={styles.textStyle2}>1</Text>
        <Text style={styles.textStyle2}>2</Text>
        <Text style={styles.textStyle2}>3</Text>
        <Text style={styles.textStyle2}>4</Text>
        <Text style={styles.textStyle2}>5</Text>
        <Text style={styles.textStyle2}>6</Text>
        <Text style={styles.textStyle2}>7</Text>
        <Text style={styles.textStyle2}>8</Text>
      </View>
    </View>
  );
};

export default SetGameRulesScreen;
