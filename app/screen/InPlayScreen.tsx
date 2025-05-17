import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import EventCard from '../components/EventCard';

export default function InPlayScreen({ navigation }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchInPlayEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events/inplay');
        setEvents(res.data);
      } catch (err) {
        alert('Error fetching in-play events');
      }
    };
    fetchInPlayEvents();
    const interval = setInterval(fetchInPlayEvents, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>In-Play Events</Text>
      <FlatList
        data={events}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <EventCard event={item} onBet={() => navigation.navigate('Bet Slip', { event, type: 'in-play' })} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: '#000' },
});