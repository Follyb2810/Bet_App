import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DepositScreen({ navigation }) {
  const { confirmPayment } = useStripe();
  const [amount, setAmount] = useState('');

  const handleDeposit = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/payments/deposit',
        { amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { clientSecret } = res.data;
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        Alert.alert('Payment failed', error.message);
        return;
      }

      await axios.post(
        'http://localhost:5000/api/payments/deposit/confirm',
        { paymentIntentId: paymentIntent.id, amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Success', 'Deposit successful');
      navigation.navigate('Profile');
    } catch (err) {
      Alert.alert('Error', err.response?.data?.msg || 'Deposit failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deposit Funds</Text>
      <TextInput
        style={styles.input}
        placeholder="Amount (USD)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <CardField
        postalCodeEnabled={false}
        placeholders={{ number: '4242 4242 4242 4242' }}
        cardStyle={{ backgroundColor: '#fff', textColor: '#000' }}
        style={styles.cardField}
      />
      <Button title="Deposit" onPress={handleDeposit} color="#007bff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: '#000' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  cardField: { height: 50, marginBottom: 20 },
});