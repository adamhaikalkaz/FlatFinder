import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { auth } from './FirebaseConfig';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert('Password Reset Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Image */}
      <View style={styles.topImageContainer}>
        <Image
          source={require("../../assets/images/buildings.png")}
          style={styles.topImage}
        />
      </View>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
      <Ionicons name="arrow-back" size={24} color='#c6ff00' />
      </TouchableOpacity>
      <View style={styles.headerTextContainer}>
        <Text style={styles.resetPasswordText}>Reset Password</Text>
        <Text style={styles.instructionsText}>
        Enter the email, phone number or username associated with your account to change your password
        </Text>
      </View>

      {/* White Section with Form */}
      <View style={styles.formContainer}>
        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
        />

        {/* Reset Password Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Image and Text */}
      <View style={styles.bottomContainer}>
        <Image
          source={require("../../assets/images/FDM.png")}
          style={styles.bottomImage}
        />
        <Text style={styles.bottomText}>Flat Finder</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2b2b2b',
  },
  topImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#c6ff00',
    alignItems: 'center',
  },
  topImage: {
    width: '100%',
    height: '120%',
    resizeMode: 'cover',
  },
  resetPasswordText: {
    fontSize: 50,
    fontWeight: '600',
    color: 'white',
    marginTop: 70,
    textAlign: 'center',
  },
  instructionsText: {
    fontSize: 16,
    color: 'white',
    marginVertical: 20,
    textAlign: 'center',
},
  formContainer: {
    flex: 1,
    backgroundColor: '#2b2b2b',
    marginTop: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#c6ff00',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: 'white',
  },
  resetButton: {
    backgroundColor: '#c6ff00',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButtonText: {
    color: '#2b2b2b',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: '#c6ff00',
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
  headerLeft: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
    backgroundColor: '#2b2b2b',
    padding: 10,
    borderRadius: 50,
  },
});