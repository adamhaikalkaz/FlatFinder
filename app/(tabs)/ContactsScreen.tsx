import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function ContactsScreen() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      const currentUser = auth.currentUser;
      const querySnapshot = await getDocs(collection(db, 'user'));
      const usersList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // ✅ Make sure user_ID is Firebase Auth UID
        if (data?.user_ID && data.user_ID !== currentUser.uid) {
          usersList.push({ id: doc.id, ...data });
        }
      });

      setUsers(usersList);
      setFilteredUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = users.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const generateChatId = (id1, id2) => {
    return [id1, id2].sort().join('_');
  };

  const handleUserPress = (receiver) => {
    const senderId = auth.currentUser.uid;
    const receiverId = receiver.user_ID; // ✅ MUST be Firebase Auth UID

    const chatId = generateChatId(senderId, receiverId);

    navigation.navigate('ChatScreen', {
      chatId,
      receiverId,
      receiverName: `${receiver.firstName} ${receiver.lastName}`,
    });
  };

  const formatRole = (type) => {
    if (!type) return '';
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select someone to chat with:</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() => handleUserPress(item)}
          >
            <Text style={styles.userText}>
              {item.firstName} {item.lastName}
              {item.user_type ? ` • ${formatRole(item.user_type)}` : ''}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  userItem: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 10,
  },
  userText: { fontSize: 16 },
  emptyText: { marginTop: 20, textAlign: 'center', color: 'gray' },
});
