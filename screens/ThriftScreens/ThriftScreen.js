import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { FIREBASE_DB } from '../../firebase';
import Header from '../../components/ThriftScreen/Header';
import Slider from '../../components/ThriftScreen/Slider';


const ThriftScreen = () => {
  const [sliderList, setSliderList] = useState([]);
  
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  const handleAddListScreen = () => {
    navigation.navigate('AddListingScreen');
  };

  useEffect(()=>{
    getSliders();
  },[])

  //Used to get sliders for homescreen
  const getSliders = async () => {
    setSliderList([])
      const querySnapshot = await getDocs(collection(FIREBASE_DB, 'sliders'));
      querySnapshot.forEach((doc) => {
          // console.log(doc.id, "=>", doc.data());
          setSliderList(sliderList=>[...sliderList,doc.data()]);
      })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <AntDesign name="bars" size={25} color="#529C4E" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20, fontWeight: "600" }}>Thrift</Text>
        </View>
        <TouchableOpacity onPress={handleAddListScreen}>
          <MaterialIcons name="add-business" size={25} color="#529C4E" />
        </TouchableOpacity>
      </View>
      <Header/>
      <Slider sliderList={sliderList}/>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginLeft: 10,
  },
  searchBarContainer:{
    padding:10,
  },
  searchBar:{
      paddingHorizontal: 20,
      paddingVertical:10,
      borderColor: '#ccc',
      borderWidth:1,
      borderRadius:8,
  },
  })

export default ThriftScreen