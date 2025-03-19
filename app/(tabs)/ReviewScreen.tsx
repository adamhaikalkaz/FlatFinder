import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';

async function getReviews(sortBy = "date_time_desc") {
  const db = getFirestore();
  let order_by;

  switch (sortBy) {
    case "date_time_desc":
      order_by = orderBy("date_time", "desc");
      break;
    case "date_time_asc":
      order_by = orderBy("date_time", "asc");
      break;
    case "rating_desc":
      order_by = orderBy("rating", "desc");
      break;
    case "rating_asc":
      order_by = orderBy("rating", "asc");
      break;
    default:
      order_by = orderBy("date_time", "desc");
  }

  const dataQuery = query(collection(db, "reviews"), order_by);

  try {
    const data = [];
    const snapshot = await getDocs(dataQuery);

    snapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    return data;
  } catch (error) {
    console.error("Error fetching reviews: ", error);
    return [];
  }
}

export default function ReviewScreen({ navigation }) {
  const [showSort, setShowSort] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState("date_time_desc");

  useEffect(() => {
    async function fetchReviews() {
      try {
        let revs = await getReviews(sortBy);
        setReviews(revs);
      } catch (error) {
        console.error("Error fetching reviews: ", error);
      }
    }
    fetchReviews();
  }, [sortBy]);

  function handleSortChange(option) {
    let firestoreSortOption = "date_time_desc";

    if (option === "newest") firestoreSortOption = "date_time_desc";
    else if (option === "oldest") firestoreSortOption = "date_time_asc";
    else if (option === "highest_rating") firestoreSortOption = "rating_desc";
    else if (option === "lowest_rating") firestoreSortOption = "rating_asc";

    setSortBy(firestoreSortOption);
  }

  return (
    <View style={styles.container}>
      <View style={styles.bottomContainer}>
        <Image source={require("../../assets/images/FDM.png")} style={styles.bottomImage} />
        <Text style={styles.bottomText}>Flat Finder</Text>
      </View>

      <ScrollView style={styles.mainContent}>
        <View style={styles.ButtonContainer}>
          <TouchableOpacity style={styles.Button} onPress={() => setShowSort(!showSort)}>
            <Text>Sort</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate('AddReviewScreen')}>
            <Text>Add Review</Text>
          </TouchableOpacity>
        </View>

        {showSort && <SortDropdown onSortChange={handleSortChange} />}

        {reviews.map((review) => (
          <View key={review.id}>
            <View style={styles.review}>
              <View style={styles.reviewHeader}>
                <View style={styles.userInfo}>
                  <Image source={require('../../assets/images/usericon.png')} style={styles.userIcon} />
                  <Text style={{ fontWeight: 'bold', color: 'black' }}>{review.name || "Anonymous"}</Text>
                </View>
                <Text style={{ color: 'black' }}>
                  <Text style={{ fontWeight: 'bold', color: 'black' }}>Rating: </Text>
                  {review.rating}/5
                </Text>
              </View>

              <Text style={styles.reviewText}>
                <Text style={{ fontWeight: 'bold' }}>Location: </Text>
                {review.property_location || "Unknown"}
              </Text>

              <Text style={[styles.reviewText, { marginTop: 8, fontWeight: 'bold' }]}>Review:</Text>
              <Text style={styles.reviewText}>{review.review || "No review provided."}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

function SortDropdown({ onSortChange }) {
  const [sortOption, setSortOption] = useState('newest');

  return (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={sortOption}
        onValueChange={(itemValue) => {
          setSortOption(itemValue);
          onSortChange(itemValue);
        }}
      >
        <Picker.Item label="Sort by Date (Newest)" value="newest" color="black" />
        <Picker.Item label="Sort by Date (Oldest)" value="oldest" color="black" />
        <Picker.Item label="Sort by Rating (Highest)" value="highest_rating" color="black" />
        <Picker.Item label="Sort by Rating (Lowest)" value="lowest_rating" color="black" />
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c3fb04',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 15,
  },
  mainContent: {
    paddingTop: 20,
    backgroundColor: '#2b2b2b',
    width: '100%',
  },
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  Button: {
    backgroundColor: '#c3fb04',
    borderRadius: 10,
    padding: 6,
    width: '30%',
    alignItems: 'center',
  },
  review: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: '95%',
    borderColor: 'black',
    alignItems: 'flex-start',
    color: 'black',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  reviewText: {
    marginTop: 8,
    color: 'black',
  },
  pickerContainer: {
    width: '95%',
    margin: 10,
    backgroundColor: 'white',
    padding: 10,
    height: 220,
    borderRadius: 10,
  },
  picker: {
    width: '100%',
    color: 'black',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    backgroundColor: '#c6ff00',
  },
  bottomImage: {
    width: 90,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
  },
  bottomText: {
    fontSize: 18,
    color: '#333',
  },
});