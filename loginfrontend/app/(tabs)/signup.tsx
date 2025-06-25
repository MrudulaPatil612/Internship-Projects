import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default function SignupScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDOB] = useState('');
  const [department, setDepartment] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Basic validations
  const isEmailValid = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isPhoneValid = (phone: string) =>
    /^\d{10}$/.test(phone); // 10 digits only

  const backendUrl =
    Platform.OS === 'web'
      ? 'http://localhost:5000/signup'
      : 'http://192.168.199.225:5000/signup'; 

  const handleSignup = async () => {
    if (
      !username || !password || !firstName || !lastName || !email ||
      !address || !phoneNumber || !dob || !department || !employeeId
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

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          firstName,
          lastName,
          email,
          address,
          phoneNumber,
          dob,
          department,
          employeeId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('Success', data.message);
        router.push('index' as never); // Navigate to login
      } else {
        showAlert('Error', data.message);
      }
    } catch (error) {
      showAlert('Network Error', 'Could not connect to server');
      console.error(error);
    }
  };

  const onDOBChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0];
      setDOB(iso); // Format: YYYY-MM-DD
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="number-pad" />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.input, { justifyContent: 'center' }]}>
        <Text>{dob || 'Select Date of Birth'}</Text>
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

      <TextInput style={styles.input} placeholder="Employee ID" value={employeeId} onChangeText={setEmployeeId} />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('index' as never)}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
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

