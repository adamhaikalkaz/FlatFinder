import { StyleSheet, TextInput, ScrollView, Dimensions, TouchableOpacity, Text, View, Pressable, Link, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ListingForm = ({navigation}) => {
  const [Address, setAddress] = useState('');
  const [City, setCity] = useState('');
  const [Postcode, setPostcode] = useState('');
  const [RentalDuration, setRentalDuration] = useState('');
  const [Rent, setRent] = useState('');
  const [Type, setType] = useState('');
  const [Beds, setBeds] = useState('');
  const [Description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({Address: false, City: false, Postcode: false, RentalDuration:false, Rent: false, Type:false, Beds:false, Description:false, images:false})
      
      
  async function pickImage() {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          aspect: [4, 3],
          allowsMultipleSelection: true,
          base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
          setImages(result.assets);
        }
    }
  
  const handlePreviewButton = () => {
    let newErrors = {Address: !Address, City: !City, Postcode: !Postcode, RentalDuration:!RentalDuration, Rent: !Rent, Type:!Type, Beds:!Beds, Description:!Description, images:!images};

    if (newErrors.Address || newErrors.City || newErrors.Postcode || newErrors.RentalDuration || newErrors.Rent || newErrors.Type || newErrors.Beds || newErrors.Description || newErrors.images) {
      setErrors(newErrors)
      Alert.alert("Missing Fields", "Please fill in all fields before previewing.");
      return;
    }
  
    // If all fields are filled, navigate to the PreviewListing screen
    navigation.navigate("PreviewListing", {

      Address,
      City,
      Postcode,
      RentalDuration,
      Rent,
      Type,
      Beds,
      Description,
      images: JSON.stringify(images),
    });
  };





  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Listing Form</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
            <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
                <Text style={styles.UploadText}> + Upload Image</Text>
            </TouchableOpacity>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToAlignment="center"
                snapToInterval={width}
                decelerationRate="fast"
                style={{flexGrow: 0}}>
                {images.length > 0 &&
                    images.map((img, index) =>
                        img?.uri ? (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri: img.uri }} style={styles.image} />
                            </View>
                        ) : null
                    )}
            </ScrollView>
        </View>
        <View>
          <Text style={styles.formTitle}>Address</Text>
          <TextInput style={[styles.input, errors.Address && { borderColor: "red" }]} value={Address} placeholder='Address' placeholderTextColor={'#999'} onChangeText={(text) => setAddress(text)}/>
          <View style={styles.rowInput}>
            <TextInput style={[styles.input, styles.halfInput, errors.City && { borderColor: "red" }]} value={City} placeholder="City" placeholderTextColor={'#999'} onChangeText={(text) => setCity(text)}/>
            <TextInput style={[styles.input, styles.halfInput, errors.Postcode && { borderColor: "red" }]} value={Postcode} placeholder="Postcode" placeholderTextColor={'#999'} onChangeText={(text) => setPostcode(text)}/>
          </View>

          <Text style={styles.formTitle}>Rental Duration (Months) :</Text>
          <TextInput style={[styles.input, errors.RentalDuration && { borderColor: "red" }]} value={RentalDuration} placeholder="Rental Duration (Months)" placeholderTextColor={'#999'} keyboardType='numeric' onChangeText={(text) => setRentalDuration(text)}/>

          <Text style={styles.formTitle}>Rental Price (£ per pcm)</Text>
          <TextInput style={[styles.input, errors.Rent && { borderColor: "red" }]} value={Rent} placeholder="Price £:" placeholderTextColor={'#999'} keyboardType='numeric' onChangeText={(text) => setRent(text)}/>

          <Text style={styles.formTitle}>Property Details</Text>
          <TextInput style={[styles.input, errors.Type && { borderColor: "red" }]} value={Type} placeholder="Type" placeholderTextColor={'#999'} onChangeText={(text) => setType(text)}/>
          <TextInput style={[styles.input, errors.Beds && { borderColor: "red" }]} value={Beds} placeholder="Number of Bedrooms" placeholderTextColor={'#999'} keyboardType='numeric' onChangeText={(text) => setBeds(text)}/>
          <TextInput style={[styles.input, errors.Description && { borderColor: "red" }]} value={Description} placeholder="Description" multiline={true} placeholderTextColor={'#999'} onChangeText={(text) => setDescription(text)}/>


          <TouchableOpacity style={styles.previewButton} onPress={handlePreviewButton} >
                <Text style={{ fontWeight:'bold' }}>Preview Listing</Text>
          </TouchableOpacity>


        </View>
      </ScrollView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
    padding:5,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  title: {
    fontSize: width * 0.1,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  formInput: {
    width: "100%", // Ensures form stretches
    maxWidth: 600, // Limit width for better readability
  },
  input: {
    borderColor: '#000',
    backgroundColor:'#fff',
    padding: 10,
    width: "100%", // Default: Full width
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  halfInput: {
    flex: 1, // Allows even splitting
  },
  formTitle: {
    fontWeight:'bold', 
    fontSize:18
  },

  previewButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c3fb04',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    marginTop:15,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  UploadText: {
      fontSize: width * 0.1,
      backgroundColor: '#ddd',
      fontWeight: 'bold',
  },
  imageUploadButton:{
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ddd',
      paddingVertical: 75,
      borderRadius: 10,
      marginBottom: 15,
      width: '100%',
      borderWidth: 3,
  },

  rowInput: {
    flexDirection: 'row', 
    gap: 10,
    width: '100%' 
  }, 

  image: {
      width: width,
      height: width*0.75,
      resizeMode: "contain",
      alignSelf: "center", 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
},
});

export default ListingForm;