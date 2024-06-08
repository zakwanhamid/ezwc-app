import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, startAfter } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';
import Header from '../../components/ThriftScreen/Header';
import Slider from '../../components/ThriftScreen/Slider';
import Categories from '../../components/ThriftScreen/Categories';
import LatestItemList from '../../components/ThriftScreen/LatestItemList';
import { SafeAreaView } from 'react-native-safe-area-context';

const ThriftScreen = () => {
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latestItemList, setLatestItemList] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleAddListScreen = () => {
    navigation.navigate('AddListingScreen',{ onUpdate: getLatestItemList });
  };

  const handleListingFav = (currentUser) => {
    navigation.navigate('ListingFavScreen', { currentUser });
  };

  useEffect(() => {
    const currentUserUid = FIREBASE_AUTH.currentUser.uid;
    const userRef = doc(collection(FIREBASE_DB, 'users'), currentUserUid);

    const unsubscribe = onSnapshot(userRef, (documentSnapshot) => {
      if (documentSnapshot.exists()) {
        const userData = {
          id: documentSnapshot.id,
          ...documentSnapshot.data(),
        };
        setCurrentUser(userData);
      } else {
        console.log('User document does not exist');
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getSliders();
    getCategoryList();
    getLatestItemList();
  }, []);

  const getSliders = async () => {
    setSliderList([]);
    const querySnapshot = await getDocs(collection(FIREBASE_DB, 'sliders'));
    querySnapshot.forEach((doc) => {
      setSliderList((sliderList) => [...sliderList, doc.data()]);
    });
  };

  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(FIREBASE_DB, 'category'));
    querySnapshot.forEach((doc) => {
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };


  const getLatestItemList = async () => {
    const listingsCollection = query(
      collection(FIREBASE_DB, 'listings'),
      orderBy('timestamp', 'desc'),
      limit(10)
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
          userId: userData.userId, // Include userId here
          userName: userData.name,
          userEmail: userData.email,
          userHP: userData.userHP,
          userProfileImage: userData.profileImage
        };
      })
    );
  
    setLatestItemList(listingsList);
  };

  
  const handleSearch = async () => {
    setLatestItemList([]);
    const searchSnapshot = query(
      collection(FIREBASE_DB, 'listings'),
      orderBy('title'),
      // Use `where` clause if you want to filter based on title
      // For partial matching, consider using a more complex query or a library like Algoli
    );
    const snapshot = await getDocs(searchSnapshot);
    snapshot.forEach((doc) => {
      const itemData = {
        id: doc.id,
        ...doc.data(),
      };
      if (itemData.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        setLatestItemList((latestItemList) => [...latestItemList, itemData]);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleListingFav(currentUser)}>
          <MaterialIcons name="favorite-outline" size={24} color="#529C4E" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight: '600' }}>Thrift</Text>
        </View>
        <TouchableOpacity onPress={handleAddListScreen}>
          <MaterialIcons name="add-business" size={25} color="#529C4E" />
        </TouchableOpacity>
      </View>
      <View style={{ paddingBottom: 110 }}>
        <ScrollView>
          <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch}/>
          <Slider sliderList={sliderList} />
          <Categories categoryList={categoryList} />
          <LatestItemList latestItemList={latestItemList} heading={'Latest Items'} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D8D9DB',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 25,
  },
  searchBarContainer: {
    padding: 10,
  },
  searchBar: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
});

export default ThriftScreen;
