import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import uuid from 'react-native-uuid';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { auth, db } from './FirebaseConfig';

export default function ChatScreen({ route }) {
  const { chatId, receiverId, receiverName } = route.params;
  const senderId = auth.currentUser?.uid;

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [previewMedia, setPreviewMedia] = useState(null); // uri
  const [previewType, setPreviewType] = useState(null); // 'image' | 'video'
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    const markMessagesAsSeen = async () => {
      const q = query(
        collection(db, `chats/${chatId}/messages`),
        where('receiverId', '==', senderId),
        where('status', '==', 'delivered')
      );

      const snapshot = await getDocs(q);
      const updates = snapshot.docs.map(docSnap =>
        updateDoc(docSnap.ref, { status: 'seen' })
      );
      await Promise.all(updates);
    };

    markMessagesAsSeen();
  }, [chatId, senderId]);

  const sendMessage = async () => {
    if (!messageText.trim()) return;

    await addDoc(collection(db, `chats/${chatId}/messages`), {
      text: messageText,
      senderId,
      receiverId,
      status: 'delivered',
      timestamp: serverTimestamp(),
    });

    setMessageText('');
  };

  const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission required to access media.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.7,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      const isVideo = file.type === 'video';

      setPreviewMedia(file.uri);
      setPreviewType(isVideo ? 'video' : 'image');
      setShowPreviewModal(true);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Camera permission required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPreviewMedia(result.assets[0].uri);
      setPreviewType('image');
      setShowPreviewModal(true);
    }
  };

  const uploadAndSendMedia = async () => {
    const response = await fetch(previewMedia);
    const blob = await response.blob();
    const ext = previewType === 'video' ? 'mp4' : 'jpg';
    const filename = `chat_media/${chatId}/${uuid.v4()}.${ext}`;
    const storage = getStorage();
    const fileRef = ref(storage, filename);

    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);

    await addDoc(collection(db, `chats/${chatId}/messages`), {
      senderId,
      receiverId,
      timestamp: serverTimestamp(),
      status: 'delivered',
      ...(previewType === 'image' ? { imageUrl: downloadURL } : { videoUrl: downloadURL }),
    });

    setShowPreviewModal(false);
    setPreviewMedia(null);
    setPreviewType(null);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'dd MMM, h:mm a');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <Text style={styles.header}>{receiverName || 'Chat'}</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSender = item.senderId === senderId;
          return (
            <View style={isSender ? styles.sentMessage : styles.receivedMessage}>
              {item.text && <Text style={styles.messageText}>{item.text}</Text>}
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              )}
              {item.videoUrl && (
                <Video
                  source={{ uri: item.videoUrl }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="cover"
                  isLooping
                />
              )}
              <Text style={styles.timestampText}>{formatTimestamp(item.timestamp)}</Text>
              {isSender && (
                <View style={styles.tickContainer}>
                  <MaterialIcons
                    name="done-all"
                    size={18}
                    color={item.status === 'seen' ? '#39B1FF' : 'gray'}
                  />
                </View>
              )}
            </View>
          );
        }}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickMedia} style={styles.iconButton}>
          <MaterialIcons name="attach-file" size={22} color="#39FF14" />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto} style={styles.iconButton}>
          <MaterialIcons name="photo-camera" size={22} color="#39FF14" />
        </TouchableOpacity>
      </View>

      {/* Preview Modal */}
      {showPreviewModal && previewMedia && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {previewType === 'image' ? (
              <Image source={{ uri: previewMedia }} style={styles.previewImage} />
            ) : (
              <Video
                source={{ uri: previewMedia }}
                style={styles.previewImage}
                useNativeControls
                resizeMode="cover"
              />
            )}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#c6ff00' }]}
                onPress={uploadAndSendMedia}
              >
                <Text style={styles.modalButtonText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#ddd' }]}
                onPress={() => {
                  setShowPreviewModal(false);
                  setPreviewMedia(null);
                  setPreviewType(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, backgroundColor: '#fff' },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#39FF14',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  sendButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  iconButton: {
    marginLeft: 6,
    padding: 6,
    backgroundColor: '#2b2b2b',
    borderRadius: 20,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '75%',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '75%',
  },
  messageText: { fontSize: 16 },
  timestampText: {
    fontSize: 11,
    color: 'gray',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  tickContainer: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginRight: 2,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  video: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 5,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {
    fontWeight: 'bold',
  },
});
