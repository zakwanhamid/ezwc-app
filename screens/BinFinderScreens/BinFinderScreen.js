import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AppMapView from './AppMapView';
import BinListView from './BinListView';
import { SelectMarkerContext } from '../../Context/SelectMarkerContext';

const BinFinderScreen = () => {
  const navigation = useNavigation();
  const [selectedMarker,setSelectedMarker]=useState(0);

  const data = [
    {
        id: 1,
        title: "Bin 1",
        description: "Hamzah Sendut Library 1",
        binNum: 3,
        Type: "Paper, Glass, Plastics",
        location: {
          latitude: 5.3535,
          longitude: 100.29683
        }
    },
    {
        id: 2,
        title: "Bin 2",
        description: "Desasiswa Aman Damai",
        binNum: 4,
        Type: "Paper, Glass, Plastics, Metals",
        location: {
          latitude: 5.35577,
          longitude: 100.29877
        }
    },
    {
        id: 3,
        title: "Bin 3",
        description: "Desasiswa Tekun, Restu, Saujana",
        binNum: 2,
        Type: "Paper, Glass, Plastics, ",
        location: {
          latitude: 5.35461,
          longitude: 100.30040
        }

    },
    {
        id: 4,
        title: "Bin 4",
        description: "Desasiswa Fajar Harapan",
        binNum: 1,
        Type: "Metals",
        location: {
          latitude: 5.35663,
          longitude: 100.30121
        }
    },
];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SelectMarkerContext.Provider value={{selectedMarker, setSelectedMarker}}>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight:"600"}}>BinFinder</Text> 
        </View>
        <TouchableOpacity>
          <MaterialIcons name="favorite-outline" size={27} color="#529C4E" />
        </TouchableOpacity>
      </View>
      
      <AppMapView data={data}/>
      <View style={styles.binListContainer}>
        <BinListView data={data}/>
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