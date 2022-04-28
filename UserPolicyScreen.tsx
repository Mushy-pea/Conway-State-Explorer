import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, ScrollView, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store, setPolicyAgreedFlag } from './logic-components/StateController';

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    backgroundColor: "rgb(0, 0, 0)"
  },
  baseText: {
    fontSize: 12,
    color: "rgb(255, 255, 255)"
  },
  headingText: {
    fontWeight: "bold"
  }
});

// This function updates the policyAgreedFlag in both the device async storage and the Redux store.
async function updatePolicyAgreedFlag(flag : string) : Promise<void> {
  store.dispatch(setPolicyAgreedFlag(flag));
  try {
    await AsyncStorage.setItem("policyAgreedFlag", flag);
    console.log(`updatePolicyAgreedFlag: policyAgreedFlag is ${flag}`);
  }
  catch(error) {
    console.error(`updatePolicyAgreedFlag failed with error: ${error}`);
  }
}

const UserPolicyScreen = ({navigation, route}) => {
  const policyAgreedFlagBool = () => {
    const policyAgreedFlag = store.getState().policyAgreedFlag;
    if (policyAgreedFlag === "true") { return true }
    else { return false }
  };
  const [agreeBox, setAgreeBox] = useState(policyAgreedFlagBool());
  const [decisionMade, setDecisionMade] = useState(false);
  if (route.params.redirected && decisionMade === false) {
    Alert.alert(
      "You've been redirected",
      "Hello there.  I hope you're enjoying the app so far.  As the Share Pattern screen involves \
user generated content (UGC) you need to agree to this app's User Policy before accessing it.  \
This is so users know where they stand with UGC and to comply with Google Play policies.  \
Agreement is voluntary and all other app features remain accessible in either case."
    );
  }
  useEffect(() => {
    if (decisionMade) {
      if (agreeBox) { updatePolicyAgreedFlag("true") }
      else { updatePolicyAgreedFlag("false") }
      navigation.navigate(route.params.nextScreen);
    }
  }, [agreeBox]);
  const tint = {true: "rgb(255, 255, 255)", false: "rgb(0, 0, 160)"};
  return (
    <ScrollView style={styles.containerView}>
      <Text style={styles.baseText}>
        <Text style={styles.headingText}>
          Conway State Explorer User Policy
          {"\n\n"}
          1.  Definitions
        </Text>
        {"\n\n"}
        Conway State Explorer Android Application / the Application: The Conway State Explorer 
        application that runs on Android devices, made available to Android users through Google 
        Play.
        {"\n\n"}
        Conway State Explorer Online Service / the Online Service: A cloud hosted server application 
        that augments the Conway State Explorer Android Application by allowing for additional 
        functionality.  Specifically, it allows users to access and contribute to a repository of 
        cellular automata Board Patterns.
        {"\n\n"}
        Developer / Application Maintainer: The developer of the software described above, namely 
        Steven Tinsley.  This same person developed this software and undertakes to maintain the 
        Application and the Online Service for the duration that they are available for install 
        through Google Play and available as an online service, respectively.
        {"\n\n"}
        Cellular Automata Board Patterns / Board Patterns: Initial game board patterns for Conway's 
        Game of Life and related cellular automata.  Within this policy these terms refer to both 
        the board patterns themselves and the related metadata that the Online Service holds for 
        them.
        {"\n\n"}
        <Text style={styles.headingText}>
          2.  Introduction
        </Text>
        {"\n\n"}
        Thanks for installing the Conway State Explorer Android Application!  This application is 
        intended to provide an Android based cellular automata simulation platform for research and 
        / or amusement purposes.  It is based on an open source project that can be found here: 
        https://github.com/Mushy-pea/Conway-State-Explorer .  The Application is augmented by an 
        Online Service that allows users to access and contribute to a repository of cellular 
        automata Board Patterns.  This user policy has been created so that users know where they 
        stand when using the Online Service and to comply with Google Play Developer Program 
        Policies related to user generated content.
        {"\n\n"}
        If you wish to access Board Patterns held by the Online Service you just need to be aware 
        of how this content is licensed, which is explained in section 3.  Such Board Patterns can 
        be accessed using the Load Pattern screen found through the Application's menu system, 
        which also contains the same license notice.  If you wish to contribute a Board Pattern to 
        the Online Service (using The Application's Share Pattern screen) you need to also read 
        sections 4 and 5 and confirm your agreement to this policy by ticking the box below it.
        {"\n\n"}
        <Text style={styles.headingText}>
          3.  Accessing Board Patterns held by the Online Service
        </Text>
        {"\n\n"}
        All of the Board Patterns held by the Online Service upon the release of the Application 
        were obtained by the Developer from the archive hosted at 
        https://conwaylife.com/wiki/Category:Patterns, where they were kindly made available under 
        the GNU Free Documentation License 1.3.  This license can be found here: 
        http://www.gnu.org/licenses/fdl-1.3.html.  They are made available through the Application 
        under the same GNU Free Documentation License 1.3 that they were distributed under by said 
        website.
        {"\n\n"}
        <Text style={styles.headingText}>
          4.  Contributing Board Patterns to the Online Service
        </Text>
        {"\n\n"}
        If you choose to contribute a Board Pattern to the Online Service using the Application's 
        Share Pattern screen, it will be made available to users of the Application under the same 
        GNU Free Documentation License 1.3 referred to in section 3.  The Name and Comments fields 
        on the Share Pattern screen should be used to name and describe the Board Pattern in the 
        context of cellular automata exploration or research, with the option to give your own name.
        {"\n\n"}
        In the Developer's view cellular automata research is a peaceful process of exploring 
        mathematical beauty that has always been here.  If in the Developer's view the Share 
        Pattern feature is used in a way that diverges far enough from this ethos it may be 
        considered as misuse of the Online Service.  As a example, using the Comments field to 
        direct abusive and / or aggressive comments at any person or group of people, or to attempt 
        to bring the Online Service into disrepute, would be considered misuse.  Such decisions are 
        at the sole discretion of the Developer and if misuse is deemed to have occured, the 
        relevant Board Pattern may be removed and the user blocked from making further 
        contributions without notice.
        {"\n\n"}
        The Application creates a pseudorandom username for each user.  Although this is not 
        visible to users it is held by the Online Service with any Board Pattern they contribute.  
        Through this mechanism Board Patterns can be deleted from the Online Service, but only by 
        the user who contributed them.
        {"\n\n"}
        <Text style={styles.headingText}>
          5.  Reliability and persistence of the Online Service
        </Text>
        {"\n\n"}
        The Online Service has been developed to add interactivity to the Application and as a 
        learning project for the Developer.  It is not claimed to have the reliability or security 
        that one might expect from a backup service and should not be relied on as such.  Indeed, 
        it may be shut down permanently without notice.  At some point the Developer may decide to 
        contribute some Board Patterns that users have contributed to the Online Service to the 
        archive at https://conwaylife.com/wiki/Category:Patterns, but there is no guarantee.

        If you are happy to accept this policy please check the box below to confirm your agreement.
        {"\n\n"}
      </Text>
      <CheckBox value={agreeBox}
                onValueChange={newValue => {
                  setDecisionMade(true);
                  setAgreeBox(newValue);
                }}
                tintColors={tint}/>
    </ScrollView>
  );
}

export default UserPolicyScreen;

