import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', username: '', password: '',
    confirmPassword: '', email: '', address: '', phoneNumber: '',
    dob: '', department: '', employeeId: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();

  const backendUrl = 'http://192.168.169.225:5000/signup';

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const onDOBChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const iso = selectedDate.toISOString().split('T')[0];
      setFormData({ ...formData, dob: iso });
    }
  };

  const handleSignup = async () => {
    const {
      username, password, confirmPassword, firstName, lastName,
      email, address, phoneNumber, dob, department, employeeId,
    } = formData;

    if (!username || !password || !confirmPassword || !firstName || !lastName ||
      !email || !address || !phoneNumber || !dob || !department || !employeeId) {
      showAlert('Validation Error', 'Please fill all the fields.');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Validation Error', 'Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        showAlert('Success', data.message);
        router.push('index' as never); // go to login
      } else {
        showAlert('Error', data.message);
      }
    } catch (error) {
      console.error('Signup Error:', error);
      showAlert('Network Error', 'Could not reach the server.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {[
        ['First Name', 'firstName'],
        ['Last Name', 'lastName'],
        ['Username', 'username'],
        ['Password', 'password'],
        ['Confirm Password', 'confirmPassword'],
        ['Email', 'email'],
        ['Address', 'address'],
        ['Phone Number', 'phoneNumber'],
        ['Employee ID', 'employeeId'],
      ].map(([label, key]) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={label}
          secureTextEntry={key.toLowerCase().includes('password')}
          keyboardType={key === 'phoneNumber' ? 'numeric' : 'default'}
          value={(formData as any)[key]}
          onChangeText={(text) => setFormData({ ...formData, [key]: text })}
        />
      ))}

      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text style={{ color: formData.dob ? 'black' : '#999' }}>
          {formData.dob || 'Select Date of Birth'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={formData.dob ? new Date(formData.dob) : new Date()}
          mode="date"
          display="default"
          onChange={onDOBChange}
        />
      )}

      <Picker
        selectedValue={formData.department}
        style={styles.input}
        onValueChange={(itemValue) =>
          setFormData({ ...formData, department: itemValue })
        }
      >
        <Picker.Item label="Select Department" value="" />
        <Picker.Item label="CSE" value="CSE" />
        <Picker.Item label="IT" value="IT" />
        <Picker.Item label="ECE" value="ECE" />
        <Picker.Item label="MECH" value="MECH" />
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
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', justifyContent: 'center' },
  title: { fontSize: 26, marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#999', padding: 10, marginVertical: 8, borderRadius: 6 },
  button: { backgroundColor: '#1e90ff', padding: 12, borderRadius: 6, marginTop: 10 },
  buttonText: { textAlign: 'center', color: '#fff', fontWeight: '600' },
  linkText: { color: '#1e90ff', textAlign: 'center', marginTop: 20 },
});

