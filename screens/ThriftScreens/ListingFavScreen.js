import { StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import LatestItemList from '../../components/ThriftScreen/LatestItemList';
import { SafeAreaView } from 'react-native-safe-area-context';

const ListingFavScreen = () => {
    const [itemList,setItemList] = useState([]);
    const [currentUser ,setCurrentUser] = useState([]);

    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const goBack = () => {
        navigation.goBack(); // Go back to the previous screen\
        console.log('curretnUSerfav:',currentUser)
    };

    useEffect(() => {
      getUserData();
  }, []);

  const getUserData = () => {
      const currentUserUid = FIREBASE_AUTH.currentUser.uid;
      const userRef = doc(collection(FIREBASE_DB, "users"), currentUserUid);

      const unsubscribe = onSnapshot(userRef, (documentSnapshot) => {
          if (documentSnapshot.exists()) {
              const userData = {
                  id: documentSnapshot.id,
                  ...documentSnapshot.data(),
              }; // Include user ID in userData
              setCurrentUser(userData);
              if (userData.favListing && userData.favListing.length > 0) {
                  getItemListByListingIds(userData.favListing);
              } else {
                  setItemList([]); // Clear the item list if there are no favorite listings
              }
          } else {
              // Handle case where user document doesn't exist
              console.log("User document does not exist");
          }
      });
      return () => unsubscribe();
  };

  const getItemListByListingIds = async (listingIdsArray) => {
      try {
          const listingsCollection = query(
              collection(FIREBASE_DB, 'listings'),
              where('__name__', 'in', listingIdsArray),
              orderBy('timestamp', 'desc')
          );
          const listingsSnapshot = await getDocs(listingsCollection);
          const listingsList = await Promise.all(
              listingsSnapshot.docs.map(async (listingDoc) => {
                  const listingData = {
                      id: listingDoc.id,
                      ...listingDoc.data(),
                  };
                  const userDocRef = doc(FIREBASE_DB, 'users', listingData.userId);
                  const userDocSnapshot = await getDoc(userDocRef);

                  let userData = {};
                  if (userDocSnapshot.exists()) {
                      userData = {
                          userId: userDocSnapshot.id,
                          ...userDocSnapshot.data(),
                      };
                  } else {
                      userData = {
                          userId: listingData.userId,
                          name: 'Unknown',
                          email: 'Unknown',
                          userHP: 'Unknown',
                      };
                  }

                  return {
                      id: listingData.id,
                      image: listingData.image,
                      title: listingData.title,
                      price: listingData.price,
                      category: listingData.category,
                      desc: listingData.desc,
                      time: listingData.timestamp,
                      userId: userData.userId,
                      userName: userData.name,
                      userEmail: userData.email,
                      userHP: userData.userHP,
                      userProfileImage: userData.profileImage
                  };
              })
          );

          setItemList(listingsList);
          console.log("listingsList", listingsList);
      } catch (error) {
          console.error("Error fetching listings: ", error);}
    };


  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight: "600" }}>Favourite Items</Text>
            </View>
        </View>
        {itemList.length? <LatestItemList latestItemList={itemList} 
        heading = {''}/>
        : <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No item in your favourite...</Text>
        </View>
        }
    </SafeAreaView>
  )
}

export default ListingFavScreen

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#D8D9DB",
    },
    titleContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: -18,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        color: 'gray',
    },
})