import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert, StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const backendUrl = 'http://192.168.169.225:5000/login';

  const showAlert = (title, message) => {
    Alert.alert(title, message);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showAlert('Validation Error', 'Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        showAlert('Success', data.message);
      } else {
        showAlert('Login Failed', data.message);
      }
    } catch (error) {
      console.error('Login Error:', error);
      showAlert('Network Error', 'Could not reach backend.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 26, marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#999', padding: 10, marginBottom: 10, borderRadius: 6 },
  button: { backgroundColor: '#007bff', padding: 12, borderRadius: 6, marginBottom: 10 },
  buttonText: { color: '#fff', textAlign: 'center' },
  linkText: { color: '#007bff', textAlign: 'center', marginTop: 10 },
});
