import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import ReviewScreen from './ReviewScreen';

const flats = [
  { id: '1', name: 'Flat 1', location: 'Location 1' },
  { id: '2', name: 'Flat 2', location: 'Location 2' },
  { id: '3', name: 'Flat 3', location: 'Location 3' },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  const filteredFlats = flats.filter(flat =>
    flat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flat Finder</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for flats..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredFlats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.flatItem}>
            <Text style={styles.flatName}>{item.name}</Text>
            <Text style={styles.flatLocation}>{item.location}</Text>
          </View>
        )}
      />
      <Button
        mode="contained"
        onPress={() => navigation.navigate('ReviewScreen')}
      >
        Review
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  flatItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  flatName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  flatLocation: {
    fontSize: 14,
    color: 'gray',
  },
});