import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function UserScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={{ uri: 'https://example.com/profile.jpg' }} // Replace with actual profile image URL
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>
      <View style={styles.body}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Account Settings</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Personal Information</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View Past Rentals</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Login & Security</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Accessibility</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>Support</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Visit the Help Cetnre</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Give us feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    color: '#888',
  },
  body: {
    padding: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  buttonText: {
    color: 'black',
    textAlign: 'left',
    fontSize: 16,
  },

  logoutButton: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginHorizontal: 169,

  },
});