import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDOB] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [department, setDepartment] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const router = useRouter();

  const backendUrl =
    Platform.OS === 'web'
      ? 'http://localhost:5000/signup'
      : 'http://192.168.199.225:5000/signup';

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isPhoneValid = (phone: string) => /^\d{10}$/.test(phone);

  const isPasswordStrong = (password: string) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^+=])[A-Za-z\d@$!%*?&#^+=]{6,}$/.test(password);

  const onDOBChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0];
      setDOB(iso);
    }
  };

  const handleSignup = async () => {
    if (
      !username || !password || !firstName || !lastName ||
      !email || !address || !phoneNumber || !dob || !department || !employeeId
    ) {
      showAlert('Validation Error', 'Please fill all the fields.');
      return;
    }

    if (!isEmailValid(email)) {
      showAlert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    if (!isPhoneValid(phoneNumber)) {
      showAlert('Validation Error', 'Phone number must be 10 digits.');
      return;
    }

    if (!isPasswordStrong(password)) {
      showAlert(
        'Weak Password',
        'Password must be at least 6 characters, include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username, password, firstName, lastName, email,
          address, phoneNumber, dob, department, employeeId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('Success', data.message);
        router.push('index' as never);
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

      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Phone Number" keyboardType="numeric" value={phoneNumber} onChangeText={setPhoneNumber} />
      <TextInput style={styles.input} placeholder="Employee ID" value={employeeId} onChangeText={setEmployeeId} />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={{ color: dob ? 'black' : '#999' }}>
          {dob || 'Select Date of Birth'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dob ? new Date(dob) : new Date()}
          mode="date"
          display="default"
          onChange={onDOBChange}
          maximumDate={new Date()}
        />
      )}

      <Picker selectedValue={department} style={styles.input} onValueChange={setDepartment}>
        <Picker.Item label="Select Department" value="" />
        <Picker.Item label="Computer Science" value="CSE" />
        <Picker.Item label="Information Tech" value="IT" />
        <Picker.Item label="Electronics" value="ECE" />
        <Picker.Item label="Mechanical" value="MECH" />
      </Picker>

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
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 26, marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#999', padding: 10, marginVertical: 10, borderRadius: 6 },
  button: { backgroundColor: '#1e90ff', padding: 12, borderRadius: 6, marginTop: 10 },
  buttonText: { textAlign: 'center', color: '#fff', fontWeight: '600' },
  linkText: { color: '#1e90ff', textAlign: 'center', marginTop: 20 },
});
