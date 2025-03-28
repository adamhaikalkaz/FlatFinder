import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db, auth, firestore } from './FirebaseConfig';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const PropertyScreen = ({navigation, route}) => {
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

    useEffect(() => {
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
            console.log("No user logged in when trying to add to wishlist");
            Alert.alert("Error", "Please log in to add items to your wishlist");
            return;
        }

        try {
            const wishlistRef = doc(db, "wishlist", `${user.uid}_${item.id}`);
            console.log("Attempting to add/remove from wishlist:", {
                userId: user.uid,
                propertyId: item.id,
                isWishlisted: isWishlisted,
                wishlistRef: wishlistRef.path
            });
            
            if (isWishlisted) {
                console.log("Attempting to delete document:", wishlistRef.path);
                await deleteDoc(wishlistRef);
                console.log("Document deleted successfully");
                setIsWishlisted(false);
                console.log("Successfully removed from wishlist");
                Alert.alert("Success", "Property removed from wishlist");
            } else {
                const wishlistData = {
                    userId: user.uid,
                    propertyId: item.id,
                    propertyData: item,
                    addedAt: new Date().toISOString()
                };
                console.log("Saving wishlist data:", wishlistData);
                await setDoc(wishlistRef, wishlistData);
                setIsWishlisted(true);
                console.log("Successfully added to wishlist");
                Alert.alert("Success", "Property added to wishlist");
            }
        } catch (error) {
            console.error("Error updating wishlist:", error);
            console.error("Error details:", {
                code: error.code,
                message: error.message,
                stack: error.stack
            });
            Alert.alert("Error", "Failed to update wishlist");
        }

    };

    const deleteProperty = async () => {
        try {
            await deleteDoc(doc(firestore,"properties", propertyId));
            alert("Property deleted Successfully!");
            navigation.navigate("HomeScreen");
        } catch(error){
            alert("failed to delete property")
        }
    }
    
    return(
        <SafeAreaView style = {styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                {userRole === 'landlord' && (
                    <View style={styles.headerRight}>
                        <TouchableOpacity>
                            <Ionicons name="pencil" size={24} color="green" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={deleteProperty}>
                            <Ionicons name="trash" size={24} color="red" />
                        </TouchableOpacity>
                    </View>)}
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <FlatList
                    data={images}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContainer}  
                    keyExtractor={(url, index) => index.toString()}
                    renderItem={({ item: image }) => (
                        <Image 
                            source={{ uri: image }} 
                            style={styles.image} 
                        />
                    )}
                    pagingEnabled
                    snapToAlignment="center" 
                    snapToInterval={width}
                    decelerationRate="fast"
                />
                <View style={styles.propertyDetails}>
                    <Text style={styles.address}>{Address}, {City}</Text>
                    <Text style={styles.subText}>{City}, {Postcode.toUpperCase()}</Text>
                    <Text style={styles.price}>£{Rent} pcm</Text>
                    <Text style={styles.duration}>Rental Duration: {RentalDuration} months</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.propertyInfo}>
                    <Text style={styles.sectionTitle}>Property Details</Text>
                    <Text style={styles.infoText}><Text style={styles.boldText}>Type:</Text> {Type}</Text>
                    <Text style={styles.infoText}><Text style={styles.boldText}>Bedrooms:</Text> {Beds}</Text>
                    <Text style={styles.infoText}>{Description}</Text>
                </View>

                <TouchableOpacity 
                    style={[styles.listingButtons, isWishlisted && styles.wishlistedButton]} 
                    onPress={handleWishlist}
                >
                    <Text style={[styles.buttonText, isWishlisted && styles.wishlistedText]}>
                        {isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.listingButtons}>
                    <Text>Chat to Landlord</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.listingButtons} onPress={() => navigation.navigate("ReviewScreen", { propertyId: item.id })}>
                    <Text>Reviews</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    image: {
        width: width,
        height: 400,   
        resizeMode: 'contain',
    },
    imageScroll: {
        flexGrow: 0,
    },
    imageWrapper: {
        width: width,
        height: width*0.75,
    },
    noImageText: {
        textAlign: "center",
        fontSize: 16,
    },
    detailsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    propertyDetails: {
        marginTop: 15,
    },
    address: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    subText: {
        fontSize: 16,
        color: "#666",
        marginBottom: 5,
    },
    price: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#d32f2f",
        marginTop: 5,
    },
    duration: {
        fontSize: 16,
        color: "#444",
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 15,
    },
    propertyInfo: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    infoText: {
        fontSize: 16,
        color: "#555",
        marginBottom: 5,
    },
    boldText: {
        fontWeight: "bold",
        color: "#333",
    },
    listingButtons: {
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical:10,
        borderWidth: 1,
        backgroundColor: '#fff'
    },
    wishlistedButton: {
        backgroundColor: '#d32f2f',
        borderColor: '#d32f2f'
    },
    wishlistedText: {
        color: '#fff'
    },
    editButton: {
        backgroundColor: "red",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 10,
        borderWidth:1
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },

    headerRight: {
        flexDirection: 'row',
        gap:20,
        marginRight: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});

export default PropertyScreen;