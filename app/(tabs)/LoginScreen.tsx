// App.tsx
import React from 'react';
import { useState } from 'react';
import { ImageBackground, TextInput, TouchableOpacity, Text, View, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // Default role is employee
      
        const handleLogin = () => {
          if (username === 'user' && password === 'password') {
            setIsLoggedIn(true);
          } else {
            alert('Invalid credentials');
          }
        };
      
        if (!isLoggedIn) {
          return (
            <ImageBackground source={{ uri: 'https://assets.nflxext.com/ffe/siteui/vlv3/1d3a1a3e-6b2e-4b6e-8b5e-60b1b8a1c8b4/1d3a1a3e-6b2e-4b6e-8b5e-60b1b8a1c8b4_1920x1080.jpg' }} style={styles.background}>
              <View style={styles.overlay}>
                <View style={styles.container}>
                  <Text style={styles.title}>Sign In</Text>
                  <View style={styles.roleContainer}>
                    <TouchableOpacity style={role === 'employee' ? styles.selectedRoleButton : styles.roleButton} onPress={() => setRole('employee')}>
                      <Text style={styles.roleButtonText}>Employee</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={role === 'landlord' ? styles.selectedRoleButton : styles.roleButton} onPress={() => setRole('landlord')}>
                      <Text style={styles.roleButtonText}>Landlord</Text>
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#aaa"
                    value={username}
                    onChangeText={setUsername}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Sign In</Text>
                  </TouchableOpacity>
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
              </View>
            </ImageBackground>
          );
        }
      
        return (
          <View style={styles.loggedInContainer}>
            <Text style={styles.loggedInText}>Welcome, {username}!</Text>
          </View>
        );
      }
      
      const styles = StyleSheet.create({
        background: {
          flex: 1,
          resizeMode: 'cover',
          justifyContent: 'center',
          backgroundColor: 'black',
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
        roleContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 20,
        },
        roleButton: {
          backgroundColor: '#333',
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
          color: 'white',
          fontSize: 18,
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
        signupText: {
          color: 'white',
          textAlign: 'center',
        },
        signupLink: {
          color: '#39FF14',
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
