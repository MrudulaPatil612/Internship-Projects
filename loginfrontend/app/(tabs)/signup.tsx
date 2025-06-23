import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const backendUrl =
    Platform.OS === 'web'
      ? 'http://localhost:5000/signup'
      : 'http://192.168.199.225:5000/signup'; // Use your local IP address

  const handleSignup = async () => {
    if (!username || !password) {
      showAlert('Validation Error', 'Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('Success', data.message);
        router.push('index'as never); // Navigate back to login page
      } else {
        showAlert('Error', data.message);
      }
    } catch (error) {
      showAlert('Network Error', 'Could not connect to server');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('index' as never)}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5', 
  },
  title: {
    fontSize: 26,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
  linkText: {
    color: '#1e90ff',
    textAlign: 'center',
    marginTop: 20,
  },
});
