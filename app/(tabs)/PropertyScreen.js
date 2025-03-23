import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
import { db } from './FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get("window");

const PropertyScreen = ({navigation, route}) => {
    const { item, userRole } = route.params;
    const Address = item.Address;
    const City = item.City;
    const Postcode = item.Postcode;
    const Rent = item.Rent;
    const RentalDuration = item.RentalDuration;
    const Type = item.Type;
    const Beds = item.Beds;
    const Description = item.Description;
    const images = item.images;
    

    return(
        <SafeAreaView style = {styles.container}>
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

                <TouchableOpacity style={styles.listingButtons}>
                    <Text>Save to Wishlist</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.listingButtons}>
                    <Text>Chat to Landlord</Text>
                </TouchableOpacity>

               { userRole === "landlord" && (
                <TouchableOpacity style={styles.editButton} onPress={() => navigation.goBack()}>
                    <Text style={[styles.buttonText,{color:'#fff'}]}>Edit Listing</Text>
                </TouchableOpacity>)}
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
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});


export default PropertyScreen;