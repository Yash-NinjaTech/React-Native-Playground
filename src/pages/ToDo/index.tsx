import {searchActivitiesV4} from '@src/networking/search-activities';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const ToDoScreen = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const payload = {
        startDate: '2024-06-16',
        endDate: '2024-06-22',
        startLocation: '40.7127753,-74.0059728',
      };
      const res = await searchActivitiesV4(payload);
      setResult(res.results);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('Error>>agent>>', error);
    }
  };

  useEffect(() => {
    console.log('fetchCall');
    fetchData();
  }, []);

  const Item = ({title}: ItemProps) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Things To Search SDK call</Text>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={result}
          renderItem={({item}) => <Item title={item.name} />}
          keyExtractor={item => item.id}
          refreshing={loading}
          onRefresh={() => fetchData()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  headerTitle: {
    backgroundColor: 'green',
    color: 'white',
    fontSize: 28,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
export default ToDoScreen;
