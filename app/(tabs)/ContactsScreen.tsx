import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function ContactsScreen() {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      const currentUser = auth.currentUser;
      const querySnapshot = await getDocs(collection(db, 'user'));
      const usersList = [];

      querySnapshot.forEach((doc) => {
        if (doc.id !== currentUser.uid) {
          usersList.push({ id: doc.id, ...doc.data() });
        }
      });

      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const generateChatId = (id1, id2) => {
    return [id1, id2].sort().join('_');
  };

  const handleUserPress = (receiver) => {
    const senderId = auth.currentUser.uid;
    const chatId = generateChatId(senderId, receiver.id);

    navigation.navigate("ChatScreen", {
      chatId,
      receiverId: receiver.id,
      receiverName: `${receiver.firstName} ${receiver.lastName}`,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select someone to chat with:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => handleUserPress(item)}
          >
            <Text style={styles.userText}>{item.firstName} {item.lastName}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  userItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  userText: {
    fontSize: 16,
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
  },
});
