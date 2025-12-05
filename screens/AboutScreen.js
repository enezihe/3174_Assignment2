import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native App</Text>

      <Text style={styles.label}>Full Name:</Text>
      <Text style={styles.text}>Nezihe Tekin</Text>

      <Text style={styles.label}>Student ID:</Text>
      <Text style={styles.text}>101330993</Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.text}>
        This application converts currency values using live exchange rates from an online API.
        The user enters two currency codes and an amount, and the app displays the converted value
        and the exchange rate used.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-start',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  text: {
    fontSize: 15,
    marginTop: 4,
    marginBottom: 8,
  },
});
