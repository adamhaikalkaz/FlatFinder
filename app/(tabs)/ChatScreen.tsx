import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './FirebaseConfig';

export default function ChatScreen({ route }) {
  const { chatId, receiverId, receiverName } = route.params;
  const senderId = auth.currentUser?.uid;

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  // Fetch messages in real-time from Firestore
  useEffect(() => {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatId]);

  // Function to send a message
  const sendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        text: messageText,
        senderId, // Ensure correct sender
        receiverId,
        timestamp: serverTimestamp(),
      });
      setMessageText('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{receiverName || "Chat"}</Text>

      {/* Message List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={item.senderId === senderId ? styles.sentMessage : styles.receivedMessage}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ccc' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10 },
  sentMessage: { alignSelf: 'flex-end', backgroundColor: '#DCF8C6', padding: 10, borderRadius: 10, marginVertical: 5 },
  receivedMessage: { alignSelf: 'flex-start', backgroundColor: '#E5E5EA', padding: 10, borderRadius: 10, marginVertical: 5 },
  messageText: { fontSize: 16 },
});
