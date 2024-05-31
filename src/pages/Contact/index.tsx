import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';

const Contact = ({navigation, route}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = async () => {
    const cartId =
      route?.params?.cartId || '320e0672-3670-4950-a046-2efeaa30f603';
    const hotelId = '014a3ea7-481c-4975-8cfa-fa6861b2700a';
    const roomId = '4';

    // await addHotelToCart(cartId, hotelId, roomId);
    navigation.navigate('Payment');
  };
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 24, marginTop: 12}}>
          Welcome To <Text style={{fontWeight: 700}}>SimpleNight</Text>
        </Text>
        <Text style={{fontSize: 24, marginTop: 12}}>Contact Details</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          label="First Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          label="Last Name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          style={styles.input}
        />
        <TextInput
          label="Country"
          value={country}
          onChangeText={setCountry}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Submit
        </Button>
      </View>
    </View>
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
export default Contact;
