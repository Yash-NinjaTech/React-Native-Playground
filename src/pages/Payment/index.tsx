import {useNavigation} from '@react-navigation/native';
import {cartCheckout} from '@src/networking/create-cart';
import React, {useState} from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Button, TextInput} from 'react-native-paper';

const Payment = ({navigation, route}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = async () => {
    const cartCheckoutRes = await cartCheckout(
      '7ca0365b-e488-46f1-b1c7-86976feeb804',
    );
    Alert.alert(
      'Hotel Book Successfully',
      'Check order confirmation in your email',
    );
  };
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={{alignItems: 'center'}}>
        <Text style={{fontSize: 24, marginTop: 12}}>
          Welcome To <Text style={{fontWeight: 700}}>SimpleNight</Text>
        </Text>
        <Text style={{fontSize: 24, marginTop: 12}}>Payment</Text>
      </View>
      <View style={styles.container}>
        <TextInput
          label="Card Holder Name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          label="Card Number"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          label="Expiration"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          label="CVC"
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
export default Payment;
