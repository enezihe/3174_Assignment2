import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

export default function MainScreen({ navigation }) {
  const [baseCurrency, setBaseCurrency] = useState('CAD');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = 'fca_live_e6wCn6y45iDCSl6N7FZnzMPjLXiQ8cNdQ0vUkJca'; // put your FreeCurrencyAPI key here

  function validateInputs() {
    const currencyRegex = /^[A-Z]{3}$/;

    if (!currencyRegex.test(baseCurrency)) {
      return 'Base currency must be a 3-letter uppercase code.';
    }

    if (!currencyRegex.test(targetCurrency)) {
      return 'Destination currency must be a 3-letter uppercase code.';
    }

    const numericAmount = Number(amount);

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      return 'Amount must be a positive number.';
    }

    return '';
  }

  async function handleConvert() {
    setError('');
    setResult(null);
    setRate(null);

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    const numericAmount = Number(amount);

    try {
      setLoading(true);

      const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&base_currency=${baseCurrency}&currencies=${targetCurrency}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network error. Please try again.');
      }

      const json = await response.json();

      if (!json || !json.data || json.data[targetCurrency] == null) {
        throw new Error('Could not find the requested currency.');
      }

      const exchangeRate = Number(json.data[targetCurrency]);

      const converted = numericAmount * exchangeRate;

      setRate(exchangeRate);
      setResult(converted);
    } catch (err) {
      setError(err.message || 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Converter</Text>

      <View style={styles.field}>
        <Text style={styles.label}>Base Currency</Text>
        <TextInput
          style={styles.input}
          value={baseCurrency}
          onChangeText={setBaseCurrency}
          autoCapitalize="characters"
          maxLength={3}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Destination Currency</Text>
        <TextInput
          style={styles.input}
          value={targetCurrency}
          onChangeText={setTargetCurrency}
          autoCapitalize="characters"
          maxLength={3}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Convert" onPress={handleConvert} disabled={loading} />
      )}

      {result != null && rate != null && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            {amount} {baseCurrency} = {result.toFixed(4)} {targetCurrency}
          </Text>
          <Text style={styles.rateText}>
            Exchange rate: 1 {baseCurrency} = {rate.toFixed(4)} {targetCurrency}
          </Text>
        </View>
      )}

      <View style={styles.aboutButton}>
        <Button
          title="Go to About"
          onPress={() => navigation.navigate('About')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  resultBox: {
    marginTop: 24,
    padding: 12,
    borderRadius: 6,
    backgroundColor: '#e8f5e9',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  rateText: {
    fontSize: 14,
  },
  aboutButton: {
    marginTop: 32,
  },
});
