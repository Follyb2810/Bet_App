import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [bets, setBets] = useState([]);
  const [balance, setBalance] = useState(1000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const betsRes = await axios.get('http://localhost:5000/api/bets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBets(betsRes.data);

        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBalance(userRes.data.balance);
      } catch (err) {
        alert('Error fetching data');
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text>{`Balance: $${balance}`}</Text>
      <Text style={styles.subtitle}>Your Bets</Text>
      <FlatList
        data={bets}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.bet}>
            <Text>{`${item.eventId.team1} vs ${item.eventId.team2}`}</Text>
            <Text>{`Bet: $${item.amount} on ${item.selection}`}</Text>
            <Text>{`Status: ${item.status}`}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 18, marginTop: 10 },
  bet: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});