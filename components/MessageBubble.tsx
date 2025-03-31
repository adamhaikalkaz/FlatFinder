// components/MessageBubble.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { Audio } from 'expo-av';
import { format } from 'date-fns';

export default function MessageBubble({ message, isSender, onPlayAudio }) {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return format(date, 'dd MMM, h:mm a');
  };

  return (
    <View style={isSender ? styles.sentMessage : styles.receivedMessage}>
      {message.text && <Text style={styles.messageText}>{message.text}</Text>}

      {message.imageUrl && (
        <Image source={{ uri: message.imageUrl }} style={styles.image} />
      )}

      {message.videoUrl && (
        <Video
          source={{ uri: message.videoUrl }}
          style={styles.video}
          useNativeControls
          resizeMode="cover"
        />
      )}

      {message.audioUrl && (
        <TouchableOpacity onPress={() => onPlayAudio(message.audioUrl)}>
          <Text style={styles.audioPlay}>▶️ Play Audio</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.timestampText}>{formatTimestamp(message.timestamp)}</Text>

      {isSender && (
        <View style={styles.tickContainer}>
          <MaterialIcons
            name="done-all"
            size={18}
            color={message.status === 'seen' ? '#39B1FF' : 'gray'}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  audioPlay: {
    color: '#39FF14',
    fontWeight: 'bold',
    marginTop: 8,
  },
});
