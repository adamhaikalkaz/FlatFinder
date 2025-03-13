import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = () => {
    // Add your registration logic here
    alert(`Registered with Username: ${username}, Email: ${email}`);
  };

  return (
    <View style={styles.background}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
          />
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
  input: {
    backgroundColor: '#333',
    color: 'white',
    width: '100%',
    height: 50,
    borderRadius: 5,
    paddingLeft: 20,
    marginBottom: 20,
    fontSize: 18,
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