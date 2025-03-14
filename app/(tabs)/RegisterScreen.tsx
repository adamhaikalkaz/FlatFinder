import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, View, StyleSheet, Alert } from 'react-native';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters long, contain a number, and an uppercase letter');
      return;
    }

    // Add your registration logic here
    alert(`Registered with First Name: ${firstName}, Last Name: ${lastName}, Email: ${email}`);
  };

  return (
    <View style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>
          <View style={styles.nameContainer}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="First Name"
              placeholderTextColor="#aaa"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Last Name"
              placeholderTextColor="#aaa"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Text style={styles.passwordCondition}>
            Password must:
            {'\n'}• Be at least 8 characters long
            {'\n'}• Contain a number
            {'\n'}• Contain an uppercase letter
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  input: {
    backgroundColor: '#333',
    color: 'white',
    height: 50,
    borderRadius: 5,
    paddingLeft: 20,
    marginBottom: 20,
    fontSize: 18,
  },
  passwordCondition: {
    color: 'white',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#39FF14',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});