import {createCart} from '@src/networking/create-cart';
import {
  hotelSearchAndDetailsSDK,
  hotelSearchSDK,
} from '@src/networking/hotel-search-details';
import {getCoordinatesForLocation} from '@src/utils/tools/geocodeTool';
import moment from 'moment';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Button, TextInput} from 'react-native-paper';

const HomeScreen = ({navigation}) => {
  const [locationName, setLocationName] = useState('');
  const [number, setNumber] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hotelDetails, setHotelDetails] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);
    const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
    const formatNum = Number(number);
    try {
      const geoCodes = await getCoordinatesForLocation(locationName);

      const hotelData = await hotelSearchAndDetailsSDK(
        formattedStartDate,
        formattedEndDate,
        geoCodes,
        formatNum,
      );
      setHotelDetails(hotelData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handlePress = async () => {
    try {
      const cartId = await createCart();
      navigation.navigate('Contact', {cartId: cartId});
    } catch (error) {}
  };
  const Item = ({title, rooms, hotelId}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={rooms.slice(0, 4)}
        renderItem={({item}) => (
          <View style={styles.roomContainer}>
            <Text style={styles.roomName}>{item.name}</Text>
            <Button onPress={handlePress}>Add To Cart</Button>
          </View>
        )}
        keyExtractor={room => room.id}
      />
    </View>
  );

  return (
    // <ImageBackground
    //   source={{
    //     uri: 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA3L2pvYjE0NDgtYmFja2dyb3VuZC0wNGEteF8xLmpwZw.jpg',
    //   }}
    //   style={{width: '100%', height: '100%'}}>
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 24, marginTop: 12}}>
          Welcome To <Text style={{fontWeight: 700}}>SimpleNight</Text>
        </Text>
        <Text style={{fontSize: 24, marginTop: 12}}>
          Let's Start With Hotel Booking
        </Text>
      </View>
      <View style={styles.container}>
        <TextInput
          label="Where do you want to go?"
          value={locationName}
          onChangeText={setLocationName}
          style={styles.input}
        />
        <Text style={styles.label}>Start Date:</Text>
        <Button
          mode="outlined"
          onPress={() => setOpenStartDatePicker(true)}
          style={styles.button}>
          Select Start Date
        </Button>
        <DatePicker
          modal
          open={openStartDatePicker}
          date={startDate}
          mode="date"
          onConfirm={date => {
            setOpenStartDatePicker(false);
            setStartDate(date);
          }}
          onCancel={() => {
            setOpenStartDatePicker(false);
          }}
        />

        <Text style={styles.label}>End Date:</Text>
        <Button
          mode="outlined"
          style={styles.button}
          onPress={() => setOpenEndDatePicker(true)}>
          Select End Date
        </Button>
        <DatePicker
          modal
          open={openEndDatePicker}
          date={endDate}
          mode="date"
          onConfirm={date => {
            setOpenEndDatePicker(false);
            setEndDate(date);
          }}
          onCancel={() => {
            setOpenEndDatePicker(false);
          }}
        />

        <TextInput
          label="How many people are in your party total?"
          value={number}
          onChangeText={setNumber}
          keyboardType="numeric"
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Submit
        </Button>
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={hotelDetails}
          renderItem={({item}) => (
            <Item title={item.name} rooms={item.rooms} hotelId={item.id} />
          )}
          keyExtractor={item => item.id}
        />
      )}
    </View>
    // </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  datePicker: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  button: {
    marginBottom: 16,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 24,
  },
  roomName: {
    fontSize: 16,
  },
  roomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default HomeScreen;
