import React, { useState } from 'react';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { getFirestore, setDoc, doc, collection, getDocs, Timestamp } from "firebase/firestore";
import db from "./FirebaseConfig";
import { getAuth } from "firebase/auth";
import ReviewScreen from './ReviewScreen';
import { StatusBar, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, navigation,TextInput,Alert, Button } from 'react-native';

export default function AddReviewScreen({ navigation, route }) {
  const { propertyId } = route.params;
  const [rating, setRating] = useState('');
  const [location, setLocation] = useState('');
  const [reviewText, setReviewText] = useState('');

  const db = getFirestore()
  const auth = getAuth()

  const handleSubmit = async() => {
    
    
    const user = auth.currentUser;
    
    if (!user)
    {
      alert("user not logged in");
      return;
    }
    
    const user_ID = user.uid;
    //const user_ID = "EXAMPLE USER";
    const numericRating = Number(rating);

    if (!rating || !reviewText.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      Alert.alert('Invalid Rating', 'Please enter a number between 1 and 5.');
      return;
    }

    
    if (reviewText.trim().length < 30) {
        Alert.alert('Short Review', 'Your review must be at least 30 characters long.');
        return;
      }

      try {
        const now = new Date();
        const docRef = await setDoc(doc(db, "reviews", user_ID), { //addDoc will create a unique id like uZx8yT4skiC0U7bySsNR 
          date_time: Timestamp.now(), 
          property_id: propertyId, 
          rating: rating, 
          review: reviewText, 
          user_ID: user_ID, 
        });
    

        //console.log("Listing added with ID: ", docRef.id);
        setRating("")
        setReviewText("")
        console.log({ rating: numericRating, location, reviewText, propertyId });
        Alert.alert('Review Submitted!', 'Thank you for your feedback.');
        navigation.navigate("ReviewScreen", {propertyId}); 
      } catch (error) {
        console.error("Error adding document: ", error);
      }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Your Review</Text>
      <View style={styles.main}>
        <Text style={{color:"white", fontWeight:'bold'}}>Enter rating from 1-5:</Text>
        <TextInput style={styles.input} placeholder="Rating (1-5)" keyboardType="numeric" value={rating} onChangeText={setRating} />
        <Text style={{color:"white", fontWeight:'bold'}}>Write your review:</Text>
        <TextInput style={styles.input} placeholder="Write your review..." value={reviewText} onChangeText={setReviewText} multiline />
        
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Review</Text>
      </TouchableOpacity>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //padding: 20,
    backgroundColor: '#2b2b2b',
    color:'black',
    width: '100%',
  },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: '#c3fb04',
    padding:20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c3fb04',
    borderRadius: 5,
    padding: 10,
    marginBottom: 30,
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#c3fb04',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },

  main: {
    padding: 20,
  }
});