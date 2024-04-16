import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import AppMapView from './AppMapView';

const BinFinderScreen = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight:"600"}}>BinFinder</Text> 
        </View>
        <TouchableOpacity>
          <MaterialIcons name="favorite-outline" size={27} color="#529C4E" />
        </TouchableOpacity>
      </View>
      <View>
        <AppMapView/>
      </View>
    </SafeAreaView>
    
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
    }
  })

export default BinFinderScreen