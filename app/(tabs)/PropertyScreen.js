import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db, auth, firestore } from './FirebaseConfig';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const PropertyScreen = ({ navigation, route }) => {
  const { item, userRole } = route.params;
  const [isWishlisted, setIsWishlisted] = useState(false);
  const Address = item.Address;
  const City = item.City;
  const Postcode = item.Postcode;
  const Rent = item.Rent;
  const RentalDuration = item.RentalDuration;
  const Type = item.Type;
  const Beds = item.Beds;
  const Description = item.Description;
  const images = item.images;
  const propertyId = item.id;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    console.log(userRole);
    checkWishlistStatus();
  }, []);

  const checkWishlistStatus = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const wishlistRef = doc(db, "wishlist", `${user.uid}_${item.id}`);
      const wishlistDoc = await getDoc(wishlistRef);
      setIsWishlisted(wishlistDoc.exists());
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  const handleWishlist = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "Please log in to add items to your wishlist");
      return;
    }

    try {
      const wishlistRef = doc(db, "wishlist", `${user.uid}_${item.id}`);
      if (isWishlisted) {
        await deleteDoc(wishlistRef);
        setIsWishlisted(false);
        Alert.alert("Success", "Property removed from wishlist");
      } else {
        const wishlistData = {
          userId: user.uid,
          propertyId: item.id,
          propertyData: item,
          addedAt: new Date().toISOString()
        };
        await setDoc(wishlistRef, wishlistData);
        setIsWishlisted(true);
        Alert.alert("Success", "Property added to wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      Alert.alert("Error", "Failed to update wishlist");
    }
  };

  const deleteProperty = async () => {
    try {
      await deleteDoc(doc(firestore, "properties", propertyId));
      alert("Property deleted successfully!");
      navigation.navigate("HomeScreen");
    } catch (error) {
      alert("Failed to delete property");
    }
  };

  const handleChatWithLandlord = async () => {
    const currentUserId = auth.currentUser.uid;
    const landlordId = item.landlordID;

    if (!landlordId || landlordId === currentUserId) {
      alert("Cannot chat with this landlord.");
      return;
    }

    try {
      const landlordDoc = await getDoc(doc(db, 'user', landlordId));
      if (!landlordDoc.exists()) {
        alert("Landlord not found.");
        return;
      }

      const landlord = landlordDoc.data();
      const chatId = [currentUserId, landlordId].sort().join('_');

      navigation.navigate("Chat", {
        screen: "ChatScreen",
        params: {
          chatId,
          receiverId: landlordId,
          receiverName: `${landlord.firstName} ${landlord.lastName}`,
        },
      });
    } catch (error) {
      console.error("Error navigating to chat:", error);
      alert("Failed to start chat.");
    }
  };

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
        <View style={styles.banner}>
            <Image source={require("../../assets/images/FDM.png")} style={styles.bannerImage} />
            <Text style={styles.bannerText}>Flat Finder</Text>
        </View>
    
      <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerLeft}>
            <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            {userRole === 'landlord' && (
            <View style={styles.headerRight}>
                <TouchableOpacity onPress={deleteProperty}>
                <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>
            )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
            <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flatListContainer}
            keyExtractor={(url, index) => index.toString()}
            renderItem={({ item: image }) => (
                <Image source={{ uri: image }} style={styles.image} />
            )}
            pagingEnabled
            snapToAlignment="center"
            snapToInterval={width}
            decelerationRate="fast"
            onScroll={e => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveIndex(index);
            }}
            scrollEventThrottle={16}
            />

            {/* Image dots */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: -20, marginBottom: 10 }}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: index === activeIndex ? '#333' : '#ccc',
                    marginHorizontal: 4,
                  }}
                />
              ))}
            </View>

            <View style={styles.propertyDetails}>
            <Text style={styles.address}>{Address}, {City}</Text>
            <Text style={styles.subText}>{City}, {Postcode.toUpperCase()}</Text>
            <Text style={styles.price}>£{Rent} pcm</Text>
            <Text style={styles.duration}>Rental Duration: {RentalDuration} months</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.propertyInfo}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <Text style={styles.infoText}><Text style={styles.boldText}>Type:</Text> {Type} </Text>
            <Text style={styles.infoText}><Text style={styles.boldText}>Bedrooms:</Text> {Beds} </Text>
            <Text style={styles.infoText}><Text style={styles.boldText}>Bathrooms:</Text> 1 </Text>
            <Text style={styles.infoText}>{Description}</Text>
            </View>

        {userRole === "employee" && 
        (<TouchableOpacity
          style={[styles.listingButtons, isWishlisted && styles.wishlistedButton]}
          onPress={handleWishlist}
        >
          <Text style={[styles.buttonText, isWishlisted && styles.wishlistedText]}>
            {isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          </Text>
        </TouchableOpacity>)}

      {userRole === "employee" &&  
      (<TouchableOpacity
          style={styles.listingButtons}
          onPress={handleChatWithLandlord}
        >
          <Text>Chat to Landlord</Text>
        </TouchableOpacity>)}

            <TouchableOpacity
            style={styles.listingButtons}
            onPress={() => navigation.navigate("ReviewScreen", { propertyId: item.id })}
            >
            <Text>Reviews</Text>
            </TouchableOpacity>
            </ScrollView>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  image: { width: width, height: 400, resizeMode: 'contain' },
  imageScroll: { flexGrow: 0 },
  imageWrapper: { width: width, height: width * 0.75 },
  noImageText: { textAlign: "center", fontSize: 16 },
  detailsContainer: { paddingHorizontal: 20, paddingBottom: 20 },
  propertyDetails: { marginTop: 15 },
  address: { fontSize: 22, fontWeight: "bold", color: "#333" },
  subText: { fontSize: 16, color: "#666", marginBottom: 5 },
  price: { fontSize: 24, fontWeight: "bold", color: "#d32f2f", marginTop: 5 },
  duration: { fontSize: 16, color: "#444", marginBottom: 10 },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 15 },
  propertyInfo: { marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#333" },
  infoText: { fontSize: 16, color: "#555", marginBottom: 5 },
  boldText: { fontWeight: "bold", color: "#333" },
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
  listingButtons: {
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  wishlistedButton: {
    backgroundColor: '#d32f2f',
    borderColor: '#d32f2f',
  },
  wishlistedText: {
    color: '#fff',
  },
  editButton: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerLeft : {
    marginLeft: 15
  },
  headerRight: {
    flexDirection: 'row',
    gap: 20,
    marginRight: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PropertyScreen;
