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
  Image,
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
import { format, isToday, isYesterday, startOfDay } from 'date-fns';

import { auth, db } from './FirebaseConfig';
import MessageBubble from '../../components/MessageBubble';
import AudioRecorder from '../../components/AudioRecorder';
import MediaPreview from '../../components/MediaPreview';
import { Ionicons } from '@expo/vector-icons';
import ContactsScreen from './ContactsScreen';
import { useNavigation } from '@react-navigation/native';

export default function ChatScreen({ route }) {
  const { chatId, receiverId, receiverName } = route.params;
  const senderId = auth.currentUser?.uid;

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [previewMedia, setPreviewMedia] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const soundRef = useRef(null);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgList);
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

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: false });
      }, 50); // 50ms delay to allow layout to settle
    }
  }, [messages]);

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

  const groupMessagesByDate = (messages) => {
    const groups = {};

    messages.forEach((msg) => {
      const rawDate = msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date(msg.timestamp);
      const localDate = new Date(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate());
      const dateStr = format(localDate, 'yyyy-MM-dd');

      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(msg);
    });

    const finalList = [];

    Object.keys(groups).forEach((dateStr) => {
      const [year, month, day] = dateStr.split('-').map(Number);
      const parsed = new Date(year, month - 1, day);

      const label = isToday(parsed)
        ? 'Today'
        : isYesterday(parsed)
        ? 'Yesterday'
        : format(parsed, 'dd MMM yyyy');

      finalList.push({ type: 'date', id: `header-${dateStr}`, label });
      groups[dateStr].forEach((msg) => finalList.push({ ...msg, type: 'message' }));
    });

    return finalList;
  };

  const renderItem = ({ item }) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateHeader}>
          <Text style={styles.dateHeaderText}>{item.label}</Text>
        </View>
      );
    }

    return (
      <MessageBubble
        message={item}
        isSender={item.senderId === senderId}
        onPlayAudio={playAudio}
      />
    );
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.banner}>
        <Image source={require("../../assets/images/FDM.png")} style={styles.bannerImage} />
        <Text style={styles.bannerText}>Flat Finder</Text>
      </View>
  
      {/* Header */}
      <Text style={styles.header}>{receiverName || 'Chat'}</Text>
      <TouchableOpacity onPress={() => navigation.navigate(ContactsScreen)} style={styles.headerLeft}>
      <Ionicons name="arrow-back" size={24} color='black' />
      </TouchableOpacity>
  
      {/* Message List */}
      <FlatList
        ref={flatListRef}
        data={groupMessagesByDate(messages)}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 10 }}
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
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c6ff00',
    paddingHorizontal: 10,
  },
  bannerImage: {
    width: 90,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  bannerText: {
    fontSize: 18,
    color: '#333',
  },
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#ffffff',
    color: '#111',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 8,
    backgroundColor: '#fdfdfd',
    fontSize: 15,
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
    padding: 8,
    backgroundColor: '#2b2b2b',
    borderRadius: 20,
  },
  dateHeader: {
    alignSelf: 'center',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 6,
  },
  dateHeaderText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
  },
  headerLeft: {
    position: 'absolute',
    left: 10,
    top: 60,
    zIndex: 1,
  },
});
