import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { auth, db } from './FirebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Property {
  id: string;
  Address: string;
  City: string;
  Postcode: string;
  Rent: number;
  RentalDuration: number;
  Type: string;
  Beds: number;
  Description: string;
  images: string[];
}

interface WishlistItem {
  id: string;
  userId: string;
  propertyId: string;
  propertyData: Property;
  addedAt: string;
}

type RootStackParamList = {
  HomeStack: {
    screen: string;
    params: {
      item: Property;
      userRole: string;
    };
  };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function WishlistScreen() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in");
      Alert.alert("Error", "Please log in to view your wishlist");
      return;
    }

    console.log("Fetching wishlist for user:", user.uid);
    try {
      const wishlistRef = collection(db, "wishlist");
      const q = query(wishlistRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      console.log("Number of wishlist items found:", querySnapshot.size);
      
      const items = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log("Wishlist item data:", data);
        return {
          id: doc.id,
          ...data
        };
      }) as WishlistItem[];
      
      console.log("Processed wishlist items:", items);
      setWishlistItems(items);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      Alert.alert("Error", "Failed to load wishlist");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchWishlist();
    }, [])
  );

  const removeFromWishlist = async (wishlistId: string) => {
    try {
      await deleteDoc(doc(db, "wishlist", wishlistId));
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== wishlistId));
      Alert.alert("Success", "Property removed from wishlist");
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      Alert.alert("Error", "Failed to remove property from wishlist");
    }
  };

  const renderItem = ({ item }: { item: WishlistItem }) => {
    console.log("Rendering item:", item);
    const property = item.propertyData;
    return (
      <TouchableOpacity 
        style={styles.propertyCard}
        onPress={() => {
          navigation.navigate('HomeStack', {
            screen: 'PropertyScreen',
            params: { item: property, userRole: 'user' }
          });
        }}
      >
        <Image 
          source={{ uri: property.images[0] }} 
          style={styles.propertyImage}
        />
        <View style={styles.propertyInfo}>
          <Text style={styles.propertyAddress}>{property.Address}</Text>
          <Text style={styles.propertyLocation}>{property.City}, {property.Postcode}</Text>
          <Text style={styles.propertyPrice}>£{property.Rent} pcm</Text>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromWishlist(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

 
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.banner}>
        <Image source={require("../../assets/images/FDM.png")} style={styles.bannerImage} />
        <Text style={styles.bannerText}>Flat Finder</Text>
      </View>
  

      {/* Padded Content */}
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>My Wishlist</Text>
        {wishlistItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
          </View>
        ) : (
          <FlatList
            data={wishlistItems}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </SafeAreaView>
    </View>
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
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  propertyInfo: {
    padding: 12,
  },
  propertyAddress: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: '#d32f2f',
    padding: 8,
    margin: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});