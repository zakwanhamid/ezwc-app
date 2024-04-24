import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AppMapView from './AppMapView';
import BinListView from './BinListView';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';
import { FIREBASE_DB } from '../../firebase';
import { collection, getDocs, query } from 'firebase/firestore';

const BinFinderScreen = () => {
  const navigation = useNavigation();
  const [selectedMarker,setSelectedMarker]=useState(0);
  const [binsData, setBinsData] = useState([]);
  
  const handleFavBin = () => {
    navigation.navigate('BinFavScreen');
  };

  useEffect(() => {
    // Fetch bins data from Firestore
    const fetchBinsData = async () => {
      try {
        const binsCollection = query(collection(FIREBASE_DB, 'bins'));
        const querySnapshot = await getDocs(binsCollection);

        const binData = [];
        querySnapshot.forEach((doc) => {
          binData.push({ id: doc.id, ...doc.data() });
        });

        setBinsData(binData);
        console.log("binData", binData)
      } catch (error) {
        console.error('Error fetching bins data:', error);
      }
    };

    fetchBinsData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const centerOnMarker = (binData) => {
    if (!binData || !binData.latitude || !binData.longitude) {
      console.error('Invalid binData:', binData);
      return;
    }
  
    const { latitude, longitude } = binData;
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.01, // Adjust the zoom level as needed
      longitudeDelta: 0.01,
    };
  
    // Update the map's region to center on the selected bin's location
    mapViewRef.current.animateToRegion(newRegion, 500); // Adjust the duration (in milliseconds) as needed
  };

  return (
    <SelectMarkerContext.Provider value={{selectedMarker, setSelectedMarker}}>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight:"600"}}>BinFinder</Text> 
        </View>
        <TouchableOpacity onPress={handleFavBin}>
          <MaterialIcons name="favorite" size={27} color="#529C4E" />
        </TouchableOpacity>
      </View>
      
      <AppMapView data={binsData} centerOnMarker={centerOnMarker}/>
      <View style={styles.binListContainer}>
        <BinListView data={binsData} centerOnMarker={centerOnMarker}/>
      </View>
    </SafeAreaView>
    </SelectMarkerContext.Provider>
    
  )
}

const styles = StyleSheet.create({
    container:{
      flex:1,
    },
    header:{
      flexDirection:"row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderBottomWidth:1,
      borderBottomColor: "#D8D9DB",
      marginLeft: 20,
    },
    titleContainer:{
      flex:1,
      justifyContent: "center",
      alignItems:"center",
      marginLeft: 10,
    },
    binListContainer:{
      position: 'absolute',
      bottom:120,
      zIndex:10,
      width: '100%'
    },
    
  })

export default BinFinderScreen