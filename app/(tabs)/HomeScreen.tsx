import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import Slider from "@react-native-community/slider";
//import MultiSlider from "react-native-multi-slider";
import { Picker } from '@react-native-picker/picker';
import { auth, db } from './FirebaseConfig';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { Platform } from 'react-native'
import { SafeAreaView } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [listings, setListings] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState ('');
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const [priceRange, setPriceRange] = useState(2000);
  const [bedNumber, setBedNumber] = useState(1);
  const [rentalDuration, setRentalDuration] = useState(6);

  const [appliedPriceRange, setAppliedPriceRange] = useState(null);
  const [appliedBedNumber, setAppliedBedNumber] = useState(null);
  const [appliedRentalDuration, setAppliedRentalDuration] = useState(null);

  //const [hasBalcony, setHasBalcony] = useState(false);
  //const [allowsPets, setAllowsPets] = useState(false);

  const [selectedSortOption, setSelectedSortOption] = useState("default"); // Default sort option is 'None'
  const [appliedSortOption, setAppliedSortOption] = useState("default"); // Store the applied sort option

  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const [iOSLabel, setiOSLabel] = useState("None");

  const filterButtonStyle = appliedPriceRange === null ? styles.FilterSortButtonsNotApplied : styles.FilterSortButtonsApplied;
  const filterLabelStyle = appliedPriceRange === null ? styles.FilterSortButtonLabelsNotApplied : styles.FilterSortButtonLabelsApplied;
  const sortButtonStyle = appliedSortOption === "default" ? styles.FilterSortButtonsNotApplied : styles.FilterSortButtonsApplied;
  const sortLabelStyle = appliedSortOption === "default" ? styles.FilterSortButtonLabelsNotApplied : styles.FilterSortButtonLabelsApplied;




  useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, "properties"), (snapshot) => {
          const fetchedListings = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
          }));
          setListings(fetchedListings);
      });


      const getUserRole = async () => {
        const user = auth.currentUser; // Get the authenticated user
      
        if (user) {
          const userRef = doc(db,"user", user.uid)
          const userDoc = await getDoc(userRef)
      
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.user_type);
          } else {
            console.log('No such user document!');
            return null;
          }
        } 
      };
      getUserRole();

      return unsubscribe;
  }, []);

  const filteredListing = listings
  .filter(listings =>
    (listings.Address.toLowerCase().replace(/\s+/g, '').includes(search.toLowerCase().replace(/\s+/g, '')) ||
    listings.City.toLowerCase().replace(/\s+/g, '').includes(search.toLowerCase().replace(/\s+/g, '')) ||
    listings.Postcode.toLowerCase().replace(/\s+/g, '').includes(search.toLowerCase().replace(/\s+/g, ''))) &&
    (appliedPriceRange == null || listings.Rent <= appliedPriceRange) &&
    (appliedBedNumber == null || listings.Beds >= appliedBedNumber) &&
    (appliedRentalDuration == null || listings.RentalDuration >= appliedRentalDuration)
  
  )
  .sort((a, b) => {
    console.log("SORTING CALLED");
    console.log(appliedSortOption);
    console.log(`APPLIED, PRICE RANGE: ${appliedPriceRange}`)
    if (appliedSortOption == "priceAsc") {
      return a.Rent - b.Rent;
    }
    else if (appliedSortOption == "priceDesc") {
      console.log("SET TO PRICE DESC");
      return b.Rent - a.Rent;
    }
    else if (appliedSortOption == "bedrooms") {
      return a.Beds - b.Beds;
    }
    else if (appliedSortOption == "rental_duration") {
      return a.RentalDuration - b.RentalDuration;
    }
    return 0;
  })
  ;

  const handleApplyFilters = () => {
    setAppliedPriceRange(priceRange); // Update the applied sort option
    setAppliedBedNumber(bedNumber); // Update the applied sort option
    setAppliedRentalDuration(rentalDuration); // Update the applied sort option

    setModalVisible(false); // Close the modal after applying the sort option
  };

  
  const handleCancelFilters = () => {
    setPriceRange(2000);
    setBedNumber(1);
    setRentalDuration(6); // Reset to the previous applied option


    setModalVisible(false); // Close the modal without applying changes
  };

  const handleClearFilters = () => {
    setPriceRange(2000);
    setBedNumber(1);
    setRentalDuration(6);

    setAppliedPriceRange(null); // Update the applied sort option
    setAppliedBedNumber(null); // Update the applied sort option
    setAppliedRentalDuration(null); // Update the applied sort option

    setModalVisible(false); // Close the modal without applying changes
  };

    // Map the value to the label
    const labelMapping = {
      default: 'None',
      priceAsc: 'Price: Low to high',
      priceDesc: 'Price: High to low',
      bedrooms: 'Number of Bedrooms',
      rental_duration: 'Rental Duration',
    };
  
    const handlePickerChange = (itemValue) => {
      setSelectedSortOption(itemValue);
      // Update the label based on the selected value
      setiOSLabel(labelMapping[itemValue]);
    };

  const handleApplySort = () => {
    setAppliedSortOption(selectedSortOption); // Update the applied sort option
    setModalVisible2(false); // Close the modal after applying the sort option
    //console.log(`APPLIED, APPLY SET TO: ${appliedSortOption}`);
    //console.log(`APPLIED, SELECTED SET TO: ${selectedSortOption}`);
  };
  
  const handleCancelSort = () => {
    setSelectedSortOption(appliedSortOption); // Reset to the previous applied option
    setiOSLabel(labelMapping[appliedSortOption])
    setModalVisible2(false); // Close the modal without applying changes
    //console.log(`CANCELLED, SELECT SET TO: ${selectedSortOption}`);
  };

  const handleClearSort = () => {
    setSelectedSortOption("default");
    setAppliedSortOption("default");
    setiOSLabel("None");

    setModalVisible2(false); // Close the modal without applying changes
  };

  {/*
  // Conditional text based on the selected sort option
  const getSortText = () => {
    switch (appliedSortOption) {
      case 'priceAsc':
        return 'Sorting by Price Low to high';
      case 'priceDesc':
          return 'Sorting by Price High to low';
      case 'bedrooms':
        return 'Sorting by Number of Bedrooms';
      case 'rental_duration':
        return 'Sorting by Rental Duration';
      default:
        return 'Sort';
    }
  };

  // Conditional text based on the selected sort option
  const getFiltersText = () => {
    console.log("BED NUMBER: " + appliedBedNumber)
      if (appliedBedNumber == null) {
        return 'Filter';
      }
      else {
        return 'Filters Active';
      }
        
  };
  */}


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.banner}>
        <Image source={require("../../assets/images/FDM.png")} style={styles.bannerImage} />
        <Text style={styles.bannerText}>Flat Finder</Text>
      </View>
      
      <View style={styles.container}>

        <Text style={styles.title}>Flat Finder</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for flats..."
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filterSortContainer}>
          {/* Button to open modal */}
          <Button style={filterButtonStyle} mode="contained" onPress={() => setModalVisible(true)}>
            <View style={styles.buttonContent}>
              <Image source={require('../../assets/images/filter.png')} style={styles.filterSortImages} />
              <Text style={filterLabelStyle}>Filter</Text>
            </View>
          </Button>

          {/* Button to open modal */}
          <Button style={sortButtonStyle} mode="contained" onPress={() => setModalVisible2(true)}>
            <View style={styles.buttonContent}>
              <Image source={require('../../assets/images/sort.png')} style={styles.filterSortImages} />
              <Text style={sortLabelStyle}>Sort</Text>
            </View>
          </Button>
        </View>


        {/* Modal for Filter Options */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.title2}>Filters</Text>


              {/* Bed Number Slider */}
              <Text>Min beds: {bedNumber}</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={1}
                maximumValue={4}
                step={1}
                value={bedNumber}
                onValueChange={(value) => setBedNumber(value)}
              />

              {/* Price Range Slider */}
              <Text>Max pcm: £{priceRange}</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={500}
                maximumValue={4000}
                step={100}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value)}
              />

              {/* Rental Duration Slider */}
              <Text>Min Rental Duration: {rentalDuration} months</Text>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={1}
                maximumValue={12}
                step={1}
                value={rentalDuration}
                onValueChange={(value) => setRentalDuration(value)}
              />

              {/* Checkbox for Balcony */}
              {/* <View style={styles.filterRow}>
                <Text>Has Balcony</Text>
                <Switch value={hasBalcony} onValueChange={setHasBalcony} />
              </View> */}

              {/* Checkbox for Pets Allowed */}
              {/* <View style={styles.filterRow}>
                <Text>Allows Pets</Text>
                <Switch value={allowsPets} onValueChange={setAllowsPets} />
              </View> */}



              {/* Buttons */}
              <Button labelStyle={styles.clearFiltersLabel} mode="outlined" onPress={() => {handleClearFilters()}}>
                  Clear Filters
              </Button>
              <View style={styles.buttonRow}>
                <Button labelStyle={styles.cancelButtonLabel} mode="outlined" onPress={() => {handleCancelFilters()}}>
                  Cancel
                </Button>
                <Button
                labelStyle={styles.applyButtonLabel}
                  style={styles.applyButton}
                  mode="contained"
                  onPress={() => {handleApplyFilters()}}
                >
                  Apply
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal for Sort Options */}
        <Modal visible={modalVisible2} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.title2}>Sort By</Text>


              {/* iOS picker button */}
              {Platform.OS === 'ios' ? (
                <>
                  <TouchableOpacity
                    style={styles.iosButton}
                    onPress={() => setShowIOSPicker(true)}
                  >
                    <Text style={{ color: '#101010' }}>{iOSLabel}</Text>
                  </TouchableOpacity>

                  {/* iOS sub-modal for Picker */}
                  {showIOSPicker && (
                    <Modal visible={showIOSPicker} animationType="slide" transparent>
                      <View style={styles.iosPickerContainer}>
                        <SafeAreaView style={styles.iosPickerInner}>
                          <Picker
                            selectedValue={selectedSortOption}
                            style={{ height: 200, width: '100%' }} // 👈 Add this!
                            onValueChange={handlePickerChange}
                            
                          >
                            <Picker.Item label="None" value="default" color="#000" />
                            <Picker.Item label="Price: Low to high" value="priceAsc" color="#000" />
                            <Picker.Item label="Price: High to low" value="priceDesc" color="#000" />
                            <Picker.Item label="Number of Bedrooms" value="bedrooms" color="#000" />
                            <Picker.Item label="Rental Duration" value="rental_duration" color="#000" />
                          </Picker>
                          <TouchableOpacity
                            style={styles.buttonStyle}
                            onPress={() => setShowIOSPicker(false)}  // Action when button is pressed
                          >
                            <Text style={styles.iosButtonText}>Done</Text>
                          </TouchableOpacity>
                        </SafeAreaView>
                      </View>
                    </Modal>
                  )}
                </>
              ) : null}

              {/* Android picker */}
              {Platform.OS === 'android' ? (
                <Picker
                  selectedValue={selectedSortOption}
                  onValueChange={(value) => setSelectedSortOption(value)}  // Update selected option
                  style={{
                    height: 60,
                    borderColor: '#ccc',
                    borderWidth: 1,
                    borderRadius: 5,
                    marginBottom: 10,
                  }}
                >
                  <Picker.Item label="None" value="default" />
                  <Picker.Item label="Price: Low to high" value="priceAsc" />
                  <Picker.Item label="Price: High to low" value="priceDesc" />
                  <Picker.Item label="Number of Bedrooms" value="bedrooms" />
                  <Picker.Item label="Rental Duration" value="rental_duration" />
                </Picker>
              ) : null}

              {/* Buttons */}
              <Button labelStyle={styles.clearFiltersLabel} mode="outlined" onPress={handleClearSort}>
                Clear Sort
              </Button>

              <View style={styles.buttonRow}>
                <Button labelStyle={styles.cancelButtonLabel} mode="outlined" onPress={handleCancelSort}>
                  Cancel
                </Button>
                <Button
                  labelStyle={styles.applyButtonLabel}
                  style={styles.applyButton}
                  mode="contained"
                  onPress={handleApplySort}
                >
                  Apply
                </Button>
              </View>
            </View>
          </View>
        </Modal>
        
        { userRole === "landlord" &&
          (<TouchableOpacity style={styles.newListing} onPress={() => navigation.navigate("ListingForm")}>
            <Text style={styles.buttonText}>Add New Listing</Text>
        </TouchableOpacity>)}
        {filteredListing.length === 0 ? (
            <Text style={ styles.NoListings }>No listings found.</Text>
        ) : (
          <FlatList
            data={filteredListing}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.flatButton} onPress={() => navigation.navigate("PropertyScreen", {item,userRole})}>
                    <Image 
                        source={{ uri: item.images[0] }} 
                        style={{ width: "100%", height: 250, borderRadius: 10 }}
                        resizeMode="cover"
                    />
                    <View style={styles.propertyInfoContainer}>
                      {/* Address and City */}
                      <Text 
                        style={[styles.propertyInfo1, { flex: 1 }]} // Allow the address to take up available space
                        numberOfLines={1}          // Limit to a single line
                        ellipsizeMode="tail"       // Show ellipsis at the end if text overflows
                      >
                        {item.Address}, {item.City}
                      </Text>

                      {/* Rent */}
                      <Text 
                        style={[styles.propertyInfo1, { fontSize: 16, flexShrink: 0 }]} // Keep the rent text fixed width
                        numberOfLines={1}          // Limit to a single line
                        ellipsizeMode="tail"       // Show ellipsis at the end if text overflows
                      >
                        £{item.Rent} pcm
                      </Text>
                    </View>

                    <View style={styles.propertyInfo2Vertical}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                        <Image source={require('../../assets/images/bed.png')} style={{ width: 30, height: 30 }} />
                        <Text style={{ fontSize: 15, marginLeft: 5 }}>{item.Beds} Beds </Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 4 }}>
                        <Image source={require('../../assets/images/bathroom.png')} style={{ width: 22, height: 22, marginLeft: 4}} />
                        <Text style={{ fontSize: 15, marginLeft: 5, marginTop: 2 }}> 1 Bath    </Text>
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../../assets/images/clock.png')} style={{ width: 22, height: 22, marginLeft: 5, marginTop: 4 }} />
                        <Text style={{ fontSize: 15, marginLeft: 10}}>{item.RentalDuration} months </Text>
                      </View>
                    </View>



                </TouchableOpacity>
            )}
        />)}
        </View>
      </View>
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
  newListing:{
      alignItems:'center',
      borderWidth:1,
      borderRadius:5,
      padding:10,
      marginBottom:10,
      backgroundColor:'#c3fb04',
  },
  buttonText:{
      fontWeight:'bold'
  },
  flatButton: {
    marginBottom: 20, 
    padding: 10, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    //height: "80%",
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title2: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  filterSortContainer: {
    flexDirection: 'row',             // Align buttons horizontally (side by side)
    justifyContent: 'space-between',  // Space the buttons out
    alignItems: 'center',             // Vertically center the items
  },
  
  filterSortImages: {
    width: 25,
    height: 25,
    marginRight: 8,                  // Add space between the image and text
  },
  
  FilterSortButtonsNotApplied: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    width: 120,
    borderWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',             // Align content horizontally
    justifyContent: 'flex-start',     // Align to the left
    alignItems: 'center',             // Vertically center the content
  },
  
  FilterSortButtonLabelsNotApplied: {
    color: "black",
    fontSize: 16,
    padding: 0,
    margin: 0,
    textAlign: 'left', // Align text to the left
  },
  
  // Style for button content (image + text)
  buttonContent: {
    flexDirection: 'row',             // Align the image and text in a row
    alignItems: 'center',             // Vertically center the items
  },

  FilterSortButtonsApplied: {
    backgroundColor: "#c6ff00",
    borderRadius: 10,
    marginBottom: 10,
    width: 120,
    borderWidth: 1,
    borderColor: 'black',
    flexDirection: 'row',             // Align content horizontally
    justifyContent: 'flex-start',     // Align to the left
    alignItems: 'center',             // Vertically center the content
  },

  FilterSortButtonLabelsApplied: {
    color: "black",
    fontSize: 16,
    padding: 0,
    margin: 0,
    textAlign: 'left', // Align text to the left
  },

  clearFiltersLabel: {
    color: "red",
    
  },
  cancelButtonLabel: {
    color: "black",
  },

  applyButtonLabel: {
    color: "black",
  },
  applyButton: {
    backgroundColor: "#c6ff00",
  },

  propertyInfoContainer: {
    flexDirection: 'row',             // Align text components horizontally (side by side)
    justifyContent: 'flex-start',     // Keep the address and price aligned
    alignItems: 'center',             // Vertically center the items
    paddingVertical: 10,
    width: '100%',                    // Ensure the container takes up full width of the parent
  },
  propertyInfo1: {
    fontSize: 20,                     // Default font size for address and city
    fontWeight: 'bold',
    color: 'black',
  },

  propertyInfo2: { //For aligning horizontally
    flexDirection: 'row',             // Align text components horizontally (side by side)
    fontSize: 20,                     // Default font size for address and city
    fontWeight: 'bold',
    color: 'black',
  },

  propertyInfo2Vertical: { //For aligning vertically
    fontSize: 20,                     // Default font size for address and city
    fontWeight: 'bold',
    color: 'black',
  },
  NoListings :{
    fontSize: 18, 
    textAlign: 'center', 
    marginTop: 20
  },

  iosButton: {
    backgroundColor: '#D1D1D1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  iosPickerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  iosPickerInner: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 250, // 👈 Add this to ensure enough space for the picker
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },

  label: {
    fontSize: 16,
    color: '#101010',
    textAlign: 'center',
  },

  buttonStyle: {
    backgroundColor: '#FFFFFF',  // White background
    paddingVertical: 12,         // Vertical padding for button height
    paddingHorizontal: 20,       // Horizontal padding for button width
    borderRadius: 10,             // No rounded corners for a rectangular button
    alignSelf: 'center',         // Center the button horizontally
    marginTop: 10,               // Space above the button
    borderWidth: 1,              // Optional: Add border to make it more defined
    borderColor: '#000000',      // Black border to match text color
  },
  iosButtonText: {
    color: '#000000',            // Black text
    fontSize: 16,                // Text size
    textAlign: 'center',         // Center the text horizontally
  },
});