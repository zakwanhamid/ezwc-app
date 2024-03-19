import { View, Text, Button, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/native';

const ModuleScreen = () => {
  const navigation = useNavigation();
  const handleModuleBg = () => {
    navigation.navigate('ModuleBgScreen');
  };
  useLayoutEffect(() => {
    navigation.setOptions({
        headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <View style={{alignItems: "center", marginTop: 20}}>
          <Image source={require('../../assets/modulePageImage.png')}/>
        </View>
        <View style={{justifyContent: "center", alignItems:"center"}}>
          <Text style={{fontSize: 30, fontWeight: 600, textAlign: "center", margin:20}}>
            Zero Waste Campus Digital Module
          </Text>
          <Text style={{fontSize: 20, fontWeight: 400, textAlign: "center", marginHorizontal: 20}}>
            Discover what it takes and what we can do to help build a 
            Zero Waste Campus by diving into the information and experiencing 
            the learning!
          </Text>
        </View>

        <View style={styles.btnContainer}>
          <TouchableOpacity style={styles.btn} onPress={handleModuleBg}>
            <Text style={{fontSize: 16, fontWeight:600}} > ENTER </Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container:{
      flex:1,
    },
    btnContainer:{
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    btn: {
      backgroundColor: "#529C4E",
      alignItems: "center",
      justifyContent: "center",
      width: 150,
      height: 40,
      borderRadius: 15,
      shadowColor: "#000",
      shadowOpacity: 0.5,
      shadowOffset:{
          width: 0,
          height: 2,
      }
    }
  })

export default ModuleScreen