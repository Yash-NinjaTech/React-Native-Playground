import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import StackNavigation from '@src/navigation/Stack';
import {SafeAreaView, StyleSheet} from 'react-native';

function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default App;
