import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function EventCard({ event, onBet }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{`${event.team1} vs ${event.team2}`}</Text>
      <Text>{`Sport: ${event.sport}`}</Text>
      <Text>{`${event.team1} Odds: ${event.odds1 > 0 ? '+' : ''}${event.odds1}`}</Text>
      <Text>{`${event.team2} Odds: ${event.odds2 > 0 ? '+' : ''}${event.odds2}`}</Text>
      <Button title="Place Bet" onPress={onBet} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  title: { fontSize: 18, fontWeight: 'bold' },
});