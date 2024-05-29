import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import StackNavigation from '@/src/navigation/Stack';
import {makeActivitySearchAgent} from './src/utils/agents/makeActivitiesAgent';

function App(): JSX.Element {
  const fetchData = async () => {
    try {
      const agent = await makeActivitySearchAgent();
      console.log('agent', agent);
    } catch (error) {
      console.log('Error', error)
    }
  };

  useEffect(() => {
    console.log('fetchData Call')
    fetchData();
  }, []);

  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
}

export default App;
