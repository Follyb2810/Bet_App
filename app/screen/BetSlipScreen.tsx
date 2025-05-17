import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BetSlipScreen({ route, navigation }) {
  const { event, type = 'pre-match' } = route.params;
  const [amount, setAmount] = useState('');
  const [selection, setSelection] = useState(event.team1);

  const handleBet = async () => {
    try {
      const geoRes = await axios.get('http://localhost:5000/api/geolocation');
      if (!geoRes.data.allowed) return alert('Betting not allowed in your state');

      const token = await AsyncStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/bets',
        { eventId: event._id, amount: parseFloat(amount), selection, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Bet placed!');
      navigation.navigate('Profile');
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{type === 'in-play' ? 'In-Play Bet' : 'Place Bet'}</Text>
      <Text style={styles.text}>{`${event.team1} vs ${event.team2}`}</Text>
      <TextInput
        style={styles.input}
        placeholder="Bet Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      <Text style={styles.text}>Select Team:</Text>
      <View style={styles.buttonContainer}>
        <Button title={event.team1} onPress={() => setSelection(event.team1)} color="#007bff" />
        <Button title={event.team2} onPress={() => setSelection(event.team2)} color="#007bff" />
      </View>
      <Button title="Confirm Bet" onPress={handleBet} color="#007bff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: '#000' },
  text: { fontSize: 14, color: '#000', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
});