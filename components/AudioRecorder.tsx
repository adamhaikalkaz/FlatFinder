// components/AudioRecorder.tsx
import React, { useRef, useState } from 'react';
import { View, PanResponder, Animated, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../app/(tabs)/FirebaseConfig.js';
import uuid from 'react-native-uuid';
import { MaterialIcons } from '@expo/vector-icons';

export default function AudioRecorder({ chatId, receiverId, onSend }) {
  const [recording, setRecording] = useState(null);
  const [cancelled, setCancelled] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;
  const senderId = auth.currentUser?.uid;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => startRecording(),
      onPanResponderMove: (_, gesture) => {
        if (gesture.dx < -80) {
          setCancelled(true);
        } else {
          setCancelled(false);
          Animated.event([{ dx: translateX }], { useNativeDriver: false })(gesture);
        }
      },
      onPanResponderRelease: () => {
        if (cancelled) {
          cancelRecording();
        } else {
          stopRecording();
        }
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const startRecording = async () => {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) return;

    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await rec.startAsync();
    setRecording(rec);
  };

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    const blob = await (await fetch(uri)).blob();
    const audioRef = ref(chatId, `chat_audio/${chatId}/${uuid.v4()}.m4a`);
    await uploadBytes(audioRef, blob);
    const downloadURL = await getDownloadURL(audioRef);

    onSend({
      audioUrl: downloadURL,
      senderId,
      receiverId,
    });

    setRecording(null);
  };

  const cancelRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
    } catch {}
    setRecording(null);
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX }] }]} {...panResponder.panHandlers}>
      <TouchableOpacity style={styles.micButton}>
        <MaterialIcons name="mic" size={22} color={cancelled ? 'red' : '#39FF14'} />
      </TouchableOpacity>
      {recording && (
        <Text style={{ color: cancelled ? 'red' : '#999', marginLeft: 10 }}>
          {cancelled ? 'Slide to cancel' : 'Recording...'}
        </Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  micButton: {
    padding: 6,
    backgroundColor: '#2b2b2b',
    borderRadius: 20,
  },
});
