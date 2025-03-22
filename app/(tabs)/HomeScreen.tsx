import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './FirebaseConfig';

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, 'user'); // Firestore users collection
        const snapshot = await getDocs(usersRef);
        const currentUserId = auth.currentUser?.uid;

        const userList = snapshot.docs
          .map(doc => {
            const userData = doc.data();
            return {
              user_ID: userData.user_ID, 
              name: userData.firstName && userData.lastName
                ? `${userData.firstName} ${userData.lastName}`
                : "Unknown User", // Handle missing names
              email: userData.email || "No email available", 
              user_type: userData.user_type || "Unknown", 
            };
          })
          .filter(user => user.user_ID && user.user_ID !== currentUserId); // Exclude logged-in user

        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search input
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a User to Chat</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search users..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item, index) => `${item.user_ID}-${index}`} // Ensures unique key
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => {
              const chatId = [auth.currentUser?.uid, item.user_ID].sort().join('_'); // Unique chat ID
              navigation.navigate('ChatScreen', {
                chatId,
                receiverId: item.user_ID,
                receiverName: item.name, // Display name
              });
            }}
          >
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email} ({item.user_type})</Text> {/* Show user type */}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  searchBar: {
    height: 40, borderColor: 'gray', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, marginBottom: 16,
  },
  userItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  userName: { fontSize: 18, fontWeight: 'bold' },
  userEmail: { fontSize: 14, color: 'gray' },
});
