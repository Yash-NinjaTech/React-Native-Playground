/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';

function App(): JSX.Element {
  return (
    <ImageBackground
      source={{
        uri: 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA3L2pvYjE0NDgtYmFja2dyb3VuZC0wNGEteF8xLmpwZw.jpg',
      }}
      style={{width: '100%', height: '100%'}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 24}}>
          Welcome To <Text style={{fontWeight: 700}}>SimpleNight</Text>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
