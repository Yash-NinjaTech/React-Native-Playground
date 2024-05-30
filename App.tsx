import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import StackNavigation from '@src/navigation/Stack';

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
}

export default App;
