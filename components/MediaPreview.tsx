// components/MediaPreview.tsx
import React from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

export default function MediaPreview({ uri, type, onSend, onCancel }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        {type === 'image' ? (
          <Image source={{ uri }} style={styles.media} />
        ) : (
          <Video
            source={{ uri }}
            style={styles.media}
            useNativeControls
            resizeMode="cover"
          />
        )}

        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#c6ff00' }]} onPress={onSend}>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#ddd' }]} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    zIndex: 100,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  media: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
