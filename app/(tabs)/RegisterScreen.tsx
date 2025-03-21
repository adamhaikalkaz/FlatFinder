import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, View, StyleSheet, Alert, Image } from 'react-native';
import { auth, firestore, db } from './FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password)) {
      Alert.alert('Error', 'Password must be at least 8 characters long, contain a number, and an uppercase letter');
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore under 'landlords' collection
      await setDoc(doc(db, "user", user.uid),{
        email: email,
        firstName: firstName,
        lastName: lastName,
        user_ID: user.uid,
        user_type: 'landlord',
      });

      Alert.alert('Success', 'Account created successfully!');
      
      // Navigate to the Login or Dashboard screen after successful registration
      navigation.navigate('LoginScreen'); // Replace 'Login' with your desired screen name

    } catch (error) {
      Alert.alert('Registration Error', error.message);
    }
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
        <View style={styles.bottomContainer}>
          <Image
            source={require("../../assets/images/FDM.png")}
            style={styles.bottomImage}
          />
          <Text style={styles.bottomText}>Flat Finder</Text>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#2b2b2b',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#2b2b2b',
    justifyContent: 'space-between', // Adjusted to space elements evenly
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    backgroundColor: '#2b2b2b',
    padding: 20,
    borderRadius: 10,
    marginTop: 140,
  },
  title: {
    fontSize: 28,
    color: 'white',
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
    color: 'white',
    borderColor: '#c6ff00',
    borderWidth: 1,
    height: 50,
    borderRadius: 8,
    paddingLeft: 20,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#2b2b2b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  passwordCondition: {
    color: 'white',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#c6ff00',
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
    color: '#2b2b2b',
    fontSize: 18,
    fontFamily: 'Arial',
  },

  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -16,
    backgroundColor: '#c6ff00',
    width: '150%',
  },
  bottomImage: {
    width: 90,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  bottomText: {
    fontSize: 18,
    color: '#333',
  },
});