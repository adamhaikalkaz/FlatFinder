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
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen({ navigation, setIsAuthenticated }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // Default role is 'employee'

  const handleLogin = async () => {
    // Validate email based on role
    if (role === 'employee' && !email.endsWith('@fdmgroup.com')) {
      Alert.alert('Invalid Email', 'Employees must use an @fdmgroup.com email.');
      return;
    }
    if (role === 'landlord' && email.endsWith('@fdmgroup.com')) {
      Alert.alert('Invalid Email', 'Landlords cannot use an @fdmgroup.com email.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setIsLoggedIn(true);
      const user = userCredential.user;
      console.log('Logged in user:', user);
      // Set authentication state to true
      setIsAuthenticated(true);
    } catch (error) {
      Alert.alert('Login Error', "Wrong Email or Password");
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Top Image */}
        <View style={styles.topImageContainer}>
          <Image
            source={require("../../assets/images/buildings.png")}
            style={styles.topImage}
          />
          <Text style={styles.signInText}>Sign In</Text>
        </View>

        {/* White Section with Form */}
        <View style={styles.formContainer}>
          {/* Role Selection */}
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={role === 'employee' ? styles.selectedRoleButton : styles.roleButton}
              onPress={() => setRole('employee')}
            >
              <Text style={styles.roleButtonText}>Employee</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={role === 'landlord' ? styles.selectedRoleButton : styles.roleButton}
              onPress={() => setRole('landlord')}
            >
              <Text style={styles.roleButtonText}>Landlord</Text>
            </TouchableOpacity>
          </View>

          {/* Email Input */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password Input */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Sign In Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <Text
            style={styles.forgotPasswordLink}
            onPress={() => navigation.navigate('ResetPasswordScreen')}
          >
          Forgot Password
          </Text>

          {/* Landlord Sign-up Link */}
          {role === 'landlord' && (
            <Text style={styles.signupText}>
              New Landlord?{' '}
              <Text
                style={styles.signupLink}
                onPress={() => navigation.navigate('RegisterScreen')}
              >
                Sign up now.
              </Text>
            </Text>
          )}
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

  // If logged in, show this screen:
  return (
    <View style={styles.loggedInContainer}>
      <Text style={styles.loggedInText}>Welcome !</Text>
    </View>
  );
}

const BLUE = '#07dd05'; // Change to your preferred color

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2b2b2b', // Ensure the container has a white background
  },
  topImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#c6ff00', // Ensure the top image container has a white background
    alignItems: 'center', // Center the text horizontally
  },
  topImage: {
    width: '100%',
    height: '120%',
    resizeMode: 'cover',
  },
  signInText: {
    fontSize: 40,
    fontWeight: '600',
    color: 'white',
    marginTop: 20, // Adjust this value to move the text down
  },
  headerContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#2b2b2b',
    marginTop: 120, // Enough space for the wave
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  selectedRoleButton: {
    backgroundColor: '#c6ff00',
    borderRadius: 5,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  roleButtonText: {
    color: '#2b2b2b',
    fontSize: 16,
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
  loginButton: {
    backgroundColor: '#c6ff00',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#2b2b2b',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPasswordLink: {
    fontSize: 16,
    color: '#c6ff00',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signupText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  signupLink: {
    fontSize: 16,
    color: '#c6ff00',
    fontWeight: '600',
  },
  loggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loggedInText: {
    fontSize: 24,
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
});
