import { Dimensions, FlatList, Image, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebase';

const BinFavScreen = () => {
  const navigation = useNavigation();
  const [favBinsData, setFavBinsData] = useState([]);
  const [currentUser ,setCurrentUser] = useState([]);
  const [loading, setLoading] = useState(true);

  const goBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const currentUserUid = FIREBASE_AUTH.currentUser.uid;
    const userRef = doc(collection(FIREBASE_DB, 'users'), currentUserUid);
    

    const unsubscribe = onSnapshot(userRef, documentSnapshot => {
        if (documentSnapshot.exists()) {
            const userData = documentSnapshot.data(); // Get user data directly
            setCurrentUser(userData);
            setLoading(false);
        } else {
            // Handle case where user document doesn't exist
            console.log("User document does not exist");
        }
        
    });

    return () => unsubscribe();
  }, []);

  const fetchData = async (idsArray, setDataFunc) => {
    try {
        const dataPromises = idsArray.map(async (id) => {
            const docRef = doc(collection(FIREBASE_DB, 'bins'), id);
            const docSnapshot = await getDoc(docRef);
      
            if (docSnapshot.exists()) {
              return { id: docSnapshot.id, ...docSnapshot.data() };
            } else {
              return null;
            }
          });
      
          const data = await Promise.all(dataPromises);
          const filteredData = data.filter((item) => item !== null);
          setDataFunc(filteredData);
    } catch (error) {
    console.error('Error fetching data:', error);
    } finally {
    setLoading(false);
    }
};

  useEffect(() => {
    if (currentUser.favBin) {
    fetchData(currentUser.favBin, setFavBinsData);
    }
  }, [currentUser.favBin]);

  const onDirectionClick = (item) => {
    const latitude = item.latitude; // Assuming these fields are present in your item object
    const longitude = item.longitude;
  
    // Constructing the URL based on the platform with a query for directions
    const url = Platform.select({
      ios: `maps:${latitude},${longitude}?q=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });
  
    console.log('URL:', url);
  
    // Opening the URL to show directions
    Linking.openURL(url).catch(err => console.error('Error opening URL:', err));
  };
  

  const renderFavBinList = ({ item }) => (
    <View
      style={{
          backgroundColor: 'white',
          width: Dimensions.get('window').width,
          margin: 5,
          borderRadius: 10
          }}>
      <TouchableOpacity style={styles.favBtn} onPress={() => handleFavoriteBin(item.id)}>
          {currentUser.favBin.includes(item.id) ? (
              <MaterialIcons name="favorite" size={27} color="#529C4E" />
          ) : (
              <MaterialIcons name="favorite-outline" size={27} color="#529C4E" />
          )}
      </TouchableOpacity>
      
      <View style={{padding: 15, position: 'relative'}}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemDescription}>{item.description}</Text>

          <View style={{marginTop:5}}>
            <Text style={{color: 'gray', fontSize: 17}}>No. of Bin Available</Text>
            <View style={{flexDirection: 'row'}}>
                <Text style={{marginTop:2, fontSize: 20, fontWeight: 600}}>{item.binNum} </Text>
                <Text style={{ color: 'gray' ,marginTop:2, fontSize: 20}}>({item.type}) </Text>
            </View> 
          </View>
          <TouchableOpacity onPress={()=>onDirectionClick(item)}>
              <View style={styles.locationArrow}>
                  <FontAwesome name="location-arrow" size={25} color="white"/>
              </View>
          </TouchableOpacity>
    </View>

  </View>
  );

  const handleFavoriteBin = async (binId) => {
    try {
      const currentUserUid = FIREBASE_AUTH.currentUser.uid;
      const userRef = doc(FIREBASE_DB, 'users', currentUserUid); // Assuming currentUser has an 'id' field
      console.log('binId:',binId)

      // Check if binId is already in the favBin array
      if (currentUser.favBin.includes(binId)) {
        // Remove binId from favBin array
        const updatedFavBin = currentUser.favBin.filter(id => id !== binId);
        await updateDoc(userRef, {
          favBin: updatedFavBin
        });
        console.log('Bin removed from favorites:', binId);
      } else {
        // Add binId to favBin array
        const updatedFavBin = [...currentUser.favBin, binId];
        await updateDoc(userRef, {
          favBin: updatedFavBin
        });
        console.log('Bin added to favorites:', binId);
      }
    } catch (error) {
      console.error('Error handling favorite bin:', error);
    }
};


  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={goBack}>
                <Ionicons name='md-arrow-back' size={24} color="black"></Ionicons>
            </TouchableOpacity>
            <View style={styles.titleContainer}>
                <Text style={{ fontSize: 20, fontWeight:"600"}}>Favorite Bins</Text> 
            </View>
        </View>
        {favBinsData.length > 0 ? (
        <FlatList
          data={favBinsData}
          keyExtractor={(item) => item.id}
          renderItem={renderFavBinList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You have not favored any bin yet.</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default BinFavScreen

const styles = StyleSheet.create({
  container:{
    flex:1
},
header:{
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth:1,
    borderBottomColor: "#D8D9DB",
  },
titleContainer:{
    flex:1,
    justifyContent: "center",
    alignItems:"center",
    marginLeft: -9,
  },
  itemTitle: {
    fontSize: 23,
    fontWeight: '800',
  },
  itemDescription: {
      color: 'gray',
      fontSize: 14,
  },
  locationArrow: {
      padding: 12,
      backgroundColor: "#529C4E",
      borderRadius: 6,
      paddingHorizontal: 16,
      width: 55,
      position: 'absolute',
      bottom: 0,
      right: 0,
      margin: 10,
  },
  gradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 100, // Adjust the height of the gradient as needed
  },
  favBtn: {
      position: 'absolute', 
      right: 0, 
      marginTop: 12, 
      marginRight: 25,
      zIndex: 1
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