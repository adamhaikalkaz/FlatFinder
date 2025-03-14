import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Path, Defs, Pattern, Image } from 'react-native-svg';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // Default role is 'employee'

  const handleLogin = () => {
    // Simple demo check
    if (username === 'user' && password === 'password') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Top Blue Section with Title */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Sign In</Text>
        </View>

        {/* Wave Shape */}
        <View style={styles.waveContainer}>
          <Svg
            height="190%"
            width="100%"
            viewBox="0 0 1440 320"
            style={styles.wave}
          >
            <Path
              fill="#fff"
              d="M0,64L48,80C96,96,192,128,288,160C384,192,480,224,576,234.7C672,245,768,235,864,224C960,213,1056,203,1152,213.3C1248,224,1344,256,1392,272L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </Svg>
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

          {/* Username Input */}
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
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
      </SafeAreaView>
    );
  }

  // If logged in, show this screen:
  return (
    <View style={styles.loggedInContainer}>
      <Text style={styles.loggedInText}>Welcome, {username}!</Text>
    </View>
  );
}

const BLUE = '#39FF14'; // Change to your preferred color

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE,
  },
  headerContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '600',
  },
  waveContainer: {
    position: 'absolute',
    top: 160, // Adjust so the wave overlaps your header
    left: 0,
    right: 0,
    height: 120,
  },
  wave: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: 140, // Enough space for the wave
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
    backgroundColor: '#39FF14',
    borderRadius: 5,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  roleButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: BLUE,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  signupText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  signupLink: {
    fontSize: 16,
    color: BLUE,
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
});
