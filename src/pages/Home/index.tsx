import React from 'react';
import {ImageBackground, Text, View} from 'react-native';

const HomeScreen = () => {
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
};

export default HomeScreen;
