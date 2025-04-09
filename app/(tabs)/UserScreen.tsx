import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function UserScreen({ setIsAuthenticated }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(db, 'user', currentUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      Alert.alert('Success', 'You have been logged out successfully.');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Something went wrong while logging out.');
    }
  }

  const pickAndUploadImage = async () => {
    try {
      // Request permission to access the media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission required', 'You need to grant permission to access your photos.');
        return;
      }

      // Open the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;

        // Upload the image to Firebase Storage
        const auth = getAuth();
        const storage = getStorage();
        const currentUser = auth.currentUser;

        if (currentUser) {
          const storageRef = ref(storage, `profile_pic/${currentUser.uid}.jpg`);
          const response = await fetch(imageUri);
          const blob = await response.blob();

          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);

          // Update the user's Firestore document with the image URL
          const db = getFirestore();
          const userDocRef = doc(db, 'user', currentUser.uid);
          await setDoc(userDocRef, { profilePicture: downloadURL }, { merge: true });

          // Update the local state to reflect the new profile picture
          setUserData((prevData) => ({ ...prevData, profilePicture: downloadURL }));
          Alert.alert('Success', 'Profile picture updated successfully!');
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Something went wrong while uploading the image.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bottomContainer}>
        <Image source={require("../../assets/images/FDM.png")} style={styles.bottomImage} />
        <Text style={styles.bottomText}>Flat Finder</Text>
      </View>
      <View style={styles.header}>
        <Image
          style={styles.profileImage}
          source={(userData?.profilePicture && { uri: userData?.profilePicture}) || require('../../assets/images/usericon.png') }
        />
        <Text style={styles.name}>
          {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'}
        </Text>
        <Text style={styles.email}>
          {userData?.email || ''}
        </Text>
        <TouchableOpacity onPress={pickAndUploadImage}>
          <Text style={{ color: 'blue', marginTop: 10 }}>Change Profile Picture</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.body}>
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
          <Text style={styles.buttonText}>Visit the Help Centre</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Give us feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
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
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
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