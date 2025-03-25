import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { auth, db } from './FirebaseConfig';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [listings, setListings] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState ('');
  const navigation = useNavigation();




  useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, "properties"), (snapshot) => {
          const fetchedListings = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
          }));
          setListings(fetchedListings);
      });


      const getUserRole = async () => {
        const user = auth.currentUser; // Get the authenticated user
      
        if (user) {
          const userRef = doc(db,"user", user.uid)
          const userDoc = await getDoc(userRef)
      
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.user_type);
          } else {
            console.log('No such user document!');
            return null;
          }
        } 
      };
      getUserRole();

      return unsubscribe;
  }, []);

  const filteredListing = listings.filter(listings =>
    listings.Address.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flat Finder</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for flats..."
        value={search}
        onChangeText={setSearch}
      />
      
      { userRole === "landlord" &&
        (<TouchableOpacity style={styles.newListing} onPress={() => navigation.navigate("ListingForm")}>
          <Text style={styles.buttonText}>Add New Listing</Text>
      </TouchableOpacity>)}
      <FlatList
          data={filteredListing}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
              <TouchableOpacity style={styles.flatButton} onPress={() => navigation.navigate("PropertyScreen", {item,userRole})}>
                  <Image 
                      source={{ uri: item.images[0] }} 
                      style={{ width: "100%", height: 200, borderRadius: 10 }}
                      resizeMode="cover"
                  />
                  <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>{item.Address}, {item.City}</Text>
                  <Text style={{ fontSize: 16, color: "gray" }}>{item.Rent} pcm - {item.Beds} Beds</Text>
              </TouchableOpacity>
          )}
      />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  newListing:{
      alignItems:'center',
      borderWidth:1,
      borderRadius:5,
      padding:10,
      marginBottom:10,
      backgroundColor:'#c3fb04',
  },
  buttonText:{
      fontWeight:'bold'
  },
  flatButton: {
    marginBottom: 20, 
    padding: 10, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
  }
});