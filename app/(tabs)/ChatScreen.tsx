import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
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
import { MaterialIcons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { Audio } from 'expo-av';

import { auth, db } from './FirebaseConfig';
import MessageBubble from '../../components/MessageBubble';
import AudioRecorder from '../../components/AudioRecorder';
import MediaPreview from '../../components/MediaPreview';

export default function ChatScreen({ route }) {
  const { chatId, receiverId, receiverName } = route.params;
  const senderId = auth.currentUser?.uid;

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [previewMedia, setPreviewMedia] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const soundRef = useRef(null);

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
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Permission required to access media.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.7,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      setPreviewMedia(file.uri);
      setPreviewType(file.type === 'video' ? 'video' : 'image');
      setShowPreviewModal(true);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
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
    const fileRef = ref(getStorage(), filename);

    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);

    await addDoc(collection(db, `chats/${chatId}/messages`), {
      senderId,
      receiverId,
      status: 'delivered',
      timestamp: serverTimestamp(),
      ...(previewType === 'image' ? { imageUrl: downloadURL } : { videoUrl: downloadURL }),
    });

    setShowPreviewModal(false);
    setPreviewMedia(null);
    setPreviewType(null);
  };

  const handleSendAudio = async ({ audioUrl }) => {
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      audioUrl,
      senderId,
      receiverId,
      status: 'delivered',
      timestamp: serverTimestamp(),
    });
  };

  const playAudio = async (uri) => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync({ uri });
    soundRef.current = sound;
    await sound.playAsync();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <Text style={styles.header}>{receiverName || 'Chat'}</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble message={item} isSender={item.senderId === senderId} onPlayAudio={playAudio} />
        )}
      />

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
        <AudioRecorder chatId={chatId} receiverId={receiverId} onSend={handleSendAudio} />
      </View>

      {showPreviewModal && previewMedia && (
        <MediaPreview
          uri={previewMedia}
          type={previewType}
          onSend={uploadAndSendMedia}
          onCancel={() => {
            setShowPreviewModal(false);
            setPreviewMedia(null);
            setPreviewType(null);
          }}
        />
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
  sendButtonText: { fontWeight: 'bold', color: '#000' },
  iconButton: {
    marginLeft: 6,
    padding: 6,
    backgroundColor: '#2b2b2b',
    borderRadius: 20,
  },
});
