import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db, storage } from './FirebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore'


const { width } = Dimensions.get("window");

const PreviewListing = ({ route, navigation }) => {
    const { Address, City, Postcode, RentalDuration, Rent, Type, Beds, Description, images } = route.params;
    const imageArray = images ? JSON.parse(images) : [];
    const [landlordID, setLandlordID] = useState('');

    useEffect (() => {
        const getLandlordId = async() =>{
            const landlord = auth.currentUser;
            setLandlordID(landlord.uid);
        }
        getLandlordId();
    })

    const SubmitListing = async () => {

        navigation.navigate("HomeScreen");

        const imageUploadPromises = imageArray.map(async (image, index) => {
            const response = await fetch(image.uri);
            const blob = await response.blob(); 
            const storageRef = ref(storage, `property_images/${Date.now()}_${index}`);
            await uploadBytes(storageRef, blob);
            return getDownloadURL(storageRef);
        });

        const imageUrls = await Promise.all(imageUploadPromises);

        const docRef = await addDoc(collection(db, "properties"), {
            landlordID,
            Address,
            City,
            Postcode,
            RentalDuration,
            Rent,
            Type,
            Beds,
            Description,
            images: imageUrls,
        });

        alert("Property listing submitted successfully!");
    
    };
    

    return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
      <View style={styles.banner}>
          <Image source={require("../../assets/images/FDM.png")} style={styles.bannerImage} />
          <Text style={styles.bannerText}>Flat Finder</Text>
      </View>
      <View style={styles.container}>
                <Text style={styles.title}>Preview</Text>
                
                <ScrollView style={styles.detailsContainer} showsVerticalScrollIndicator={false}>
                    <ScrollView 
                        horizontal 
                        pagingEnabled 
                        showsHorizontalScrollIndicator={false}
                        snapToAlignment="center"
                        snapToInterval={width}
                        decelerationRate="fast"
                        style={styles.imageScroll}
                    >
                        {(imageArray.map((img, index) =>
                            img?.uri ? (
                                <View key={index} style={styles.imageWrapper}>
                                    <Image source={{ uri: img.uri }} style={styles.image} />
                                </View>
                                ) : null
                            )
                        )}
                    </ScrollView>

                    <View style={styles.propertyDetails}>
                        <Text style={styles.address}>{Address}, {City}</Text>
                        <Text style={styles.subText}>{City}, {Postcode}</Text>
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

                    <TouchableOpacity style={styles.listingButtons}>
                        <Text>Save to Wishlist</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.listingButtons}>
                        <Text>Chat to Landlord</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.editButton} onPress={() => navigation.goBack()}>
                        <Text style={[styles.buttonText,{color:'#fff'}]}>Edit Listing</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitButton} onPress={SubmitListing}>
                        <Text style={[styles.buttonText, {color:'#000'} ]}>Submit Listing</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

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
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 15,
    },
    imageScroll: {
        flexGrow: 0,
    },
    imageWrapper: {
        width: width,
        height: width*0.75,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
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
        borderWidth: 1
    },

    editButton: {
        backgroundColor: "red",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 10,
        borderWidth:1
    },
    submitButton: {
        backgroundColor: '#c3fb04',
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
});

export default PreviewListing;