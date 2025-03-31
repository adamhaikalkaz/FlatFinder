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
    return format(date, 'h:mm a'); 
  };

  return (
    <View style={[styles.bubbleWrapper, isSender ? styles.sent : styles.received]}>
      {message.text && <Text style={styles.text}>{message.text}</Text>}
      {message.imageUrl && <Image source={{ uri: message.imageUrl }} style={styles.media} />}
      {message.videoUrl && (
        <Video
          source={{ uri: message.videoUrl }}
          style={styles.media}
          useNativeControls
          resizeMode="cover"
        />
      )}
      {message.audioUrl && (
        <TouchableOpacity onPress={() => onPlayAudio(message.audioUrl)}>
          <Text style={styles.audio}>▶️ Play Audio</Text>
        </TouchableOpacity>
      )}
      <View style={styles.meta}>
        <Text style={styles.timestamp}>{formatTimestamp(message.timestamp)}</Text>
        {isSender && (
          <MaterialIcons
            name="done-all"
            size={16}
            color={message.status === 'seen' ? '#39B1FF' : 'gray'}
            style={{ marginLeft: 6 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleWrapper: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 15,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sent: {
    alignSelf: 'flex-end',
    backgroundColor: '#D1FFD6',
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  media: {
    width: 220,
    height: 220,
    borderRadius: 10,
    marginTop: 8,
  },
  audio: {
    marginTop: 8,
    color: '#39FF14',
    fontWeight: 'bold',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
});
