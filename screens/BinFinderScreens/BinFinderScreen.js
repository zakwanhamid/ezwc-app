import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, getDocs, query } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import AppMapView from './AppMapView';
import BinListView from './BinListView';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';

const BinFinderScreen = () => {
  const navigation = useNavigation();
  const [selectedMarker, setSelectedMarker] = useState(0);
  const [binsData, setBinsData] = useState([]);

  const handleFavBin = () => {
    navigation.navigate('BinFavScreen');
  };

  useEffect(() => {
    const fetchBinsData = async () => {
      try {
        const binsCollection = query(collection(FIREBASE_DB, 'bins'));
        const querySnapshot = await getDocs(binsCollection);
        const binData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const latitude = parseFloat(data.latitude);
          const longitude = parseFloat(data.longitude);

          if (!isNaN(latitude) && !isNaN(longitude)) {
            binData.push({ id: doc.id, ...data, latitude, longitude });
          } else {
            console.error('Invalid bin data:', data);
          }
        });

        setBinsData(binData);
        console.log("binData", binData);
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

  return (
    <SelectMarkerContext.Provider value={{ selectedMarker, setSelectedMarker }}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>BinFinder</Text>
          </View>
          <TouchableOpacity onPress={handleFavBin}>
            <MaterialIcons name="favorite-outline" size={27} color="#529C4E" />
          </TouchableOpacity>
        </View>
        <AppMapView data={binsData} />
        <View style={styles.binListContainer}>
          <BinListView data={binsData} />
        </View>
      </SafeAreaView>
    </SelectMarkerContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#D8D9DB",
    marginLeft: 20,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  binListContainer: {
    position: 'absolute',
    bottom: 120,
    zIndex: 10,
    width: '100%'
  },
});

export default BinFinderScreen;
