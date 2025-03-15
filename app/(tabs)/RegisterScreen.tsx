import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, View, StyleSheet, Alert, Image } from 'react-native';

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
          <Text style={styles.title}>Create Account</Text>
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
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomImageContainer}>
          <Image
            source={require("../../assets/images/bottomVector.png")}
            style={styles.bottomImage}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between', // Adjusted to space elements evenly
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    marginTop: 70,

  },
  title: {
    fontSize: 28,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Arial',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  input: {
    color: '#333',
    borderColor: 'gray',
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    paddingLeft: 20,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  passwordCondition: {
    color: '#666',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#07dd05',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Arial',
  },
  bottomImageContainer: {
    width: '120%',
    height: 120,
    backgroundColor: '#FFF', // Ensure the top image container has a white background
    alignItems: 'center', // Center the text horizontally
  },
  bottomImage: {
    width: '100%',
    height: '120%',
    resizeMode: 'cover',
  },
});