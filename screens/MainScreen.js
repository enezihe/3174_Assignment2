import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function MainScreen({ navigation }) {
  const [baseCurrency, setBaseCurrency] = useState('CAD');
  const [targetCurrency, setTargetCurrency] = useState('USD');
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_KEY = 'fca_live_e6wCn6y45iDCSl6N7FZnzMPjLXiQ8cNdQ0vUkJca';

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

  function handleSwap() {
    const prevBase = baseCurrency;
    setBaseCurrency(targetCurrency);
    setTargetCurrency(prevBase);

    setError('');
    setRate(null);
    setResult(null);
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
        throw new Error('Could not find the requested currency.';
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
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={baseCurrency}
            onValueChange={value => setBaseCurrency(value)}
            style={styles.picker}
          >
            <Picker.Item label="CAD - Canadian Dollar" value="CAD" />
            <Picker.Item label="USD - US Dollar" value="USD" />
            <Picker.Item label="AUD - Australian Dollar" value="AUD" />
            <Picker.Item label="GBP - British Pound" value="GBP" />
          </Picker>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Destination Currency</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={targetCurrency}
            onValueChange={value => setTargetCurrency(value)}
            style={styles.picker}
          >
            <Picker.Item label="CAD - Canadian Dollar" value="CAD" />
            <Picker.Item label="USD - US Dollar" value="USD" />
            <Picker.Item label="AUD - Australian Dollar" value="AUD" />
            <Picker.Item label="GBP - British Pound" value="GBP" />
          </Picker>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleSwap}>
        <Text style={styles.primaryButtonText}>Swap Currencies</Text>
      </TouchableOpacity>

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

      <View style={{ marginBottom: 12 }}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleConvert}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>Convert</Text>
          </TouchableOpacity>
        )}
      </View>

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

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('About')}
      >
        <Text style={styles.secondaryButtonText}>Go to About</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    backgroundColor: '#F2F2F7',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 28,
    textAlign: 'center',
    color: '#333',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    // overflow removed to avoid clipping text
  },
  picker: {
    height: 50, // a bit taller so text is not cut
  },
  error: {
    color: '#D9534F',
    marginBottom: 14,
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#34A853',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#3C4043',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultBox: {
    marginTop: 32,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#E5F8E8',
    borderWidth: 1,
    borderColor: '#B6E2BE',
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  rateText: {
    fontSize: 15,
    color: '#333',
  },
});
